"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OccupancyChartProps {
  data: any;
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  if (!data || !data.occupancy) {
    return null;
  }

  const { occupancy } = data;

  const chartData = [
    { name: 'Occupied', value: occupancy.occupied_units },
    { name: 'Vacant', value: occupancy.vacant_units },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Distribution</CardTitle>
        <CardDescription>
          Current occupancy: {occupancy.occupancy_rate}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

