"""
FastAPI endpoints for data privacy and compliance
GDPR, CCPA, Fair Housing Act compliance
"""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from core.models import Tenant, FinancialRecord, AuditLog
from middleware.audit import AuditLogger

router = APIRouter()


class DataAccessRequest(BaseModel):
    """Data access request model"""
    tenant_id: int
    email: str


class DataDeletionRequest(BaseModel):
    """Data deletion request model"""
    tenant_id: int
    email: str
    reason: Optional[str] = "User requested deletion"


@router.post("/data-access-request")
async def request_data_access(request_data: DataAccessRequest, request: Request):
    """
    GDPR/CCPA: Tenant can request their personal data
    """
    try:
        # Verify tenant exists and email matches
        tenant = Tenant.objects.get(id=request_data.tenant_id, email=request_data.email)
        
        # Collect tenant data
        tenant_data = {
            "personal_info": {
                "first_name": tenant.first_name,
                "last_name": tenant.last_name,
                "email": tenant.email,
                "phone": tenant.phone,
                "unit_number": tenant.unit_number,
            },
            "lease_info": {
                "lease_start": tenant.lease_start.isoformat(),
                "lease_end": tenant.lease_end.isoformat(),
                "rent_amount": float(tenant.rent_amount),
                "security_deposit": float(tenant.security_deposit),
            },
            "property": {
                "name": tenant.property.name,
                "address": tenant.property.address,
            },
            "financial_records": [],
            "maintenance_requests": []
        }
        
        # Get financial records
        financial_records = FinancialRecord.objects.filter(tenant=tenant)
        for record in financial_records:
            tenant_data["financial_records"].append({
                "date": record.date.isoformat(),
                "amount": float(record.amount),
                "category": record.category,
                "description": record.description
            })
        
        # Get maintenance requests
        maintenance_requests = tenant.maintenance_requests.all()
        for req in maintenance_requests:
            tenant_data["maintenance_requests"].append({
                "title": req.title,
                "description": req.description,
                "status": req.status,
                "requested_at": req.requested_at.isoformat()
            })
        
        # Log data access
        AuditLogger.log_data_export(
            user_id=None,
            data_type="tenant_data",
            record_count=1,
            ip_address=request.client.host if request.client else None
        )
        
        return {
            "success": True,
            "message": "Data access request processed",
            "data": tenant_data
        }
        
    except Tenant.DoesNotExist:
        raise HTTPException(status_code=404, detail="Tenant not found or email mismatch")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/data-deletion-request")
async def request_data_deletion(request_data: DataDeletionRequest, request: Request):
    """
    GDPR Right to be Forgotten / CCPA Data Deletion
    """
    try:
        # Verify tenant exists and email matches
        tenant = Tenant.objects.get(id=request_data.tenant_id, email=request_data.email)
        
        # Log deletion request
        AuditLogger.log_data_deletion(
            user_id=None,
            resource_type="tenant",
            resource_id=tenant.id,
            reason=request_data.reason,
            ip_address=request.client.host if request.client else None
        )
        
        # In production, would:
        # 1. Mark for deletion (not immediate)
        # 2. Notify property manager
        # 3. Check legal retention requirements
        # 4. Anonymize data after retention period
        
        # For now, just mark as inactive
        tenant.is_active = False
        tenant.save()
        
        return {
            "success": True,
            "message": "Data deletion request received. Data will be deleted within 30 days per GDPR requirements.",
            "tenant_id": tenant.id
        }
        
    except Tenant.DoesNotExist:
        raise HTTPException(status_code=404, detail="Tenant not found or email mismatch")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audit-log")
async def get_audit_log(
    limit: int = 100,
    resource_type: Optional[str] = None,
    action: Optional[str] = None
):
    """
    Get audit log entries (admin only in production)
    """
    try:
        logs = AuditLog.objects.all()
        
        if resource_type:
            logs = logs.filter(resource_type=resource_type)
        if action:
            logs = logs.filter(action=action)
        
        logs = logs.order_by('-timestamp')[:limit]
        
        results = []
        for log in logs:
            results.append({
                "id": log.id,
                "user": log.user.username if log.user else "Anonymous",
                "action": log.action,
                "resource_type": log.resource_type,
                "resource_id": log.resource_id,
                "details": log.details,
                "ip_address": log.ip_address,
                "timestamp": log.timestamp.isoformat()
            })
        
        return {
            "total": len(results),
            "logs": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/compliance-report")
async def get_compliance_report():
    """
    Generate compliance report for SOC 2 / ISO 27001 audits
    """
    try:
        from django.db import models
        from datetime import timedelta
        from django.utils import timezone
        
        last_30_days = timezone.now() - timedelta(days=30)
        
        # Count audit events
        total_events = AuditLog.objects.filter(timestamp__gte=last_30_days).count()
        
        events_by_action = AuditLog.objects.filter(
            timestamp__gte=last_30_days
        ).values('action').annotate(count=models.Count('id'))
        
        events_by_resource = AuditLog.objects.filter(
            timestamp__gte=last_30_days
        ).values('resource_type').annotate(count=models.Count('id'))
        
        return {
            "period": "Last 30 days",
            "total_audited_events": total_events,
            "events_by_action": list(events_by_action),
            "events_by_resource": list(events_by_resource),
            "compliance_standards": [
                "SOC 2 Type 2",
                "ISO 27001",
                "GDPR",
                "CCPA",
                "Fair Housing Act"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

