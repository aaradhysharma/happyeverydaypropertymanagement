import { NextRequest, NextResponse } from 'next/server';

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

    const prompt = `You are a real estate intelligence analyst. Using only credible, current (2022-2024) public data sources such as FBI UCR, Census Bureau, HUD, Zillow, Redfin, and local government open-data portals, provide quantitative insight for the property located at ${address}.

Return a single valid JSON object (no markdown, backticks, or commentary) with the following structure:
{
  "crime_data": {
    "summary": string,
    "total_crime_rate": number,
    "violent_crime_rate": number,
    "property_crime_rate": number,
    "comparison": [
      {"category": "Total Crime", "subject": number, "national_avg": number, "state_avg": number},
      {"category": "Violent Crime", "subject": number, "national_avg": number, "state_avg": number},
      {"category": "Property Crime", "subject": number, "national_avg": number, "state_avg": number}
    ],
    "trend": [
      {"year": number, "rate": number}
    ]
  },
  "market_data": {
    "summary": string,
    "median_price": number | null,
    "rent_estimate": number | null,
    "price_per_sqft": number | null,
    "rental_rates": [
      {"type": string, "rent": number | null}
    ],
    "price_trend": [
      {"year": number, "price": number | null}
    ]
  },
  "amenities": {
    "summary": string,
    "restaurants": number | null,
    "shopping_centers": number | null,
    "schools": number | null,
    "hospitals": number | null,
    "parks": number | null
  },
  "investment": {
    "rating": number,
    "roi_potential": string,
    "key_strengths": [string],
    "key_risks": [string]
  }
}

All numeric fields must be numbers (not strings). Use null when a value cannot be verified. If you cannot find sufficient data for this address, respond with {"error": "DATA_NOT_FOUND"}. Do not fabricate statistics.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }],
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      return NextResponse.json(
        {
          error: errorData.error?.message || `Gemini API Error: ${geminiResponse.status}`,
        },
        { status: geminiResponse.status }
      );
    }

    const data = await geminiResponse.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const content = parts.map((part: { text?: string }) => part.text || "").join("");

    if (!content) {
      return NextResponse.json(
        { error: "Gemini returned an empty response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ content, success: true });
  } catch (error: any) {
    console.error("Property analysis error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
