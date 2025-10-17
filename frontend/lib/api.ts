/**
 * API client for Happy Everyday Property Management
 */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Analytics API
export const analyticsApi = {
  getDashboard: (propertyId?: number) => 
    api.get('/api/analytics/dashboard', { params: { property_id: propertyId } }),
  
  getOccupancy: (propertyId?: number) => 
    api.get('/api/analytics/occupancy', { params: { property_id: propertyId } }),
  
  getNOI: (propertyId?: number, startDate?: string, endDate?: string) => 
    api.get('/api/analytics/noi', { params: { property_id: propertyId, start_date: startDate, end_date: endDate } }),
  
  getCashFlow: (propertyId?: number, months?: number) => 
    api.get('/api/analytics/cash-flow', { params: { property_id: propertyId, months } }),
  
  getMaintenanceCosts: (propertyId?: number, startDate?: string, endDate?: string) => 
    api.get('/api/analytics/maintenance-costs', { params: { property_id: propertyId, start_date: startDate, end_date: endDate } }),
  
  getTenantRetention: (propertyId?: number, year?: number) => 
    api.get('/api/analytics/tenant-retention', { params: { property_id: propertyId, year } }),
  
  getResponseTimes: (propertyId?: number, days?: number) => 
    api.get('/api/analytics/response-times', { params: { property_id: propertyId, days } }),
  
  getProperties: () => 
    api.get('/api/analytics/properties'),

  refreshMarketData: () =>
    api.post('/api/analytics/market-data/refresh'),

  getLatestMarketData: (propertyId: number, includeComparables = true) =>
    api.get('/api/analytics/market-data/latest', { params: { property_id: propertyId, include_comparables: includeComparables } }),

  // Property Analysis API
  analyzeProperty: (address: string, city?: string, state?: string, zipCode?: string) =>
    api.post('/api/analytics/analyze-property', { address, city, state, zip_code: zipCode }),

  getPropertyAnalysis: (analysisId: string) =>
    api.get(`/api/analytics/property-analysis/${analysisId}`),

  getAnalysisProgress: (analysisId: string) =>
    api.get(`/api/analytics/property-analysis-progress/${analysisId}`),
};

// Inspections API
export const inspectionsApi = {
  analyzeImages: (propertyId: number, inspectionType: string, images: File[]) => {
    const formData = new FormData();
    formData.append('property_id', propertyId.toString());
    formData.append('inspection_type', inspectionType);
    images.forEach(image => formData.append('images', image));
    
    return api.post('/api/inspections/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getPropertyInspections: (propertyId: number, limit?: number) => 
    api.get(`/api/inspections/property/${propertyId}`, { params: { limit } }),
  
  getInspectionDetail: (inspectionId: number) => 
    api.get(`/api/inspections/${inspectionId}`),
};

// Service Providers API
export const providersApi = {
  getProviders: (providerType?: string, isAvailable?: boolean, minRating?: number) => 
    api.get('/api/providers/list', { params: { provider_type: providerType, is_available: isAvailable, min_rating: minRating } }),
  
  autoAssign: (requestId: number) => 
    api.post(`/api/providers/assign/${requestId}`),
  
  getSchedule: (providerId: number, date?: string) => 
    api.get(`/api/providers/schedule/${providerId}`, { params: { date } }),
  
  getRoute: (providerId: number, date?: string) => 
    api.get(`/api/providers/route/${providerId}`, { params: { date } }),
  
  getTypes: () => 
    api.get('/api/providers/types'),
  
  getStats: () => 
    api.get('/api/providers/stats'),
};

// Privacy API
export const privacyApi = {
  requestDataAccess: (tenantId: number, email: string) => 
    api.post('/api/privacy/data-access-request', { tenant_id: tenantId, email }),
  
  requestDataDeletion: (tenantId: number, email: string, reason?: string) => 
    api.post('/api/privacy/data-deletion-request', { tenant_id: tenantId, email, reason }),
  
  getAuditLog: (limit?: number, resourceType?: string, action?: string) => 
    api.get('/api/privacy/audit-log', { params: { limit, resource_type: resourceType, action } }),
  
  getComplianceReport: () => 
    api.get('/api/privacy/compliance-report'),
};

