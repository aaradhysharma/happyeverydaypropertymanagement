"""
FastAPI endpoints for analytics and BI dashboard
"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from datetime import datetime
from analytics.kpi_calculator import KPICalculator

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

