/**
 * API Documentation and Types
 * Happy Everyday Property Management Platform
 */

export interface DashboardData {
  occupancy: OccupancyData;
  noi: NOIData;
  cash_flow: CashFlowData;
  maintenance_costs: MaintenanceCostsData;
  tenant_retention: TenantRetentionData;
  response_times: ResponseTimesData;
  generated_at: string;
}

export interface OccupancyData {
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  occupancy_rate: number;
  target_min: number;
  target_max: number;
  status: 'good' | 'needs_attention';
}

export interface NOIData {
  gross_rental_income: number;
  operating_expenses: number;
  net_operating_income: number;
  noi_margin: number;
  period: {
    start: string;
    end: string;
  };
}

export interface CashFlowData {
  monthly_breakdown: Array<{
    month: string;
    income: number;
    expenses: number;
    cash_flow: number;
  }>;
  total_income: number;
  total_expenses: number;
  net_cash_flow: number;
  average_monthly_cash_flow: number;
}

export interface MaintenanceCostsData {
  total_maintenance_costs: number;
  total_units: number;
  cost_per_unit: number;
  period: {
    start: string;
    end: string;
  };
}

export interface TenantRetentionData {
  expiring_leases: number;
  renewed_leases: number;
  retention_rate: number;
  year: number;
  status: 'excellent' | 'good' | 'needs_improvement';
}

export interface ResponseTimesData {
  total_requests: number;
  completed_requests: number;
  pending_requests: number;
  average_response_time_hours: number;
  priority_breakdown: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  period_days: number;
}

export interface InspectionAnalysis {
  success: boolean;
  inspection_id?: number;
  property_id: number;
  images_analyzed: number;
  analysis: {
    damage_items?: Array<{
      damage_type: string;
      location: string;
      severity: number;
      confidence: number;
      description: string;
      recommendations: string;
      estimated_cost_range: string;
    }>;
    overall_condition?: string;
    priority_items?: string[];
    estimated_total_cost?: string;
    summary?: string;
  };
  created_at: string;
}

export interface ServiceProvider {
  id: number;
  name: string;
  company_name: string;
  provider_type: string;
  rating: number;
  total_jobs: number;
  is_available: boolean;
  hourly_rate?: number;
  phone: string;
  email: string;
}

/**
 * API Response Types
 */
export type ApiResponse<T> = {
  data: T;
  status: number;
  statusText: string;
};

export type ApiError = {
  detail: string;
  status: number;
};

