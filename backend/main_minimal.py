"""
Minimal FastAPI backend for testing Perplexity API
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI(
    title="Happy Everyday Property Management API",
    description="AI-Powered Property Management System",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestQuery(BaseModel):
    query: str

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Happy Everyday Property Management API",
        "version": "0.1.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.1.0"}

@app.post("/api/test-perplexity")
async def test_perplexity_api(request: TestQuery):
    """Test Perplexity API with a simple query"""
    try:
        api_key = os.getenv("PERPLEXITY_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="PERPLEXITY_API_KEY not configured")
        
        # Clean the API key (remove any whitespace/newlines)
        api_key = api_key.strip()
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "sonar",
            "messages": [{"role": "user", "content": request.query}],
            "max_tokens": 1000,
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
        
        response = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            return {"result": content}
        else:
            raise HTTPException(
                status_code=500, 
                detail=f"Perplexity API failed: {response.status_code} - {response.text}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main_minimal:app", host="0.0.0.0", port=8000, reload=True)
