import React, { useState } from "react";
import { C, getStatusColor } from "../utils/theme";
import { SectionHeader } from "./ClusterOverview";

function StatusBadge({ status }) {
  const color = getStatusColor(status);
  const label = status?.toUpperCase() ?? "UNKNOWN";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 10px", borderRadius: 99,
      background: `${color}18`, color,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
      border: `1px solid ${color}33`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: color, boxShadow: `0 0 6px ${color}`,
        animation: status === "anomaly" ? "pulse 1s infinite" : "none",
      }} />
      {label}
    </span>
  );
}

function MiniBar({ value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        flex: 1, height: 4, background: C.border,
        borderRadius: 2, minWidth: 50, overflow: "hidden",
      }}>
        <div style={{
          width: `${Math.min(value, 100)}%`, height: "100%",
          borderRadius: 2, background: color,
          transition: "width 0.6s ease",
        }} />
      </div>
      <span style={{ color: C.textPrimary, minWidth: 40, fontSize: 12 }}>
        {parseFloat(value).toFixed(1)}%
      </span>
    </div>
  );
}

const COLS = ["Service", "CPU", "Memory", "Latency", "Restarts", "Score", "Status", "Actions"];

export default function ServiceTable({ services, onViewMetrics, onRemediate }) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  const sorted = [...(services || [])].sort((a, b) => {
    if (!sortBy) return 0;
    const map = { Service: "name", CPU: "cpu", Memory: "memory", Latency: "latency", Restarts: "restarts", Score: "healthScore" };
    const k = map[sortBy];
    if (!k) return 0;
    const va = parseFloat(a[k]) || 0;
    const vb = parseFloat(b[k]) || 0;
    return sortDir === "asc" ? va - vb : vb - va;
  });

  return (
    <section>
      <SectionHeader title="Service Health Table" />
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 12, overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {COLS.map((h) => (
                  <th
                    key={h}
                    onClick={() => ["Service","CPU","Memory","Latency","Restarts","Score"].includes(h) && toggleSort(h)}
                    style={{
                      padding: "12px 16px", textAlign: "left",
                      color: sortBy === h ? C.accent : C.textSecondary,
                      fontSize: 11, textTransform: "uppercase",
                      letterSpacing: "0.06em", fontWeight: 600,
                      cursor: h !== "Status" && h !== "Actions" ? "pointer" : "default",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    {h} {sortBy === h ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => {
                const scoreColor = s.healthScore >= 80 ? C.green : s.healthScore >= 65 ? C.yellow : C.red;
                const rowBg =
                  s.status === "anomaly" ? "rgba(255,59,107,0.04)"
                  : s.status === "warning" ? "rgba(255,184,0,0.03)"
                  : "transparent";
                return (
                  <tr
                    key={s.service}
                    style={{
                      borderBottom: `1px solid ${C.border}22`,
                      background: rowBg,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,212,255,0.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = rowBg)}
                  >
                    <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ color: C.accent, marginRight: 6, fontSize: 10 }}>◆</span>
                      <span style={{ color: C.textPrimary, fontWeight: 700, fontSize: 12 }}>
                        {s.service}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px", minWidth: 130 }}>
                      <MiniBar
                        value={s.cpu}
                        color={s.cpu > 80 ? C.red : s.cpu > 60 ? C.yellow : C.accent}
                      />
                    </td>
                    <td style={{ padding: "11px 16px", minWidth: 130 }}>
                      <MiniBar
                        value={s.memory}
                        color={s.memory > 85 ? C.red : s.memory > 70 ? C.yellow : C.purple}
                      />
                    </td>
                    <td style={{ padding: "11px 16px", color: s.latency > 150 ? C.yellow : C.textPrimary }}>
                      {parseFloat(s.latency).toFixed(0)}ms
                    </td>
                    <td style={{ padding: "11px 16px", color: s.restarts > 3 ? C.red : C.textPrimary }}>
                      {s.restarts}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ color: scoreColor, fontWeight: 800 }}>
                        {Math.round(s.healthScore)}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <StatusBadge status={s.status} />
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => onViewMetrics?.(s.service)}
                          style={{
                            padding: "4px 10px", fontSize: 11, borderRadius: 6,
                            fontWeight: 700, background: C.accentDim,
                            color: C.accent, border: `1px solid ${C.accent}44`,
                          }}
                        >
                          Metrics
                        </button>
                        <button
                          onClick={() => onRemediate?.(s.service)}
                          style={{
                            padding: "4px 10px", fontSize: 11, borderRadius: 6,
                            fontWeight: 700, background: "rgba(255,59,107,0.1)",
                            color: C.red, border: `1px solid ${C.red}44`,
                          }}
                        >
                          Remediate
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
