import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { C } from "../utils/theme";
import { SectionHeader } from "./ClusterOverview";

const CustomTooltip = ({ active, payload, label, unit = "%" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 8, padding: "8px 14px", fontSize: 12,
    }}>
      <div style={{ color: C.textSecondary, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {p.value}{unit}
        </div>
      ))}
    </div>
  );
};

function MiniChart({ label, data, color, gradId, unit = "%" }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "16px 20px",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 10,
      }}>
        <span style={{
          fontSize: 11, color: C.textSecondary,
          textTransform: "uppercase", letterSpacing: "0.07em",
        }}>
          {label}
        </span>
        {data.length > 0 && (
          <span style={{ fontSize: 14, fontWeight: 800, color }}>
            {data[data.length - 1]?.value}{unit}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: C.textMuted, fontSize: 9 }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: C.textMuted, fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Area
            type="monotone"
            dataKey="value"
            name={label}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function MetricsCharts({ cpuHistory, memHistory, latHistory, netHistory }) {
  return (
    <section>
      <SectionHeader title="Real-time Metrics" badge="LIVE · 5s" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
        <MiniChart label="CPU Usage"      data={cpuHistory} color={C.accent}  gradId="g-cpu" unit="%" />
        <MiniChart label="Memory Usage"   data={memHistory} color={C.purple}  gradId="g-mem" unit="%" />
        <MiniChart label="Latency"        data={latHistory} color={C.yellow}  gradId="g-lat" unit="ms" />
        <MiniChart label="Network Traffic"data={netHistory} color={C.green}   gradId="g-net" unit="MB/s" />
      </div>
    </section>
  );
}
