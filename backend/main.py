"""
FastAPI backend for Happy Everyday Property Management Platform
Simplified architecture without Django dependencies
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api import analytics, inspections, providers, privacy, test_perplexity


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for FastAPI app"""
    # API startup
    yield
    # API shutdown


app = FastAPI(
    title="Happy Everyday Property Management API",
    description="AI-Powered Property Management System",
    version="0.0.1",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://happyeveryday.vercel.app"],  # Specific origins only
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Happy Everyday Property Management API",
        "version": "0.0.1",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "0.0.1"}


# Include routers
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(inspections.router, prefix="/api/inspections", tags=["Inspections"])
app.include_router(providers.router, prefix="/api/providers", tags=["Service Providers"])
app.include_router(privacy.router, prefix="/api/privacy", tags=["Privacy & Compliance"])
app.include_router(test_perplexity.router, prefix="/api", tags=["Testing"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

