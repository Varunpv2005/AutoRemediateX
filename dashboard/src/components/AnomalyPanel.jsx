import React from "react";
import { C, formatTimestamp } from "../utils/theme";
import { SectionHeader } from "./ClusterOverview";

export default function AnomalyPanel({ anomalies = [] }) {
  const critical = anomalies.filter((a) => a.critical);

  return (
    <section>
      <SectionHeader
        title="Anomaly Detection"
        badge={critical.length > 0 ? `${critical.length} CRITICAL` : null}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {anomalies.length === 0 && (
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: "20px 16px", textAlign: "center",
            color: C.textSecondary, fontSize: 13,
          }}>
            ✓ No anomalies detected
          </div>
        )}
        {anomalies.map((a) => (
          <div
            key={a.id}
            style={{
              background: a.critical ? "rgba(255,59,107,0.06)" : C.card,
              border: `1px solid ${a.critical ? `${C.red}44` : C.border}`,
              borderLeft: `3px solid ${a.critical ? C.red : C.yellow}`,
              borderRadius: 10, padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 800, color: C.textPrimary,
                  fontFamily: C.font,
                }}>
                  {a.service}
                </span>
                {a.critical && (
                  <span style={{
                    background: "rgba(255,59,107,0.2)", color: C.red,
                    fontSize: 9, fontWeight: 900, padding: "2px 8px",
                    borderRadius: 99, letterSpacing: "0.1em",
                  }}>
                    CRITICAL
                  </span>
                )}
              </div>
              <span style={{
                fontFamily: C.font, fontWeight: 800, fontSize: 14,
                color: a.critical ? C.red : C.yellow,
              }}>
                {parseFloat(a.anomalyScore).toFixed(3)}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
              <div>
                <span style={{ fontSize: 10, color: C.textMuted }}>Root Metric</span>
                <div style={{ fontSize: 12, color: C.orange, fontWeight: 600 }}>{a.rootMetric}</div>
              </div>
              <div>
                <span style={{ fontSize: 10, color: C.textMuted }}>Detected</span>
                <div style={{ fontSize: 12, color: C.textSecondary }}>{formatTimestamp(a.detectedAt)}</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ fontSize: 10, color: C.textMuted }}>Action Taken</span>
                <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{a.actionTaken}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
