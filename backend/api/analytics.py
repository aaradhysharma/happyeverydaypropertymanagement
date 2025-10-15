"""
FastAPI endpoints for analytics and BI dashboard
"""
from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from typing import Optional
from datetime import datetime
from analytics.kpi_calculator import KPICalculator
from tasks import scrape_property_market
from core.models import PropertyMarketSnapshot

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_summary(
    property_id: Optional[int] = Query(None, description="Filter by property ID")
):
    """
    Get comprehensive dashboard summary with all KPIs
    Returns: occupancy rate, NOI, cash flow, maintenance costs, tenant retention, response times
    """
    try:
        summary = KPICalculator.get_dashboard_summary(property_id)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/market-data/refresh")
async def refresh_market_data(background_tasks: BackgroundTasks):
    """Trigger market data scraping task."""
    try:
        background_tasks.add_task(scrape_property_market.delay)
        return {"status": "queued"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/market-data/latest")
async def get_latest_market_data(
    property_id: int = Query(..., description="Property ID to retrieve market data for"),
    include_comparables: bool = Query(True, description="Include comparable listings")
):
    try:
        snapshot = PropertyMarketSnapshot.objects.filter(property_id=property_id).prefetch_related('comparables').first()
        if not snapshot:
            raise HTTPException(status_code=404, detail="No market data available")

        data = {
            "property_id": property_id,
            "source": snapshot.source,
            "source_url": snapshot.source_url,
            "fetched_at": snapshot.fetched_at,
            "listing_price": snapshot.listing_price,
            "rent_estimate": snapshot.rent_estimate,
            "price_per_sqft": snapshot.price_per_sqft,
            "beds": snapshot.beds,
            "baths": snapshot.baths,
            "square_feet": snapshot.square_feet,
            "year_built": snapshot.year_built,
            "lot_size_sqft": snapshot.lot_size_sqft,
            "confidence_score": snapshot.confidence_score,
            "meta": snapshot.meta,
        }

        if include_comparables:
            data["comparables"] = [
                {
                    "title": comp.title,
                    "address": comp.address,
                    "distance_miles": comp.distance_miles,
                    "price": comp.price,
                    "rent": comp.rent,
                    "beds": comp.beds,
                    "baths": comp.baths,
                    "square_feet": comp.square_feet,
                    "property_type": comp.property_type,
                    "url": comp.url,
                    "meta": comp.meta,
                }
                for comp in snapshot.comparables.all()
            ]

        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/occupancy")
async def get_occupancy_rate(
    property_id: Optional[int] = Query(None, description="Filter by property ID")
):
    """
    Get occupancy rate metrics
    Target: 85-95% occupancy
    """
    try:
        data = KPICalculator.calculate_occupancy_rate(property_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/noi")
async def get_net_operating_income(
    property_id: Optional[int] = Query(None, description="Filter by property ID"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
):
    """
    Get Net Operating Income (NOI) metrics
    NOI = Gross Rental Income - Operating Expenses
    """
    try:
        start = datetime.fromisoformat(start_date) if start_date else None
        end = datetime.fromisoformat(end_date) if end_date else None
        
        data = KPICalculator.calculate_noi(property_id, start, end)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cash-flow")
async def get_cash_flow_analysis(
    property_id: Optional[int] = Query(None, description="Filter by property ID"),
    months: int = Query(12, description="Number of months to analyze", ge=1, le=36)
):
    """
    Get monthly cash flow analysis
    Returns income, expenses, and net cash flow per month
    """
    try:
        data = KPICalculator.calculate_cash_flow(property_id, months)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/maintenance-costs")
async def get_maintenance_costs(
    property_id: Optional[int] = Query(None, description="Filter by property ID"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
):
    """
    Get maintenance cost per unit metrics
    Key operational efficiency indicator
    """
    try:
        start = datetime.fromisoformat(start_date) if start_date else None
        end = datetime.fromisoformat(end_date) if end_date else None
        
        data = KPICalculator.calculate_maintenance_cost_per_unit(property_id, start, end)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tenant-retention")
async def get_tenant_retention(
    property_id: Optional[int] = Query(None, description="Filter by property ID"),
    year: Optional[int] = Query(None, description="Year to analyze")
):
    """
    Get tenant retention rate
    Measures effectiveness of tenant relationship management
    """
    try:
        data = KPICalculator.calculate_tenant_retention_rate(property_id, year)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/response-times")
async def get_response_time_metrics(
    property_id: Optional[int] = Query(None, description="Filter by property ID"),
    days: int = Query(30, description="Number of days to analyze", ge=1, le=365)
):
    """
    Get maintenance response time metrics
    Key tenant satisfaction indicator
    """
    try:
        data = KPICalculator.calculate_response_time_metrics(property_id, days)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/properties")
async def get_properties_list():
    """
    Get list of all properties for filtering
    """
    try:
        from core.models import Property
        properties = Property.objects.filter(status='active').values(
            'id', 'name', 'city', 'state', 'total_units', 'property_type'
        )
        return {"properties": list(properties)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

