"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GrowthData {
  date: string;
  count: number;
}

export default function StudentGrowthChart({
  data,
}: {
  data: GrowthData[];
}) {
  return (
    <div className="h-52 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0e6b3a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0e6b3a" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e4e6e0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#55595f" }}
            tickLine={false}
            axisLine={{ stroke: "#e4e6e0" }}
            interval="preserveStartEnd"
            minTickGap={32}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#55595f" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e4e6e0",
              borderRadius: "8px",
              fontSize: "12px",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "#111111", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#0e6b3a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
            name="New Students"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
