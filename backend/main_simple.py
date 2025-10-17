"""
Simple FastAPI backend for Happy Everyday Property Management
Focused on Perplexity AI integration without Django dependencies
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid

# Import services
from services.perplexity_service import PerplexityService
from services.property_analyzer import PropertyAnalyzer

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

class AnalyzeRequest(BaseModel):
    address: str

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
        if not os.getenv("PERPLEXITY_API_KEY"):
            raise HTTPException(status_code=500, detail="PERPLEXITY_API_KEY not configured")
        
        service = PerplexityService()
        result = service._make_request([{"role": "user", "content": request.query}])
        
        if result["success"]:
            return {"result": result["content"]}
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Perplexity API failed"))
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/analyze-property")
async def analyze_property(request: AnalyzeRequest):
    """Run comprehensive property analysis using Perplexity AI"""
    try:
        if not os.getenv("PERPLEXITY_API_KEY"):
            raise HTTPException(status_code=500, detail="PERPLEXITY_API_KEY not configured")

        analysis_id = str(uuid.uuid4())
        
        # Run analysis synchronously for now
        service = PerplexityService()
        PropertyAnalyzer._store_analysis_status(analysis_id, "processing", {
            "address": request.address,
            "progress": 0,
            "current_step": "Initializing analysis...",
        })

        PropertyAnalyzer._update_progress(analysis_id, 10, "Researching property with Perplexity AI...")
        raw_data = service.research_comprehensive_property(request.address)

        PropertyAnalyzer._update_progress(analysis_id, 60, "Transforming data for frontend...")
        transformed = PropertyAnalyzer.transform_comprehensive_report(raw_data, request.address, analysis_id)

        PropertyAnalyzer._update_progress(analysis_id, 80, "Saving analysis...")
        PropertyAnalyzer._store_analysis_result(analysis_id, transformed)
        PropertyAnalyzer._update_progress(analysis_id, 100, "Analysis complete")

        return {
            "analysis_id": analysis_id,
            "address": request.address,
            "status": "completed",
            "estimated_completion_time": 0,
            "analysis": transformed,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/property-analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get analysis result by ID"""
    result = PropertyAnalyzer.get_analysis_result(analysis_id)
    if result:
        return result
    raise HTTPException(status_code=404, detail="Analysis not found")

@app.get("/api/analytics/property-analysis-progress/{analysis_id}")
async def get_analysis_progress(analysis_id: str):
    """Get analysis progress by ID"""
    status = PropertyAnalyzer.get_analysis_status(analysis_id)
    if status:
        return status
    raise HTTPException(status_code=404, detail="Analysis not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main_simple:app", host="0.0.0.0", port=8000, reload=True)
