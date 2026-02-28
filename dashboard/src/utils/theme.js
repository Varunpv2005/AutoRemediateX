// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────
export const C = {
  bg:           "#0a0e1a",
  panel:        "#0f1628",
  card:         "#141d35",
  cardHover:    "#192240",
  border:       "#1e2d50",
  borderLight:  "#263660",
  accent:       "#00d4ff",
  accentDim:    "rgba(0,212,255,0.12)",
  green:        "#00ff9d",
  greenDim:     "rgba(0,255,157,0.12)",
  yellow:       "#ffb800",
  yellowDim:    "rgba(255,184,0,0.12)",
  red:          "#ff3b6b",
  redDim:       "rgba(255,59,107,0.12)",
  orange:       "#ff6b35",
  purple:       "#a855f7",
  purpleDim:    "rgba(168,85,247,0.12)",
  textPrimary:  "#e2e8f0",
  textSecondary:"#64748b",
  textMuted:    "#334155",
  font:         "'IBM Plex Mono', 'Courier New', monospace",
};

// ─────────────────────────────────────────────────────────────
// STATUS HELPERS
// ─────────────────────────────────────────────────────────────
export function getStatusColor(status) {
  return { healthy: C.green, warning: C.yellow, anomaly: C.red }[status] ?? C.textSecondary;
}

export function getHealthColor(score) {
  if (score >= 85) return C.green;
  if (score >= 70) return C.yellow;
  return C.red;
}

export function formatTimestamp(iso) {
  if (!iso) return "--";
  return new Date(iso).toLocaleTimeString();
}

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES (inject once via App)
// ─────────────────────────────────────────────────────────────
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.textPrimary}; font-family: ${C.font}; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${C.borderLight}; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }
  @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  button { transition: all 0.15s ease; cursor: pointer; }
  button:hover { opacity: 0.85; transform: translateY(-1px); }
  button:active { transform: translateY(0); }
  select { cursor: pointer; }
`;
