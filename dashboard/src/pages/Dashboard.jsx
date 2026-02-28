import React, { useState } from "react";
import { C, getHealthColor } from "../utils/theme";
import ClusterOverview from "../components/ClusterOverview";
import MetricsCharts from "../components/MetricsCharts";
import ServiceTable from "../components/ServiceTable";
import AnomalyPanel from "../components/AnomalyPanel";
import RemediationLog, { SEED_LOG } from "../components/RemediationLog";
import ControlPanel from "../components/ControlPanel";
import { useDashboard, useMetricsHistory } from "../hooks/useDashboard";
import { triggerRemediation, detectAnomaly } from "../services/api";

// ─── Top Navigation Bar ───────────────────────────────────────
function TopNav({ health, systemStatus, lastUpdated }) {
  const healthColor = getHealthColor(systemStatus?.healthScore ?? 0);
  return (
    <nav style={{
      background: C.panel,
      borderBottom: `1px solid ${C.border}`,
      padding: "0 28px",
      height: 58,
      display: "flex",
      alignItems: "center",
      gap: 16,
      position: "sticky",
      top: 0,
      zIndex: 200,
    }}>
      {/* Logo + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.accent}, #0055ff)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: `0 0 16px ${C.accent}44`,
        }}>
          ⬡
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.textPrimary, letterSpacing: "-0.01em" }}>
            AutoRemediateX
          </div>
          <div style={{ fontSize: 10, color: C.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Intelligent Self-Healing K8s
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Health score pill */}
      {systemStatus && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: C.textSecondary }}>System Health</span>
          <span style={{
            background: `${healthColor}18`, color: healthColor,
            border: `1px solid ${healthColor}44`,
            borderRadius: 99, padding: "3px 12px",
            fontSize: 13, fontWeight: 800,
          }}>
            {systemStatus.healthScore}%
          </span>
        </div>
      )}

      {/* Live / last updated */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "6px 12px",
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: C.green, display: "inline-block",
          boxShadow: `0 0 6px ${C.green}`,
          animation: "pulse 2s infinite",
        }} />
        <span style={{ fontSize: 11, color: C.textSecondary }}>LIVE</span>
        <span style={{ fontSize: 11, color: C.textMuted }}>↻ {lastUpdated ?? "--"}</span>
      </div>

      {/* Nav tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {["Overview", "Metrics", "Anomalies", "Settings"].map((tab, i) => (
          <button key={tab} style={{
            padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: i === 0 ? C.accentDim : "transparent",
            color: i === 0 ? C.accent : C.textSecondary,
            border: i === 0 ? `1px solid ${C.accent}44` : "1px solid transparent",
          }}>
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Status Banner ────────────────────────────────────────────
function StatusBanner({ systemStatus }) {
  if (!systemStatus) return null;
  const degraded = systemStatus.activeAnomalies > 0;
  return (
    <div style={{
      background: degraded ? "rgba(255,59,107,0.06)" : "rgba(0,255,157,0.05)",
      border: `1px solid ${degraded ? `${C.red}33` : `${C.green}33`}`,
      borderRadius: 10, padding: "10px 20px", marginBottom: 24,
      display: "flex", alignItems: "center", gap: 10, fontSize: 12,
      flexWrap: "wrap",
    }}>
      <span style={{ color: degraded ? C.red : C.green, fontWeight: 800 }}>
        {degraded ? `⚠ DEGRADED CLUSTER` : `✓ ALL SYSTEMS NOMINAL`}
      </span>
      <span style={{ color: C.textSecondary }}>
        {degraded
          ? `${systemStatus.activeAnomalies} service(s) operating outside normal thresholds · Auto-remediation engaged`
          : "All services operating within normal parameters"}
      </span>
      <span style={{ marginLeft: "auto", color: C.textMuted }}>
        K8s v{systemStatus.k8sVersion ?? "1.29"} · {systemStatus.nodes ?? 3} nodes · {systemStatus.clusterName ?? "prod-us-east-1"}
      </span>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", zIndex: 9999,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: `3px solid ${C.border}`,
        borderTopColor: C.accent,
        animation: "spin 0.8s linear infinite",
        marginBottom: 16,
      }} />
      <div style={{ color: C.textSecondary, fontSize: 13 }}>Connecting to cluster…</div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────
export default function Dashboard() {
  const { health, systemStatus, services, anomalies, loading, lastUpdated, refresh } =
    useDashboard();
  const { cpuHistory, memHistory, latHistory, netHistory } = useMetricsHistory(services);
  const [remLog, setRemLog] = useState(SEED_LOG);

  const handleRemediate = async (svc, action = "restart") => {
    const res = await triggerRemediation(svc, action);
    setRemLog((prev) => [
      {
        id: Date.now(),
        message: res?.message ?? `Remediation '${action}' triggered for ${svc}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: "critical",
      },
      ...prev.slice(0, 19),
    ]);
    return res;
  };

  const handleDetect = async (svc) => {
    return detectAnomaly(svc);
  };

  if (loading) return <LoadingOverlay />;

  return (
    <>
      <TopNav health={health} systemStatus={systemStatus} lastUpdated={lastUpdated} />

      <main style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 24px 48px" }}>
        <StatusBanner systemStatus={systemStatus} />

        {/* Row 1 – Cluster overview */}
        <div style={{ marginBottom: 28 }}>
          <ClusterOverview status={systemStatus} />
        </div>

        {/* Row 2 – Metrics charts */}
        <div style={{ marginBottom: 28 }}>
          <MetricsCharts
            cpuHistory={cpuHistory}
            memHistory={memHistory}
            latHistory={latHistory}
            netHistory={netHistory}
          />
        </div>

        {/* Row 3 – Service table + Anomaly panel */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 24,
          marginBottom: 28,
          alignItems: "start",
        }}>
          <ServiceTable
            services={services}
            onViewMetrics={(svc) => console.info("View metrics:", svc)}
            onRemediate={(svc) => handleRemediate(svc)}
          />
          <AnomalyPanel anomalies={anomalies} />
        </div>

        {/* Row 4 – Remediation log + Control panel */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
          alignItems: "start",
        }}>
          <RemediationLog log={remLog} />
          <ControlPanel onDetect={handleDetect} onRemediate={handleRemediate} />
        </div>
      </main>
    </>
  );
}
