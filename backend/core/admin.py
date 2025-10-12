"""
Django admin configuration for Happy Everyday models
"""
from django.contrib import admin
from .models import (
    Property, Tenant, FinancialRecord, ServiceProvider,
    MaintenanceRequest, PropertyInspection, MarketResearch, AuditLog
)


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'state', 'property_type', 'total_units', 'status', 'manager']
    list_filter = ['property_type', 'status', 'state']
    search_fields = ['name', 'address', 'city']
    ordering = ['-created_at']


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'property', 'unit_number', 'lease_start', 'lease_end', 'is_active']
    list_filter = ['is_active', 'property']
    search_fields = ['first_name', 'last_name', 'email']
    ordering = ['property', 'unit_number']


@admin.register(FinancialRecord)
class FinancialRecordAdmin(admin.ModelAdmin):
    list_display = ['property', 'transaction_type', 'category', 'amount', 'date']
    list_filter = ['transaction_type', 'category', 'date']
    search_fields = ['property__name', 'description']
    ordering = ['-date']


@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'provider_type', 'rating', 'total_jobs', 'is_available']
    list_filter = ['provider_type', 'is_available']
    search_fields = ['name', 'company_name', 'email']
    ordering = ['-rating']


@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ['title', 'property', 'tenant', 'status', 'priority', 'service_provider', 'requested_at']
    list_filter = ['status', 'priority', 'requested_at']
    search_fields = ['title', 'description', 'property__name']
    ordering = ['-requested_at']


@admin.register(PropertyInspection)
class PropertyInspectionAdmin(admin.ModelAdmin):
    list_display = ['property', 'inspection_date', 'inspector', 'overall_condition', 'severity_score']
    list_filter = ['inspection_date', 'overall_condition']
    search_fields = ['property__name', 'notes']
    ordering = ['-inspection_date']


@admin.register(MarketResearch)
class MarketResearchAdmin(admin.ModelAdmin):
    list_display = ['competitor_name', 'units_managed', 'analysis_date']
    list_filter = ['analysis_date']
    search_fields = ['competitor_name', 'competitor_url']
    ordering = ['-analysis_date']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'resource_type', 'resource_id', 'timestamp']
    list_filter = ['action', 'resource_type', 'timestamp']
    search_fields = ['user__username', 'action']
    ordering = ['-timestamp']

