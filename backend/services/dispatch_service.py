"""
Automated dispatch and scheduling service for service providers
AI-powered triage, route optimization, and automated assignment
"""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from django.db.models import Q
from core.models import MaintenanceRequest, ServiceProvider, Property
import math


class DispatchService:
    """Automated service provider dispatch and scheduling"""
    
    # AI Triage categories
    TRIAGE_CATEGORIES = {
        'plumbing': ['leak', 'pipe', 'drain', 'water', 'faucet', 'toilet'],
        'electrical': ['light', 'outlet', 'power', 'electric', 'breaker', 'wiring'],
        'hvac': ['heat', 'ac', 'air conditioning', 'furnace', 'thermostat', 'ventilation'],
        'landscaping': ['lawn', 'grass', 'tree', 'garden', 'landscape'],
        'snow_removal': ['snow', 'ice', 'plow', 'salt', 'winter'],
        'general': []
    }
    
    @staticmethod
    def categorize_request(description: str) -> str:
        """
        AI Triage: Automatically categorize maintenance request
        """
        description_lower = description.lower()
        
        for category, keywords in DispatchService.TRIAGE_CATEGORIES.items():
            for keyword in keywords:
                if keyword in description_lower:
                    return category
        
        return 'general'
    
    @staticmethod
    def assess_priority(description: str, keywords: List[str] = None) -> str:
        """
        Assess priority based on description
        """
        description_lower = description.lower()
        
        # Urgent keywords
        urgent_keywords = ['emergency', 'urgent', 'immediately', 'dangerous', 'flooding', 'fire']
        high_keywords = ['broken', 'not working', 'leak', 'problem', 'issue']
        
        for keyword in urgent_keywords:
            if keyword in description_lower:
                return 'urgent'
        
        for keyword in high_keywords:
            if keyword in description_lower:
                return 'high'
        
        return 'medium'
    
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        Returns distance in miles
        """
        R = 3959  # Earth's radius in miles
        
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)
        
        a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    @classmethod
    def find_best_provider(cls, request: MaintenanceRequest) -> Optional[ServiceProvider]:
        """
        Find the best service provider based on:
        - Availability
        - Provider type match
        - Rating
        - Location proximity (if property has coordinates)
        """
        category = cls.categorize_request(request.description)
        
        # Find available providers of the right type
        providers = ServiceProvider.objects.filter(
            provider_type=category,
            is_available=True
        ).order_by('-rating')
        
        if not providers.exists():
            # Fallback to general providers
            providers = ServiceProvider.objects.filter(
                provider_type='general',
                is_available=True
            ).order_by('-rating')
        
        if not providers.exists():
            return None
        
        # If property has coordinates, sort by distance
        if request.property.latitude and request.property.longitude:
            # Calculate distances (simplified - in production, would use proper geocoding)
            best_provider = providers.first()
        else:
            # Just use highest rated available provider
            best_provider = providers.first()
        
        return best_provider
    
    @classmethod
    def auto_assign_request(cls, request_id: int) -> Dict:
        """
        Automatically assign a maintenance request to best available provider
        """
        try:
            request = MaintenanceRequest.objects.get(id=request_id)
            
            # Categorize and assess priority
            category = cls.categorize_request(request.description)
            if not request.priority or request.priority == 'medium':
                priority = cls.assess_priority(request.description)
                request.priority = priority
            
            # Find best provider
            provider = cls.find_best_provider(request)
            
            if not provider:
                return {
                    "success": False,
                    "error": "No available providers found",
                    "category": category
                }
            
            # Assign provider
            request.service_provider = provider
            request.status = 'assigned'
            request.assigned_at = datetime.now()
            request.save()
            
            # Update provider stats
            provider.total_jobs += 1
            provider.save()
            
            return {
                "success": True,
                "request_id": request.id,
                "provider": {
                    "id": provider.id,
                    "name": provider.company_name,
                    "type": provider.provider_type,
                    "rating": float(provider.rating)
                },
                "category": category,
                "priority": request.priority
            }
            
        except MaintenanceRequest.DoesNotExist:
            return {
                "success": False,
                "error": "Maintenance request not found"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def get_daily_schedule(provider_id: int, date: datetime = None) -> Dict:
        """
        Get daily schedule for a service provider
        """
        if not date:
            date = datetime.now()
        
        start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        
        requests = MaintenanceRequest.objects.filter(
            service_provider_id=provider_id,
            status__in=['assigned', 'in_progress'],
            assigned_at__gte=start_of_day,
            assigned_at__lt=end_of_day
        ).order_by('priority', 'requested_at')
        
        schedule = []
        for req in requests:
            schedule.append({
                "request_id": req.id,
                "property": {
                    "id": req.property.id,
                    "name": req.property.name,
                    "address": req.property.address
                },
                "title": req.title,
                "priority": req.priority,
                "status": req.status,
                "assigned_at": req.assigned_at.isoformat() if req.assigned_at else None
            })
        
        return {
            "provider_id": provider_id,
            "date": date.date().isoformat(),
            "total_jobs": len(schedule),
            "schedule": schedule
        }
    
    @staticmethod
    def optimize_route(provider_id: int, date: datetime = None) -> Dict:
        """
        Optimize route for provider's daily schedule
        Based on property locations (simplified version)
        """
        schedule = DispatchService.get_daily_schedule(provider_id, date)
        
        # In production, would use proper route optimization algorithm
        # For now, return schedule sorted by priority
        
        return {
            "provider_id": provider_id,
            "optimized_schedule": schedule['schedule'],
            "estimated_total_time": len(schedule['schedule']) * 2,  # Simplified: 2 hours per job
            "total_distance_miles": len(schedule['schedule']) * 10,  # Simplified
        }

