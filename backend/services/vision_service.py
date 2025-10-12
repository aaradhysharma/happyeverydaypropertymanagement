"""
OpenAI GPT-4V integration for property inspection analysis
Automated damage detection using computer vision
"""
import os
import base64
import json
from typing import Dict, List, Optional
from openai import OpenAI
from pathlib import Path

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


class VisionService:
    """Property inspection analysis using GPT-4 Vision"""
    
    INSPECTION_PROMPT = """
    Analyze this property image for damage and maintenance issues. Focus on:
    
    1. ROOF CONDITION: Missing shingles, structural damage, wear patterns
    2. STRUCTURAL ISSUES: Cracks, foundation problems, wall damage
    3. HVAC SYSTEMS: Visible equipment condition, rust, damage
    4. WATER DAMAGE: Stains, mold, moisture indicators
    5. EXTERIOR: Paint condition, siding damage, windows, doors
    6. SAFETY HAZARDS: Any immediate safety concerns
    
    Provide a detailed JSON response with the following structure:
    {
        "damage_items": [
            {
                "damage_type": "type of damage",
                "location": "where on property",
                "severity": 1-10 (1=minor, 10=critical),
                "confidence": 0.0-1.0,
                "description": "detailed description",
                "recommendations": "repair recommendations",
                "estimated_cost_range": "low-high estimate in USD"
            }
        ],
        "overall_condition": "excellent/good/fair/poor/critical",
        "priority_items": ["list of urgent repairs needed"],
        "estimated_total_cost": "total repair cost estimate",
        "summary": "overall property condition summary"
    }
    """
    
    @staticmethod
    def encode_image(image_path: str) -> str:
        """Encode image to base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    @classmethod
    def analyze_property_image(cls, image_path: str) -> Dict:
        """
        Analyze a single property image using GPT-4V
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dictionary with analysis results
        """
        try:
            # Encode image
            if image_path.startswith('http'):
                image_content = {"type": "image_url", "image_url": {"url": image_path}}
            else:
                base64_image = cls.encode_image(image_path)
                image_content = {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                }
            
            # Call GPT-4V
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": cls.INSPECTION_PROMPT},
                            image_content
                        ],
                    }
                ],
                max_tokens=2000,
            )
            
            # Parse response
            content = response.choices[0].message.content
            
            # Try to extract JSON from response
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
                analysis = json.loads(json_str)
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
                analysis = json.loads(json_str)
            else:
                try:
                    analysis = json.loads(content)
                except json.JSONDecodeError:
                    # Fallback if not JSON
                    analysis = {
                        "damage_items": [],
                        "overall_condition": "unknown",
                        "priority_items": [],
                        "summary": content,
                        "raw_response": content
                    }
            
            return {
                "success": True,
                "analysis": analysis,
                "model": "gpt-4o",
                "image_path": image_path
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "image_path": image_path
            }
    
    @classmethod
    def analyze_multiple_images(cls, image_paths: List[str]) -> Dict:
        """
        Analyze multiple property images
        
        Args:
            image_paths: List of image file paths
            
        Returns:
            Consolidated analysis from all images
        """
        results = []
        all_damage_items = []
        priority_items = set()
        total_cost = 0
        
        for image_path in image_paths:
            result = cls.analyze_property_image(image_path)
            results.append(result)
            
            if result.get('success') and 'analysis' in result:
                analysis = result['analysis']
                
                if 'damage_items' in analysis:
                    all_damage_items.extend(analysis['damage_items'])
                
                if 'priority_items' in analysis:
                    priority_items.update(analysis['priority_items'])
        
        # Calculate average severity
        severities = [item.get('severity', 0) for item in all_damage_items]
        avg_severity = sum(severities) / len(severities) if severities else 0
        
        # Determine overall condition
        if avg_severity >= 8:
            overall_condition = "critical"
        elif avg_severity >= 6:
            overall_condition = "poor"
        elif avg_severity >= 4:
            overall_condition = "fair"
        elif avg_severity >= 2:
            overall_condition = "good"
        else:
            overall_condition = "excellent"
        
        return {
            "success": True,
            "total_images_analyzed": len(image_paths),
            "individual_results": results,
            "consolidated_analysis": {
                "all_damage_items": all_damage_items,
                "priority_items": list(priority_items),
                "overall_condition": overall_condition,
                "average_severity": round(avg_severity, 2),
                "total_damage_items": len(all_damage_items)
            }
        }
    
    @classmethod
    def analyze_roof_condition(cls, image_path: str) -> Dict:
        """
        Specialized roof condition analysis
        Based on research: GPT-4V can identify missing shingles and structural damage
        """
        roof_prompt = """
        Perform a detailed roof inspection analysis on this image. Focus specifically on:
        
        1. Missing or damaged shingles
        2. Structural integrity
        3. Wear patterns and aging
        4. Water damage indicators
        5. Flashing condition
        6. Gutter condition
        7. Overall roof lifespan estimation
        
        Provide JSON response:
        {
            "roof_type": "shingle/tile/metal/flat/other",
            "estimated_age": "years",
            "condition_score": 1-10,
            "issues_found": [
                {
                    "issue": "description",
                    "severity": 1-10,
                    "location": "area of roof",
                    "repair_urgency": "immediate/urgent/routine/monitor"
                }
            ],
            "estimated_remaining_lifespan": "years",
            "repair_recommendations": ["list of recommendations"],
            "estimated_repair_cost": "USD estimate"
        }
        """
        
        try:
            if image_path.startswith('http'):
                image_content = {"type": "image_url", "image_url": {"url": image_path}}
            else:
                base64_image = cls.encode_image(image_path)
                image_content = {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                }
            
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": roof_prompt},
                            image_content
                        ],
                    }
                ],
                max_tokens=1500,
            )
            
            content = response.choices[0].message.content
            
            # Extract JSON
            if "```json" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
                analysis = json.loads(json_str)
            else:
                try:
                    analysis = json.loads(content)
                except:
                    analysis = {"raw_response": content}
            
            return {
                "success": True,
                "roof_analysis": analysis,
                "model": "gpt-4o"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

