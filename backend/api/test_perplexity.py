"""
Test endpoint for Perplexity API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
import json
from typing import Optional

router = APIRouter()

class TestQuery(BaseModel):
    query: str

@router.post("/test-perplexity")
async def test_perplexity_api(query: TestQuery):
    """
    Test the Perplexity API with a simple query
    """
    try:
        api_key = os.getenv('PERPLEXITY_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="PERPLEXITY_API_KEY not configured")
        
        url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        payload = {
            "model": "llama-3-sonar-small-32k-online",
            "messages": [
                {
                    "role": "system", 
                    "content": "You are a helpful research assistant. Provide clear, concise, and accurate information."
                },
                {
                    "role": "user", 
                    "content": query.query
                }
            ],
            "max_tokens": 1000,
            "temperature": 0.2
        }
        
        # Testing Perplexity API
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            # Perplexity API error
            raise HTTPException(
                status_code=500, 
                detail=f"Perplexity API error: {response.status_code} - {response.text}"
            )
        
        result = response.json()
        
        if 'choices' not in result or not result['choices']:
            raise HTTPException(status_code=500, detail="Invalid response format from Perplexity API")
        
        content = result['choices'][0]['message']['content']
        
        return {
            "success": True,
            "result": content,
            "model": result.get('model', 'unknown'),
            "usage": result.get('usage', {})
        }
        
    except requests.exceptions.RequestException as e:
        # Request error
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
    except json.JSONDecodeError as e:
        # JSON decode error
        raise HTTPException(status_code=500, detail=f"Invalid JSON response: {str(e)}")
    except Exception as e:
        # Unexpected error
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
