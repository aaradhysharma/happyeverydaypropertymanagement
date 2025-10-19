"""
Gemini AI service for comprehensive property research and analysis
"""
import os
import json
import requests
from typing import Dict, Any, Optional, List
import google.generativeai as genai
from datetime import datetime


class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
        # Alternative API endpoint for direct HTTP calls
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
        
    def _make_http_request(self, prompt: str, max_tokens: int = 4000) -> Dict[str, Any]:
        """Make direct HTTP request to Gemini API"""
        try:
            url = f"{self.base_url}?key={self.api_key}"
            headers = {
                "Content-Type": "application/json"
            }
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": max_tokens,
                    "topP": 0.8,
                    "topK": 40
                }
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 200:
                result = response.json()
                content = result["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "success": True,
                    "content": content,
                    "usage": result.get("usageMetadata", {})
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
    
    def _make_sdk_request(self, prompt: str) -> Dict[str, Any]:
        """Make request using Gemini SDK"""
        try:
            response = self.model.generate_content(prompt)
            return {
                "success": True,
                "content": response.text
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"SDK request failed: {str(e)}"
            }
    
    def research_comprehensive_property(self, address: str) -> Dict[str, Any]:
        """Conduct comprehensive property research using Gemini AI"""
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

        # Try HTTP request first, fallback to SDK
        result = self._make_http_request(prompt, max_tokens=4000)
        
        if not result["success"]:
            result = self._make_sdk_request(prompt)
        
        if not result["success"]:
            return {"error": result.get("error", "Unknown error")}

        content = result.get("content", "")

        try:
            # Extract JSON from response
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
    
    def analyze_property_market(self, address: str) -> Dict[str, Any]:
        """Analyze property market data using Gemini"""
        prompt = f"""
        Analyze the real estate market for {address}. Provide comprehensive market analysis including:
        
        1. Current market trends and pricing
        2. Rental market analysis
        3. Property value trends
        4. Comparable properties
        5. Market forecast
        
        Return structured JSON with market data, rental rates, price trends, and investment potential.
        Focus on recent data (2023-2024) and provide specific numbers where possible.
        """
        
        result = self._make_http_request(prompt, max_tokens=2000)
        
        if not result["success"]:
            return {"error": result.get("error", "Market analysis failed")}
        
        try:
            content = result["content"]
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                json_str = content[json_start:json_end].strip()
            else:
                json_str = content
            
            return json.loads(json_str)
        except json.JSONDecodeError:
            return {
                "raw_content": content,
                "error": "JSON parsing failed"
            }
    
    def analyze_crime_safety(self, address: str) -> Dict[str, Any]:
        """Analyze crime and safety data using Gemini"""
        prompt = f"""
        Analyze crime and safety statistics for {address}. Provide:
        
        1. Crime rates per 1,000 residents
        2. Crime trends over the last 5 years
        3. Safety recommendations
        4. Risk assessment
        5. Comparison to national/state averages
        
        Return structured JSON with crime statistics, trends, and safety analysis.
        Use recent data (2022-2024) and provide specific numbers.
        """
        
        result = self._make_http_request(prompt, max_tokens=2000)
        
        if not result["success"]:
            return {"error": result.get("error", "Crime analysis failed")}
        
        try:
            content = result["content"]
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                json_str = content[json_start:json_end].strip()
            else:
                json_str = content
            
            return json.loads(json_str)
        except json.JSONDecodeError:
            return {
                "raw_content": content,
                "error": "JSON parsing failed"
            }
    
    def analyze_amenities_quality(self, address: str) -> Dict[str, Any]:
        """Analyze local amenities and quality of life using Gemini"""
        prompt = f"""
        Analyze local amenities and quality of life factors for {address}. Provide:
        
        1. Restaurants and dining options
        2. Shopping and retail
        3. Healthcare facilities
        4. Entertainment and recreation
        5. Transportation access
        6. Overall quality of life score
        
        Return structured JSON with amenity counts, types, and quality ratings.
        Focus on proximity and accessibility to the property address.
        """
        
        result = self._make_http_request(prompt, max_tokens=2000)
        
        if not result["success"]:
            return {"error": result.get("error", "Amenities analysis failed")}
        
        try:
            content = result["content"]
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                json_str = content[json_start:json_end].strip()
            else:
                json_str = content
            
            return json.loads(json_str)
        except json.JSONDecodeError:
            return {
                "raw_content": content,
                "error": "JSON parsing failed"
            }
    
    def generate_investment_analysis(self, address: str, market_data: Dict, crime_data: Dict, amenities_data: Dict) -> Dict[str, Any]:
        """Generate comprehensive investment analysis using Gemini"""
        prompt = f"""
        Based on the following data for {address}, provide a comprehensive investment analysis:
        
        Market Data: {json.dumps(market_data, indent=2)}
        Crime Data: {json.dumps(crime_data, indent=2)}
        Amenities Data: {json.dumps(amenities_data, indent=2)}
        
        Provide:
        1. Overall investment rating (1-10)
        2. Key strengths and opportunities
        3. Major risks and concerns
        4. ROI projections
        5. Investment recommendation
        6. Due diligence requirements
        
        Return structured JSON with specific ratings and recommendations.
        """
        
        result = self._make_http_request(prompt, max_tokens=2000)
        
        if not result["success"]:
            return {"error": result.get("error", "Investment analysis failed")}
        
        try:
            content = result["content"]
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                json_str = content[json_start:json_end].strip()
            else:
                json_str = content
            
            return json.loads(json_str)
        except json.JSONDecodeError:
            return {
                "raw_content": content,
                "error": "JSON parsing failed"
            }
