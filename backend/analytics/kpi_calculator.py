"""
KPI Calculator for Property Management Analytics
Calculates key performance indicators based on research insights
"""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from decimal import Decimal
from django.db.models import Sum, Count, Avg, Q
from core.models import Property, Tenant, FinancialRecord, MaintenanceRequest


class KPICalculator:
    """Calculate key performance indicators for property management"""
    
    @staticmethod
    def calculate_occupancy_rate(property_id: Optional[int] = None) -> Dict:
        """
        Calculate occupancy rate = (Occupied Units / Total Units) × 100
        Target: 85-95% (from research)
        """
        if property_id:
            properties = Property.objects.filter(id=property_id, status='active')
        else:
            properties = Property.objects.filter(status='active')
        
        total_units = properties.aggregate(Sum('total_units'))['total_units__sum'] or 0
        
        # Count active tenants
        tenant_filter = Q(is_active=True)
        if property_id:
            tenant_filter &= Q(property_id=property_id)
        
        occupied_units = Tenant.objects.filter(tenant_filter).count()
        
        occupancy_rate = (occupied_units / total_units * 100) if total_units > 0 else 0
        
        return {
            'total_units': total_units,
            'occupied_units': occupied_units,
            'vacant_units': total_units - occupied_units,
            'occupancy_rate': round(occupancy_rate, 2),
            'target_min': 85,
            'target_max': 95,
            'status': 'good' if 85 <= occupancy_rate <= 95 else 'needs_attention'
        }
    
    @staticmethod
    def calculate_noi(property_id: Optional[int] = None, 
                      start_date: Optional[datetime] = None,
                      end_date: Optional[datetime] = None) -> Dict:
        """
        Calculate Net Operating Income (NOI)
        NOI = Gross Rental Income - Operating Expenses
        """
        if not start_date:
            start_date = datetime.now() - timedelta(days=365)
        if not end_date:
            end_date = datetime.now()
        
        filter_kwargs = {'date__gte': start_date, 'date__lte': end_date}
        if property_id:
            filter_kwargs['property_id'] = property_id
        
        # Calculate income
        income = FinancialRecord.objects.filter(
            transaction_type='income',
            **filter_kwargs
        ).aggregate(total=Sum('amount'))['total'] or Decimal(0)
        
        # Calculate expenses
        expenses = FinancialRecord.objects.filter(
            transaction_type='expense',
            **filter_kwargs
        ).aggregate(total=Sum('amount'))['total'] or Decimal(0)
        
        noi = income - expenses
        noi_margin = (noi / income * 100) if income > 0 else 0
        
        return {
            'gross_rental_income': float(income),
            'operating_expenses': float(expenses),
            'net_operating_income': float(noi),
            'noi_margin': round(float(noi_margin), 2),
            'period': {
                'start': start_date.date().isoformat(),
                'end': end_date.date().isoformat()
            }
        }
    
    @staticmethod
    def calculate_cash_flow(property_id: Optional[int] = None,
                           months: int = 12) -> Dict:
        """
        Calculate monthly cash flow analysis
        Cash Flow = Income - Expenses per month
        """
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months * 30)
        
        filter_kwargs = {'date__gte': start_date, 'date__lte': end_date}
        if property_id:
            filter_kwargs['property_id'] = property_id
        
        # Get monthly breakdown
        records = FinancialRecord.objects.filter(**filter_kwargs)
        
        monthly_data = {}
        for record in records:
            month_key = record.date.strftime('%Y-%m')
            if month_key not in monthly_data:
                monthly_data[month_key] = {'income': Decimal(0), 'expenses': Decimal(0)}
            
            if record.transaction_type == 'income':
                monthly_data[month_key]['income'] += record.amount
            else:
                monthly_data[month_key]['expenses'] += record.amount
        
        # Calculate cash flow for each month
        cash_flow_data = []
        total_income = Decimal(0)
        total_expenses = Decimal(0)
        
        for month, data in sorted(monthly_data.items()):
            cash_flow = data['income'] - data['expenses']
            total_income += data['income']
            total_expenses += data['expenses']
            
            cash_flow_data.append({
                'month': month,
                'income': float(data['income']),
                'expenses': float(data['expenses']),
                'cash_flow': float(cash_flow)
            })
        
        net_cash_flow = total_income - total_expenses
        
        return {
            'monthly_breakdown': cash_flow_data,
            'total_income': float(total_income),
            'total_expenses': float(total_expenses),
            'net_cash_flow': float(net_cash_flow),
            'average_monthly_cash_flow': float(net_cash_flow / months) if months > 0 else 0
        }
    
    @staticmethod
    def calculate_maintenance_cost_per_unit(property_id: Optional[int] = None,
                                           start_date: Optional[datetime] = None,
                                           end_date: Optional[datetime] = None) -> Dict:
        """
        Calculate maintenance cost per unit
        Key metric for operational efficiency (from research)
        """
        if not start_date:
            start_date = datetime.now() - timedelta(days=365)
        if not end_date:
            end_date = datetime.now()
        
        filter_kwargs = {
            'date__gte': start_date,
            'date__lte': end_date,
            'transaction_type': 'expense',
            'category__in': ['maintenance', 'repairs']
        }
        
        if property_id:
            filter_kwargs['property_id'] = property_id
            properties = Property.objects.filter(id=property_id)
        else:
            properties = Property.objects.filter(status='active')
        
        total_units = properties.aggregate(Sum('total_units'))['total_units__sum'] or 1
        
        maintenance_costs = FinancialRecord.objects.filter(**filter_kwargs).aggregate(
            total=Sum('amount')
        )['total'] or Decimal(0)
        
        cost_per_unit = maintenance_costs / total_units
        
        return {
            'total_maintenance_costs': float(maintenance_costs),
            'total_units': total_units,
            'cost_per_unit': float(cost_per_unit),
            'period': {
                'start': start_date.date().isoformat(),
                'end': end_date.date().isoformat()
            }
        }
    
    @staticmethod
    def calculate_tenant_retention_rate(property_id: Optional[int] = None,
                                       year: Optional[int] = None) -> Dict:
        """
        Calculate tenant retention rate
        Retention Rate = Renewed Leases / Total Expiring Leases
        """
        if not year:
            year = datetime.now().year
        
        start_date = datetime(year, 1, 1)
        end_date = datetime(year, 12, 31)
        
        filter_kwargs = {'lease_end__gte': start_date, 'lease_end__lte': end_date}
        if property_id:
            filter_kwargs['property_id'] = property_id
        
        expiring_leases = Tenant.objects.filter(**filter_kwargs).count()
        
        # Tenants who renewed (still active beyond lease end)
        renewed_tenants = Tenant.objects.filter(
            **filter_kwargs,
            is_active=True
        ).count()
        
        retention_rate = (renewed_tenants / expiring_leases * 100) if expiring_leases > 0 else 0
        
        return {
            'expiring_leases': expiring_leases,
            'renewed_leases': renewed_tenants,
            'retention_rate': round(retention_rate, 2),
            'year': year,
            'status': 'excellent' if retention_rate >= 80 else 'good' if retention_rate >= 60 else 'needs_improvement'
        }
    
    @staticmethod
    def calculate_response_time_metrics(property_id: Optional[int] = None,
                                       days: int = 30) -> Dict:
        """
        Calculate maintenance response time metrics
        Key tenant satisfaction indicator (from research)
        """
        start_date = datetime.now() - timedelta(days=days)
        
        filter_kwargs = {'requested_at__gte': start_date}
        if property_id:
            filter_kwargs['property_id'] = property_id
        
        requests = MaintenanceRequest.objects.filter(**filter_kwargs)
        
        total_requests = requests.count()
        completed_requests = requests.filter(status='completed')
        
        # Calculate average response time
        response_times = []
        for request in completed_requests:
            if request.assigned_at:
                response_time = (request.assigned_at - request.requested_at).total_seconds() / 3600
                response_times.append(response_time)
        
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        # Priority breakdown
        priority_breakdown = {
            'urgent': requests.filter(priority='urgent').count(),
            'high': requests.filter(priority='high').count(),
            'medium': requests.filter(priority='medium').count(),
            'low': requests.filter(priority='low').count(),
        }
        
        return {
            'total_requests': total_requests,
            'completed_requests': completed_requests.count(),
            'pending_requests': requests.filter(status='pending').count(),
            'average_response_time_hours': round(avg_response_time, 2),
            'priority_breakdown': priority_breakdown,
            'period_days': days
        }
    
    @staticmethod
    def get_dashboard_summary(property_id: Optional[int] = None) -> Dict:
        """
        Get comprehensive dashboard summary with all KPIs
        """
        return {
            'occupancy': KPICalculator.calculate_occupancy_rate(property_id),
            'noi': KPICalculator.calculate_noi(property_id),
            'cash_flow': KPICalculator.calculate_cash_flow(property_id),
            'maintenance_costs': KPICalculator.calculate_maintenance_cost_per_unit(property_id),
            'tenant_retention': KPICalculator.calculate_tenant_retention_rate(property_id),
            'response_times': KPICalculator.calculate_response_time_metrics(property_id),
            'generated_at': datetime.now().isoformat()
        }

