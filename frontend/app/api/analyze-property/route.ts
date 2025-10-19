import { NextRequest, NextResponse } from "next/server";
import { buildPropertyAnalysisPrompt } from "./promptTemplate";
import { PropertyAnalysisSchema, clampAnalysisScores } from "../../../lib/property-analysis/schema";

async function callGemini(prompt: string, apiKey: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API Error: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "";

  if (!content) {
    throw new Error("Gemini returned an empty response");
  }

  return content.trim();
}

function extractJson(content: string): string {
  let jsonContent = content;
  if (jsonContent.includes("```")) {
    const firstFence = jsonContent.indexOf("```");
    const lastFence = jsonContent.lastIndexOf("```");
    if (firstFence !== -1 && lastFence !== -1 && lastFence > firstFence) {
      jsonContent = jsonContent.substring(firstFence + 3, lastFence);
    }
  }
  return jsonContent.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const address: string = (body?.address || "").trim();

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const prompt = buildPropertyAnalysisPrompt(address);

    let rawContent: string;
    try {
      rawContent = await callGemini(prompt, apiKey);
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Gemini request failed" }, { status: 502 });
    }

    if (rawContent.includes("DATA_NOT_FOUND")) {
      return NextResponse.json({ error: "DATA_NOT_FOUND" }, { status: 404 });
    }

    const jsonString = extractJson(rawContent);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch {
      return NextResponse.json({ error: "Gemini returned invalid JSON" }, { status: 502 });
    }

    let validated;
    try {
      validated = PropertyAnalysisSchema.parse(parsedJson);
    } catch (error) {
      console.error("Validation error", error);
      return NextResponse.json({ error: "Gemini response failed validation" }, { status: 502 });
    }

    const sanitized = clampAnalysisScores(validated);

    return NextResponse.json({ success: true, data: sanitized });
  } catch (error: any) {
    console.error("Property analysis error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
