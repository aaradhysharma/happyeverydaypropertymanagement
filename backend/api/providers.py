"""
FastAPI endpoints for service provider management
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
from core.models import ServiceProvider, MaintenanceRequest
from services.dispatch_service import DispatchService

router = APIRouter()


@router.get("/list")
async def get_service_providers(
    provider_type: Optional[str] = None,
    is_available: Optional[bool] = None,
    min_rating: Optional[float] = None
):
    """
    Get list of service providers with optional filters
    """
    try:
        providers = ServiceProvider.objects.all()
        
        if provider_type:
            providers = providers.filter(provider_type=provider_type)
        if is_available is not None:
            providers = providers.filter(is_available=is_available)
        if min_rating is not None:
            providers = providers.filter(rating__gte=min_rating)
        
        providers = providers.order_by('-rating')
        
        results = []
        for provider in providers:
            results.append({
                "id": provider.id,
                "name": provider.name,
                "company_name": provider.company_name,
                "provider_type": provider.provider_type,
                "rating": float(provider.rating),
                "total_jobs": provider.total_jobs,
                "is_available": provider.is_available,
                "hourly_rate": float(provider.hourly_rate) if provider.hourly_rate else None,
                "phone": provider.phone,
                "email": provider.email
            })
        
        return {
            "total": len(results),
            "providers": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/assign/{request_id}")
async def auto_assign_provider(request_id: int):
    """
    Automatically assign best available provider to maintenance request
    """
    try:
        result = DispatchService.auto_assign_request(request_id)
        
        if not result.get('success'):
            raise HTTPException(status_code=400, detail=result.get('error'))
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/schedule/{provider_id}")
async def get_provider_schedule(
    provider_id: int,
    date: Optional[str] = None
):
    """
    Get daily schedule for a service provider
    """
    try:
        date_obj = datetime.fromisoformat(date) if date else datetime.now()
        schedule = DispatchService.get_daily_schedule(provider_id, date_obj)
        return schedule
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/route/{provider_id}")
async def get_optimized_route(
    provider_id: int,
    date: Optional[str] = None
):
    """
    Get optimized route for provider's daily schedule
    """
    try:
        date_obj = datetime.fromisoformat(date) if date else datetime.now()
        route = DispatchService.optimize_route(provider_id, date_obj)
        return route
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/types")
async def get_provider_types():
    """
    Get available provider types
    """
    return {
        "types": [
            {"value": "landscaping", "label": "Landscaping"},
            {"value": "snow_removal", "label": "Snow Removal"},
            {"value": "hvac", "label": "HVAC"},
            {"value": "plumbing", "label": "Plumbing"},
            {"value": "electrical", "label": "Electrical"},
            {"value": "general", "label": "General Repairs"},
        ]
    }


@router.get("/stats")
async def get_provider_stats():
    """
    Get overall provider network statistics
    """
    try:
        total_providers = ServiceProvider.objects.count()
        available_providers = ServiceProvider.objects.filter(is_available=True).count()
        avg_rating = ServiceProvider.objects.aggregate(
            avg=models.Avg('rating')
        )['avg'] or 0
        
        # Get provider type distribution
        from django.db import models
        type_distribution = ServiceProvider.objects.values('provider_type').annotate(
            count=models.Count('id')
        )
        
        return {
            "total_providers": total_providers,
            "available_providers": available_providers,
            "average_rating": round(float(avg_rating), 2),
            "type_distribution": list(type_distribution)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

