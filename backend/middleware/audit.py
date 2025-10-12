"""
Audit logging middleware for compliance
Logs all sensitive data operations
"""
from core.models import AuditLog
from typing import Optional
from datetime import datetime


class AuditLogger:
    """Log sensitive operations for compliance"""
    
    @staticmethod
    def log_action(
        user_id: Optional[int],
        action: str,
        resource_type: str,
        resource_id: int,
        details: dict = None,
        ip_address: str = None
    ):
        """
        Log an auditable action
        
        Args:
            user_id: User performing the action
            action: Action type (create, read, update, delete, export, etc.)
            resource_type: Type of resource (tenant, property, financial_record, etc.)
            resource_id: ID of the resource
            details: Additional details about the action
            ip_address: IP address of the request
        """
        try:
            from django.contrib.auth.models import User
            user = User.objects.get(id=user_id) if user_id else None
        except:
            user = None
        
        AuditLog.objects.create(
            user=user,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details or {},
            ip_address=ip_address
        )
    
    @staticmethod
    def log_data_access(user_id: int, resource_type: str, resource_id: int, ip_address: str = None):
        """Log data access (for GDPR compliance)"""
        AuditLogger.log_action(
            user_id=user_id,
            action="read",
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=ip_address
        )
    
    @staticmethod
    def log_data_export(user_id: int, data_type: str, record_count: int, ip_address: str = None):
        """Log data export operations"""
        AuditLogger.log_action(
            user_id=user_id,
            action="export",
            resource_type=data_type,
            resource_id=0,
            details={"record_count": record_count},
            ip_address=ip_address
        )
    
    @staticmethod
    def log_data_deletion(user_id: int, resource_type: str, resource_id: int, reason: str, ip_address: str = None):
        """Log data deletion (GDPR right to be forgotten)"""
        AuditLogger.log_action(
            user_id=user_id,
            action="delete",
            resource_type=resource_type,
            resource_id=resource_id,
            details={"reason": reason},
            ip_address=ip_address
        )

