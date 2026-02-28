# AutoRemediateX Dashboard

> Intelligent Self-Healing Kubernetes Monitoring Dashboard

A production-grade React dashboard for monitoring microservices health, detecting anomalies,
and triggering automated remediation actions — built for your FastAPI backend.

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| UI         | React 18                |
| Charts     | Recharts                |
| HTTP       | Axios                   |
| Styling    | Inline styles (CSS-in-JS, no Tailwind dependency) |
| Font       | IBM Plex Mono           |

---

## Project Structure

```
dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ClusterOverview.jsx   # Stat cards: services, anomalies, remediations, health
│   │   ├── MetricsCharts.jsx     # 4x real-time AreaCharts (CPU, Memory, Latency, Network)
│   │   ├── ServiceTable.jsx      # Sortable table with inline bars + action buttons
│   │   ├── AnomalyPanel.jsx      # Anomaly list with critical highlights
│   │   ├── RemediationLog.jsx    # Activity log with severity icons
│   │   └── ControlPanel.jsx      # Manual detect + remediate controls
│   ├── hooks/
│   │   └── useDashboard.js       # useDashboard + useMetricsHistory hooks
│   ├── pages/
│   │   └── Dashboard.jsx         # Main layout page
│   ├── services/
│   │   └── api.js                # Axios calls to FastAPI + mock fallback
│   ├── utils/
│   │   └── theme.js              # Design tokens + globalStyles
│   ├── App.jsx
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

---

## Quick Start

```bash
# 1. Install dependencies
cd dashboard
npm install

# 2. Configure your FastAPI URL
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:8000

# 3. Start dev server
npm start
```

---

## API Endpoints Used

| Method | Endpoint                  | Purpose                              |
|--------|---------------------------|--------------------------------------|
| GET    | `/api/health`             | Overall system health status         |
| GET    | `/api/system-status`      | Cluster-level statistics             |
| GET    | `/api/metrics/{service}`  | Per-service CPU / memory / latency   |
| GET    | `/api/anomalies`          | Currently detected anomalies         |
| POST   | `/api/remediate`          | Trigger remediation `{ service, action }` |
| POST   | `/api/detect-anomaly`     | Manually run anomaly detection `{ service }` |

All API calls fall back to **rich mock data** automatically if the backend is unreachable —
so the dashboard works fully offline for demos.

---

## Features

- **5-second auto-refresh** — all panels update automatically
- **Real-time charts** — rolling 30-point window for CPU, Memory, Latency, Network
- **Sortable service table** — click column headers to sort
- **Manual control panel** — trigger detect / remediate per-service with action type
- **Remediation log** — live prepend on every triggered action
- **Dark DevOps theme** — Grafana-style with IBM Plex Mono, glowing accents
- **Mock fallback** — works without backend for demos and interviews

---

## Deployment

**Frontend (Vercel)**
```bash
npm run build
# Deploy /build folder to Vercel
```

**Backend (Railway / Render)**
- Deploy your FastAPI service
- Set `REACT_APP_API_URL` to your production API URL

Having a **live demo URL** on your resume is the strongest differentiator.

---

## Resume Bullet Points

```
• Built real-time Kubernetes monitoring dashboard (React + Recharts) with 5-second
  auto-refresh across 6 microservices, visualizing CPU, memory, and latency trends

• Integrated 6 FastAPI REST endpoints for health monitoring, anomaly detection,
  and automated remediation with Axios interceptors and graceful mock fallback

• Designed Grafana-style dark-mode UI with sortable service health table,
  anomaly scoring panel, and live remediation activity log
```
