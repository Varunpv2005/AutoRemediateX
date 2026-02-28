import React, { useState } from "react";
import { C } from "../utils/theme";
import { SectionHeader } from "./ClusterOverview";
import { MONITORED_SERVICES } from "../services/api";

export default function ControlPanel({ onDetect, onRemediate }) {
  const [service, setService] = useState(MONITORED_SERVICES[0]);
  const [action, setAction] = useState("restart");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success"|"error", msg }

  const flash = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDetect = async () => {
    setLoading(true);
    try {
      const res = await onDetect(service);
      flash("success", res?.anomalyDetected
        ? `Anomaly detected on ${service} (score: ${parseFloat(res.score).toFixed(3)})`
        : `No anomaly found on ${service}`
      );
    } catch {
      flash("error", "Detection request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemediate = async () => {
    setLoading(true);
    try {
      const res = await onRemediate(service, action);
      flash("success", res?.message ?? `Remediation triggered for ${service}`);
    } catch {
      flash("error", "Remediation request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <SectionHeader title="Manual Control Panel" />
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 20,
      }}>
        {/* Service selector */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            fontSize: 11, color: C.textSecondary,
            display: "block", marginBottom: 6,
            textTransform: "uppercase", letterSpacing: "0.07em",
          }}>
            Target Service
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={{
              width: "100%",
              background: C.panel,
              border: `1px solid ${C.border}`,
              color: C.textPrimary,
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              outline: "none",
              fontFamily: C.font,
            }}
          >
            {MONITORED_SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Action selector */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            fontSize: 11, color: C.textSecondary,
            display: "block", marginBottom: 6,
            textTransform: "uppercase", letterSpacing: "0.07em",
          }}>
            Remediation Type
          </label>
          <div style={{ display: "flex", gap: 6 }}>
            {["restart", "scale", "rollback"].map((a) => (
              <button
                key={a}
                onClick={() => setAction(a)}
                style={{
                  flex: 1, padding: "6px 0", borderRadius: 7, fontSize: 11,
                  fontWeight: 700, textTransform: "capitalize",
                  background: action === a ? "rgba(0,212,255,0.12)" : "transparent",
                  color: action === a ? C.accent : C.textSecondary,
                  border: action === a ? `1px solid ${C.accent}44` : `1px solid ${C.border}`,
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleDetect}
            disabled={loading}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 8,
              fontWeight: 700, fontSize: 12,
              background: "rgba(255,184,0,0.1)",
              color: C.yellow,
              border: `1px solid ${C.yellow}44`,
              opacity: loading ? 0.5 : 1,
              fontFamily: C.font,
            }}
          >
            {loading ? "…" : "🔍 Detect Anomaly"}
          </button>
          <button
            onClick={handleRemediate}
            disabled={loading}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 8,
              fontWeight: 700, fontSize: 12,
              background: "rgba(255,59,107,0.1)",
              color: C.red,
              border: `1px solid ${C.red}44`,
              opacity: loading ? 0.5 : 1,
              fontFamily: C.font,
            }}
          >
            {loading ? "…" : "⚡ Remediate"}
          </button>
        </div>

        {/* Feedback toast */}
        {feedback && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 12,
            background: feedback.type === "success" ? "rgba(0,255,157,0.08)" : "rgba(255,59,107,0.08)",
            color: feedback.type === "success" ? C.green : C.red,
            border: `1px solid ${feedback.type === "success" ? C.green : C.red}33`,
            animation: "fadeInUp 0.3s ease",
          }}>
            {feedback.type === "success" ? "✓" : "✗"} {feedback.msg}
          </div>
        )}
      </div>
    </section>
  );
}
