"""
Django models for Happy Everyday Property Management Platform
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Property(models.Model):
    """Property model for managing real estate properties"""
    PROPERTY_TYPES = [
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('mixed', 'Mixed Use'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Under Maintenance'),
    ]
    
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=20)
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPES)
    total_units = models.IntegerField(validators=[MinValueValidator(1)])
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_properties')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Properties'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.city}, {self.state}"


class Tenant(models.Model):
    """Tenant model for property occupants"""
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='tenants')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    unit_number = models.CharField(max_length=20)
    lease_start = models.DateField()
    lease_end = models.DateField()
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['property', 'unit_number']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.property.name} Unit {self.unit_number}"


class FinancialRecord(models.Model):
    """Financial records for tracking income and expenses"""
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]
    
    CATEGORIES = [
        ('rent', 'Rent Payment'),
        ('maintenance', 'Maintenance'),
        ('utilities', 'Utilities'),
        ('insurance', 'Insurance'),
        ('taxes', 'Property Taxes'),
        ('repairs', 'Repairs'),
        ('other', 'Other'),
    ]
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='financial_records')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    date = models.DateField()
    description = models.TextField(blank=True)
    tenant = models.ForeignKey(Tenant, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.transaction_type.title()} - ${self.amount} - {self.property.name}"


class ServiceProvider(models.Model):
    """Service providers (landscapers, snow removal, contractors, etc.)"""
    PROVIDER_TYPES = [
        ('landscaping', 'Landscaping'),
        ('snow_removal', 'Snow Removal'),
        ('hvac', 'HVAC'),
        ('plumbing', 'Plumbing'),
        ('electrical', 'Electrical'),
        ('general', 'General Repairs'),
    ]
    
    name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    provider_type = models.CharField(max_length=20, choices=PROVIDER_TYPES)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(5)], default=0)
    total_jobs = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.company_name} - {self.get_provider_type_display()}"


class MaintenanceRequest(models.Model):
    """Maintenance requests from tenants"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='maintenance_requests')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='maintenance_requests')
    service_provider = models.ForeignKey(ServiceProvider, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    ai_analysis = models.JSONField(null=True, blank=True)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)
    assigned_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.title} - {self.property.name} ({self.status})"


class PropertyInspection(models.Model):
    """Property inspection records with AI analysis"""
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='inspections')
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='inspections')
    inspection_date = models.DateTimeField()
    inspection_type = models.CharField(max_length=50, default='routine')
    images = models.JSONField(default=list)  # Store image paths
    ai_report = models.JSONField(null=True, blank=True)
    overall_condition = models.CharField(max_length=20, null=True, blank=True)
    severity_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-inspection_date']
    
    def __str__(self):
        return f"Inspection - {self.property.name} - {self.inspection_date.date()}"


class MarketResearch(models.Model):
    """Market research data from web scraping"""
    competitor_name = models.CharField(max_length=255)
    competitor_url = models.URLField()
    scraped_data = models.JSONField()
    analysis_date = models.DateTimeField(auto_now_add=True)
    units_managed = models.IntegerField(null=True, blank=True)
    service_offerings = models.JSONField(default=list)
    pricing_data = models.JSONField(default=dict)
    ai_insights = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-analysis_date']
    
    def __str__(self):
        return f"{self.competitor_name} - {self.analysis_date.date()}"


class AuditLog(models.Model):
    """Audit log for compliance and security tracking"""
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50)
    resource_type = models.CharField(max_length=50)
    resource_id = models.IntegerField()
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.resource_type} - {self.timestamp}"

