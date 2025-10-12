"""
FastAPI + Django integration for Happy Everyday Property Management Platform
Scenario D: FastAPI encapsulating Django in single ASGI process
"""
import os
import django
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from api import analytics, inspections, providers, privacy
from middleware.auth import get_current_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for FastAPI app"""
    print("🚀 Happy Everyday Property Management API starting...")
    yield
    print("👋 Shutting down...")


app = FastAPI(
    title="Happy Everyday Property Management API",
    description="AI-Powered Property Management System",
    version="0.0.1",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

