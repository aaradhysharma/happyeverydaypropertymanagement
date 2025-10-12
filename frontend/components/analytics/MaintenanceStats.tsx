"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface MaintenanceStatsProps {
  data: any;
}

export function MaintenanceStats({ data }: MaintenanceStatsProps) {
  if (!data || !data.response_times || !data.maintenance_costs) {
    return null;
  }

  const { response_times, maintenance_costs } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Response Time Metrics</CardTitle>
          <CardDescription>Last {response_times.period_days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold">{response_times.average_response_time_hours}h</div>
              <p className="text-xs text-muted-foreground">Average Response Time</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">{response_times.total_requests}</div>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
              <div>
                <div className="font-semibold">{response_times.completed_requests}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2">Priority Breakdown:</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-600">Urgent:</span>
                  <span>{response_times.priority_breakdown.urgent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">High:</span>
                  <span>{response_times.priority_breakdown.high}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Medium:</span>
                  <span>{response_times.priority_breakdown.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Low:</span>
                  <span>{response_times.priority_breakdown.low}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Costs</CardTitle>
          <CardDescription>Cost efficiency metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(maintenance_costs.cost_per_unit)}</div>
              <p className="text-xs text-muted-foreground">Cost Per Unit</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">{formatCurrency(maintenance_costs.total_maintenance_costs)}</div>
                <p className="text-xs text-muted-foreground">Total Costs</p>
              </div>
              <div>
                <div className="font-semibold">{maintenance_costs.total_units}</div>
                <p className="text-xs text-muted-foreground">Total Units</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

