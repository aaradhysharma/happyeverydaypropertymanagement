"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical';
}

export function KPICard({ title, value, subtitle, trend, trendValue, status }: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (status === 'good') return 'text-green-600';
    if (status === 'warning') return 'text-yellow-600';
    if (status === 'critical') return 'text-red-600';
    return 'text-gray-900';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {trend && getTrendIcon()}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getStatusColor()}`}>
          {typeof value === 'number' ? formatCurrency(value) : value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trendValue && (
          <p className="text-xs text-muted-foreground mt-1">{trendValue}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface KPICardsProps {
  data: any;
}

export function KPICards({ data }: KPICardsProps) {
  if (!data) return null;

  const { occupancy, noi, cash_flow, maintenance_costs, tenant_retention } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {occupancy && (
        <KPICard
          title="Occupancy Rate"
          value={formatPercent(occupancy.occupancy_rate)}
          subtitle={`${occupancy.occupied_units} / ${occupancy.total_units} units`}
          status={occupancy.status === 'good' ? 'good' : 'warning'}
          trend={occupancy.occupancy_rate >= 90 ? 'up' : occupancy.occupancy_rate >= 80 ? 'neutral' : 'down'}
          trendValue={`Target: ${occupancy.target_min}-${occupancy.target_max}%`}
        />
      )}

      {noi && (
        <KPICard
          title="Net Operating Income"
          value={noi.net_operating_income}
          subtitle={`${formatPercent(noi.noi_margin)} margin`}
          trend={noi.net_operating_income > 0 ? 'up' : 'down'}
          status={noi.net_operating_income > 0 ? 'good' : 'critical'}
        />
      )}

      {cash_flow && (
        <KPICard
          title="Net Cash Flow"
          value={cash_flow.net_cash_flow}
          subtitle={`Avg monthly: ${formatCurrency(cash_flow.average_monthly_cash_flow)}`}
          trend={cash_flow.net_cash_flow > 0 ? 'up' : 'down'}
          status={cash_flow.net_cash_flow > 0 ? 'good' : 'warning'}
        />
      )}

      {tenant_retention && (
        <KPICard
          title="Tenant Retention"
          value={formatPercent(tenant_retention.retention_rate)}
          subtitle={`${tenant_retention.renewed_leases} of ${tenant_retention.expiring_leases} renewed`}
          trend={tenant_retention.retention_rate >= 80 ? 'up' : tenant_retention.retention_rate >= 60 ? 'neutral' : 'down'}
          status={tenant_retention.status === 'excellent' ? 'good' : 'warning'}
        />
      )}
    </div>
  );
}

