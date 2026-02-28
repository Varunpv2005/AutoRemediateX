import React from "react";
import { C, getHealthColor } from "../utils/theme";

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "22px 24px",
      position: "relative",
      overflow: "hidden",
      flex: 1,
      minWidth: 140,
      animation: "fadeInUp 0.4s ease",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 90, height: 90,
        background: `radial-gradient(circle at 75% 25%, ${color}20, transparent 70%)`,
        borderRadius: "0 12px 0 90px",
        pointerEvents: "none",
      }} />
      <div style={{ fontSize: 22, marginBottom: 10 }}>{icon}</div>
      <div style={{
        fontSize: 30, fontWeight: 800, color,
        fontFamily: C.font, lineHeight: 1, letterSpacing: "-0.02em",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 11, color: C.textSecondary, marginTop: 6,
        textTransform: "uppercase", letterSpacing: "0.07em",
      }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

export default function ClusterOverview({ status }) {
  if (!status) return null;

  const hColor = getHealthColor(status.healthScore);

  return (
    <section>
      <SectionHeader title="Cluster Overview"
        badge={status.activeAnomalies > 0 ? `${status.activeAnomalies} ANOMALIES` : null}
      />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard
          icon="⬡"
          label="Monitored Services"
          value={status.totalServices}
          sub={`Cluster: ${status.clusterName ?? "prod"}`}
          color={C.accent}
        />
        <StatCard
          icon="⚠"
          label="Active Anomalies"
          value={status.activeAnomalies}
          sub={status.activeAnomalies > 0 ? "Requires attention" : "All clear"}
          color={status.activeAnomalies > 0 ? C.red : C.green}
        />
        <StatCard
          icon="⚡"
          label="Remediations"
          value={status.remediationActions}
          sub="Last 24 hours"
          color={C.orange}
        />
        <StatCard
          icon="♥"
          label="Health Score"
          value={`${status.healthScore}%`}
          sub={`K8s ${status.k8sVersion ?? ""} · ${status.nodes ?? 3} nodes`}
          color={hColor}
        />
      </div>
    </section>
  );
}

// ─── shared sub-component (used across multiple components) ───
export function SectionHeader({ title, badge }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 3, height: 18, borderRadius: 2,
        background: C.accent, boxShadow: `0 0 8px ${C.accent}`,
      }} />
      <span style={{
        fontSize: 12, fontWeight: 700, color: C.textPrimary,
        textTransform: "uppercase", letterSpacing: "0.1em",
      }}>
        {title}
      </span>
      {badge && (
        <span style={{
          background: "rgba(255,59,107,0.15)", color: C.red,
          fontSize: 10, fontWeight: 800, padding: "2px 8px",
          borderRadius: 99, border: `1px solid ${C.red}44`,
          letterSpacing: "0.06em",
        }}>
          {badge}
        </span>
      )}
    </div>
  );
}
