import React from "react";
import { C } from "../utils/theme";
import { SectionHeader } from "./ClusterOverview";

const SEVERITY_ICON = { critical: "●", warning: "◐", info: "○" };
const SEVERITY_COLOR = { critical: C.red, warning: C.yellow, info: C.accent };

// Pre-seeded example log entries shown on first load
export const SEED_LOG = [
  { id: 1, message: "Scaled payment-service from 2 → 5 replicas", timestamp: "14:22:01", severity: "critical" },
  { id: 2, message: "Restarted inventory-service pod (OOMKilled)", timestamp: "14:18:47", severity: "critical" },
  { id: 3, message: "Rolled back checkout-service to v3.1.4", timestamp: "14:10:12", severity: "warning" },
  { id: 4, message: "Throttled CPU limit on auth-service", timestamp: "13:58:33", severity: "warning" },
  { id: 5, message: "Auto-scaled api-gateway from 3 → 6 replicas", timestamp: "13:45:09", severity: "info" },
  { id: 6, message: "Drained node ip-10-0-1-42 hosting notification-service", timestamp: "13:30:00", severity: "info" },
  { id: 7, message: "Restarted auth-service pod (CrashLoopBackOff)", timestamp: "13:12:55", severity: "warning" },
  { id: 8, message: "Scaled inventory-service from 1 → 3 replicas", timestamp: "12:59:18", severity: "info" },
];

export default function RemediationLog({ log = SEED_LOG }) {
  return (
    <section>
      <SectionHeader title="Remediation Activity Log" />
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "4px 0",
        maxHeight: 320,
        overflowY: "auto",
      }}>
        {log.map((entry, i) => (
          <div
            key={entry.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "10px 16px",
              borderBottom: i < log.length - 1 ? `1px solid ${C.border}22` : "none",
              animation: "fadeInUp 0.3s ease",
            }}
          >
            {/* Severity dot */}
            <span style={{
              color: SEVERITY_COLOR[entry.severity] ?? C.textMuted,
              fontSize: 12,
              marginTop: 1,
              flexShrink: 0,
            }}>
              {SEVERITY_ICON[entry.severity] ?? "○"}
            </span>

            {/* Message */}
            <span style={{
              flex: 1,
              color: entry.severity === "critical" ? C.textPrimary : C.textSecondary,
              fontSize: 13,
              fontWeight: entry.severity === "critical" ? 600 : 400,
            }}>
              {entry.message}
            </span>

            {/* Timestamp */}
            <span style={{
              color: C.textMuted,
              fontSize: 11,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
              {entry.timestamp}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
