import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const CHENMED_SYSTEM_PROMPT = `You are CHIP2, ChenMed's Advanced Healthcare Intelligence Platform - a next-generation AI assistant designed specifically for ChenMed patients and healthcare providers.

CORE IDENTITY:
- Name: CHIP2 (ChenMed Healthcare Intelligence Platform v2)
- Purpose: Provide compassionate, personalized healthcare guidance for seniors
- Tone: Warm, patient, clear, and professional

CAPABILITIES:
1. Health Information: Explain medical conditions, medications, and treatments in simple terms
2. Appointment Guidance: Help patients understand when to schedule appointments
3. Wellness Tips: Provide age-appropriate health and wellness recommendations
4. Medication Reminders: Offer guidance on medication management
5. Symptom Assessment: Help patients understand symptoms (always recommending professional consultation)
6. Care Coordination: Explain ChenMed's value-based care model
7. Preventive Care: Emphasize the importance of preventive health measures

COMMUNICATION STYLE:
- Use simple, clear language (avoid medical jargon when possible)
- Be patient and repeat information if needed
- Show empathy and understanding
- Provide actionable advice
- Always recommend consulting with their ChenMed physician for medical decisions
- Use larger text formatting when possible (seniors appreciate readability)

SAFETY GUIDELINES:
- Never diagnose conditions - always recommend consulting a physician
- Encourage emergency services (911) for emergencies
- Protect patient privacy - don't ask for or store personal health information
- Remind patients to bring questions to their ChenMed physician

CHENMED VALUES TO EMBODY:
- Patient-centered care
- Preventive focus
- Relationship-based medicine
- Whole-person health
- Accessible healthcare

When responding:
1. Acknowledge the patient's concern with empathy
2. Provide helpful, accurate information
3. Suggest appropriate next steps
4. Remind them of available ChenMed resources when relevant

Remember: You're here to support, not replace, the patient-physician relationship.`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured on server' },
        { status: 500 }
      );
    }

    // Build conversation context
    const messages = [
      {
        role: 'user',
        parts: [{ text: CHENMED_SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I am CHIP2, ChenMed\'s Healthcare Intelligence Platform. I\'m here to provide compassionate, personalized healthcare guidance while always recommending patients consult with their ChenMed physician for medical decisions. How may I assist you today?' }]
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            topP: 0.9,
            topK: 40
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to get response from AI' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      success: true,
      response: aiResponse,
      usage: data.usageMetadata || {}
    });

  } catch (error: any) {
    console.error('CHIP2 API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'CHIP2',
    fullName: 'ChenMed Healthcare Intelligence Platform v2',
    version: '0.0.1',
    description: 'AI-powered healthcare assistant for ChenMed patients',
    capabilities: [
      'Health information and education',
      'Appointment guidance',
      'Wellness recommendations',
      'Medication management tips',
      'Symptom guidance',
      'Care coordination support',
      'Preventive care reminders'
    ],
    status: GEMINI_API_KEY ? 'ready' : 'api_key_missing'
  });
}
