"""
Perplexity AI service for comprehensive property research
"""
import os
import json
import requests
from typing import Dict, Any, Optional


class PerplexityService:
    def __init__(self):
        self.api_key = os.getenv("PERPLEXITY_API_KEY")
        if not self.api_key:
            raise ValueError("PERPLEXITY_API_KEY environment variable is required")
        
        self.base_url = "https://api.perplexity.ai/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def _make_request(self, messages: list, model: str = "sonar") -> Dict[str, Any]:
        """Make request to Perplexity API"""
        try:
            payload = {
                "model": model,
                "messages": messages,
                "max_tokens": 3500,
                "temperature": 0.3,
                "top_p": 0.9,
                "return_citations": False,
                "search_domain_filter": ["perplexity.ai"],
                "return_images": False,
                "return_related_questions": False,
                "search_recency_filter": "month",
                "top_k": 0,
                "stream": False,
                "presence_penalty": 0,
                "frequency_penalty": 1
            }
            
            response = requests.post(self.base_url, headers=self.headers, json=payload)
            
            if response.status_code == 200:
                result = response.json()
                content = result["choices"][0]["message"]["content"]
                return {
                    "success": True,
                    "content": content,
                    "usage": result.get("usage", {})
                }
            else:
                return {
                    "success": False,
                    "error": f"API request failed: {response.status_code} - {response.text}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Request failed: {str(e)}"
            }

    def research_comprehensive_property(self, address: str) -> Dict[str, Any]:
        """Conduct a comprehensive deep research analysis for any property address."""
        prompt = f"""
        Conduct a comprehensive deep research analysis for {address}. Return JSON with the following exact top-level keys:
        location, property_profile, education, risk_assessment, insurance, crime_data, amenities, market_data, demographics, investment_summary.

        Required structure:
        {{
          "location": {{
            "address": string,
            "gps_coordinates": {{"lat": number, "lng": number}},
            "primary_city": string,
            "county": string,
            "nearest_airports": [
              {{"name": string, "distance_miles": number, "drive_time_minutes": number, "type": "major"|"regional"}}
            ],
            "transportation": {{
              "public_transit": string,
              "highway_access": [string]
            }}
          }},
          "property_profile": {{
            "property_name": string,
            "property_type": string,
            "units": number | null,
            "year_built": number | null,
            "lot_size_sqft": number | null
          }},
          "education": {{
            "summary": string,
            "schools_within_5_miles": [
              {{"name": string, "level": "elementary"|"middle"|"high", "distance_miles": number, "rating": number, "district": string}}
            ],
            "higher_education": [
              {{"name": string, "distance_miles": number, "drive_time_minutes": number}}
            ]
          }},
          "risk_assessment": {{
            "summary": string,
            "flood_zone": string,
            "historical_flood_events": string,
            "climate_risks": [string],
            "earthquake_risk": string
          }},
          "insurance": {{
            "average_hoi_cost": number | null,
            "tax_rate": number | null,
            "annual_property_tax": number | null,
            "hoa_fees": number | null,
            "risk_factors": [string]
          }},
          "crime_data": {{
            "summary": string,
            "risk_level": "LOW"|"MODERATE"|"HIGH",
            "statistics": {{
              "total_per_1000": number,
              "violent_per_1000": number,
              "property_per_1000": number,
              "theft_per_1000": number
            }},
            "comparison_chart": [
              {{"category": "Total Crime"|"Violent Crime"|"Property Crime"|"Theft", "subject": number, "national_avg": number, "state_avg": number}}
            ],
            "type_breakdown": [
              {{"name": string, "value": number, "percentage": number}}
            ],
            "trend_chart": [
              {{"year": number, "incidents": number, "rate": number}}
            ],
            "violent_breakdown": [
              {{"type": string, "incidents": number, "rate_vs_national": string, "risk": string}}
            ],
            "safety_recommendations": [string]
          }},
          "amenities": {{
            "summary": string,
            "restaurants": {{
              "total": number,
              "by_type": [{{"type": string, "count": number, "percentage": number}}]
            }},
            "healthcare": {{"hospitals": number, "clinics": number, "urgent_care": number}},
            "shopping": {{"major_centers": number, "notable_centers": [string]}},
            "recreation": [string]
          }},
          "market_data": {{
            "summary": string,
            "listing_price": number | null,
            "rent_estimate": number | null,
            "price_per_sqft": number | null,
            "confidence_score": number | null,
            "rental_rates": [{{"type": string, "rent": number, "sqft": number}}],
            "rental_price_distribution": [{{"range": string, "percentage": number}}],
            "regional_rent_comparison": [{{"market": string, "rent": number}}],
            "price_trend": [{{"year": number, "median_price": number}}]
          }},
          "demographics": {{
            "summary": string,
            "population": {{"current": number, "growth_rate_percent": number}},
            "median_household_income": number,
            "median_age": number,
            "unemployment_rate_percent": number,
            "education_attainment": {{
              "bachelor_plus_percent": number,
              "high_school_grad_percent": number
            }}
          }},
          "investment_summary": {{
            "overall_rating": number,
            "rating_breakdown": {{
              "market_fundamentals": number,
              "location_quality": number,
              "growth_potential": number,
              "risk_assessment": number,
              "cash_flow_potential": number
            }},
            "recommendation": string,
            "key_strengths": [string],
            "key_risks": [string],
            "roi_projection": {{
              "year_1_cash_flow_percent": number,
              "five_year_roi_percent": number,
              "cap_rate_percent": number,
              "total_return_projection": string
            }},
            "due_diligence": [string]
          }}
        }}

        Use only real, current data sources where possible. Provide numerical values as numbers, not strings with symbols. If a value is unknown, set it to null instead of inventing data. Keep analysis concise and factual.
        """

        messages = [{"role": "user", "content": prompt.strip()}]
        result = self._make_request(messages)

        if not result["success"]:
            return {"error": result.get("error", "Unknown error")}

        content = result.get("content", "")

        try:
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                json_str = content[json_start:json_end].strip()
            elif "{" in content and "}" in content:
                json_start = content.find("{")
                json_end = content.rfind("}") + 1
                json_str = content[json_start:json_end]
            else:
                json_str = content

            return json.loads(json_str)
        except json.JSONDecodeError:
            return {
                "raw_content": content,
                "error": "JSON parsing failed"
            }
