<div align="center">

# AutoRemediateX

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)

[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&logo=github)](https://github.com/Varunpv2005/AutoRemediateX/pulls)

![Status](https://img.shields.io/badge/Status-Active-00ff9d?style=flat-square)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-00d4ff?style=flat-square)

**A production-grade, real-time Kubernetes observability dashboard with intelligent anomaly detection and automated self-healing remediation.**

</div>

---

## ✨ Features

- 🔴 **Real-time Monitoring** — Dashboard auto-refreshes every 5 seconds with live data
- 📊 **Live Metrics Charts** — Rolling 30-point charts for CPU, Memory, Latency & Network
- 🧠 **Anomaly Detection** — Visual scoring panel with critical alert highlights
- ⚡ **Automated Remediation** — Trigger restart, scale, or rollback actions per service
- 🗂️ **Service Health Table** — Sortable table with inline progress bars and status badges
- 📋 **Remediation Activity Log** — Timestamped log of all automated and manual actions
- 🎛️ **Manual Control Panel** — Detect anomalies and remediate any service on demand
- 🌙 **Dark DevOps Theme** — Grafana-inspired UI with IBM Plex Mono typography
- 🔌 **API Integration** — Real Axios calls with graceful mock fallback for demos

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| **Charts** | Recharts | Real-time data visualization |
| **HTTP Client** | Axios | API calls with interceptors |
| **Backend** | FastAPI (Python) | REST API server |
| **Orchestration** | Kubernetes | Container management |
| **Font** | IBM Plex Mono | DevOps-style typography |

---

## 📁 Project Structure
```
dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ClusterOverview.jsx
│   │   ├── MetricsCharts.jsx
│   │   ├── ServiceTable.jsx
│   │   ├── AnomalyPanel.jsx
│   │   ├── RemediationLog.jsx
│   │   └── ControlPanel.jsx
│   ├── hooks/
│   │   └── useDashboard.js
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── theme.js
│   ├── App.jsx
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/Varunpv2005/AutoRemediateX.git
cd AutoRemediateX/dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

### 4. Start the app
```bash
npm start
```

Open http://localhost:3000

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | System health status |
| `GET` | `/api/system-status` | Cluster-level statistics |
| `GET` | `/api/metrics/{service}` | Per-service metrics |
| `GET` | `/api/anomalies` | Detected anomalies |
| `POST` | `/api/remediate` | Trigger remediation |
| `POST` | `/api/detect-anomaly` | Run anomaly detection |

---

## 📡 Monitored Services

| Service | Port | Role |
|---------|------|------|
| `api-gateway` | 8080 | Entry point / routing |
| `auth-service` | 8081 | Authentication |
| `payment-service` | 8082 | Payment processing |
| `checkout-service` | 8083 | Order checkout |
| `inventory-service` | 8084 | Stock management |
| `notification-service` | 8085 | Email / push alerts |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Varun PV**
- GitHub: [@Varunpv2005](https://github.com/Varunpv2005)
- LinkedIn: [Varun PV](https://linkedin.com/in/varun-pv)
- Email: varunpv347@gmail.com

---

<div align="center">
⭐ If you found this project useful, please give it a star! ⭐
</div>
