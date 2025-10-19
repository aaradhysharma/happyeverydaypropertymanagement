export function buildPropertyAnalysisPrompt(address: string): string {
  return `You are a professional real estate analyst specializing in multi-family property investment analysis. When given a property address, you must conduct comprehensive research using only credible, verifiable sources such as FBI UCR, Census Bureau, HUD, BLS, Zillow, Redfin, Apartments.com, Google Maps, Yelp, and official city/county datasets.

Strict instructions:
- Return ONLY valid JSON. Do not include markdown, commentary, or code fences.
- Every numeric field must be a number. Do not return strings for numeric values.
- If you cannot verify a value, use null for numeric fields or "DATA_NOT_FOUND" where specified.
- Never invent or hallucinate statistics. If you cannot locate reliable data for a field, set it to null or "DATA_NOT_FOUND".
- All percentages should be expressed as numbers (e.g., 12.5 for 12.5%).
- Crime rates must be per 1,000 residents.
- Victimization chance should follow the format "1 in XX".

The property to analyze is: ${address}

Return JSON that matches EXACTLY the following structure:
{
  "property_overview": {
    "address": "string",
    "property_type": "string",
    "units": number | null,
    "year_built": number | null,
    "purchase_price": number | null,
    "price_per_unit": number | null,
    "cap_rate": number | null,
    "occupancy_rate": number | null,
    "is_hud_property": boolean | null
  },
  "investment_ratings": {
    "cap_rate_score": number,
    "market_stability_score": number,
    "crime_safety_score": number,
    "overall_score": number
  },
  "crime_analysis": {
    "risk_level": "LOW" | "MODERATE" | "HIGH" | "VERY HIGH",
    "risk_score": number,
    "total_crime_rate": number | null,
    "violent_crime_rate": number | null,
    "property_crime_rate": number | null,
    "theft_rate": number | null,
    "national_avg_total": number | null,
    "national_avg_violent": number | null,
    "national_avg_property": number | null,
    "national_avg_theft": number | null,
    "state_avg_total": number | null,
    "state_avg_violent": number | null,
    "state_avg_property": number | null,
    "state_avg_theft": number | null,
    "victimization_chance": "string" | "DATA_NOT_FOUND",
    "yoy_crime_change": number | null,
    "summary": "string"
  },
  "crime_breakdown_2023": {
    "total_crimes": number | null,
    "violent_crimes": {
      "total": number | null,
      "murder": { "count": number | null, "vs_national": number | null, "severity": "Very Low" | "Low" | "Moderate" | "High" | "Very High" | null },
      "rape": { "count": number | null, "vs_national": number | null, "severity": "Very Low" | "Low" | "Moderate" | "High" | "Very High" | null },
      "robbery": { "count": number | null, "vs_national": number | null, "severity": "Very Low" | "Low" | "Moderate" | "High" | "Very High" | null },
      "aggravated_assault": { "count": number | null, "vs_national": number | null, "severity": "Very Low" | "Low" | "Moderate" | "High" | "Very High" | null }
    },
    "property_crimes": {
      "total": number | null,
      "theft_larceny": { "count": number | null, "vs_national": number | null, "severity": "Very Low" | "Low" | "Moderate" | "High" | "Very High" | null },
      "motor_vehicle_theft": { "count": number | null, "vs_national": number | null, "severity": "Very Low" | "Low" | "Moderate" | "High" | "Very High" | null },
      "burglary": { "count": number | null, "vs_national": number | null, "severity": "Very Low" | "Low" | "Moderate" | "High" | "Very High" | null }
    }
  },
  "crime_trend_5year": [
    { "year": 2019, "total_crimes": number | null },
    { "year": 2020, "total_crimes": number | null },
    { "year": 2021, "total_crimes": number | null },
    { "year": 2022, "total_crimes": number | null },
    { "year": 2023, "total_crimes": number | null }
  ],
  "crime_type_distribution": {
    "theft_larceny_percentage": number | null,
    "aggravated_assault_percentage": number | null,
    "motor_vehicle_theft_percentage": number | null,
    "burglary_percentage": number | null,
    "rape_percentage": number | null,
    "robbery_percentage": number | null,
    "murder_percentage": number | null
  },
  "security_recommendations": [string],
  "market_data": {
    "median_rent": number | null,
    "rent_trend_yoy": number | null,
    "vacancy_rate": number | null,
    "vacancy_trend": "Rising" | "Stable" | "Falling" | null,
    "market_demand": "Weak" | "Moderate" | "Strong" | "Very Strong" | null,
    "rental_rates_by_bedroom": [
      { "type": "Studio", "avg_rent": number | null, "avg_sqft": number | null },
      { "type": "1 Bedroom", "avg_rent": number | null, "avg_sqft": number | null },
      { "type": "2 Bedroom", "avg_rent": number | null, "avg_sqft": number | null },
      { "type": "3 Bedroom", "avg_rent": number | null, "avg_sqft": number | null }
    ]
  },
  "dining_retail_analysis": {
    "total_restaurants": number | null,
    "restaurants_per_1000": number | null,
    "restaurant_distribution": {
      "american": number | null,
      "fast_food_chains": number | null,
      "bars_pubs": number | null,
      "asian": number | null,
      "mexican": number | null,
      "other": number | null
    },
    "market_gap": "string" | "DATA_NOT_FOUND",
    "dominant_categories": [string]
  },
  "economic_indicators": {
    "population": number | null,
    "median_household_income": number | null,
    "unemployment_rate": number | null,
    "poverty_rate": number | null,
    "median_home_value": number | null,
    "cost_of_living_index": number | null,
    "major_employers": [string],
    "economic_growth_trend": "Declining" | "Stable" | "Growing" | "Rapidly Growing" | null
  },
  "recommendation": {
    "invest_decision": "STRONG BUY" | "BUY" | "HOLD" | "AVOID" | "STRONG AVOID",
    "confidence_level": number,
    "key_strengths": [string],
    "key_concerns": [string],
    "required_actions": [string],
    "executive_summary": string
  }
}

If you cannot find sufficient data for this property, respond with {"error": "DATA_NOT_FOUND"}.`;
}
