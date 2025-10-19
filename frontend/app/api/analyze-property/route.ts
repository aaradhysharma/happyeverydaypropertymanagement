import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address, prompt } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt || `Analyze the property at ${address}. Return ONLY this JSON format:

{
  "crime_data": {
    "total_crime_rate": 25.5,
    "violent_crime_rate": 3.2,
    "property_crime_rate": 22.3,
    "comparison": [
      {"category": "Total Crime", "subject": 25.5, "national_avg": 22.8, "state_avg": 19.5},
      {"category": "Violent Crime", "subject": 3.2, "national_avg": 3.6, "state_avg": 2.8},
      {"category": "Property Crime", "subject": 22.3, "national_avg": 19.2, "state_avg": 16.6}
    ]
  },
  "market_data": {
    "median_price": 185000,
    "rent_estimate": 1200,
    "price_per_sqft": 95,
    "rental_rates": [
      {"type": "Studio", "rent": 800},
      {"type": "1BR", "rent": 1000},
      {"type": "2BR", "rent": 1200},
      {"type": "3BR", "rent": 1400}
    ]
  }
}

Return ONLY valid JSON, no markdown.`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        error: errorData.error?.message || `Gemini API Error: ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ 
      content,
      success: true 
    });

  } catch (error: any) {
    console.error('Property analysis error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
