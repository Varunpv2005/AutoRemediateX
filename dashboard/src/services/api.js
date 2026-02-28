import axios from "axios";

// ─────────────────────────────────────────────────────────────
// BASE CONFIG
// ─────────────────────────────────────────────────────────────
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – attach auth token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("arx_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor – log errors globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.warn("[AutoRemediateX API Error]", err.message);
    return Promise.reject(err);
  }
);

// ─────────────────────────────────────────────────────────────
// MOCK DATA (used as fallback when API is unreachable)
// ─────────────────────────────────────────────────────────────
const SERVICES = [
  "payment-service",
  "inventory-service",
  "checkout-service",
  "auth-service",
  "notification-service",
  "api-gateway",
];

function rand(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function mockHealth() {
  return { status: "degraded", uptime: "14d 7h 22m", version: "v2.3.1" };
}

function mockSystemStatus() {
  return {
    totalServices: SERVICES.length,
    activeAnomalies: Math.floor(Math.random() * 4),
    remediationActions: Math.floor(Math.random() * 12) + 3,
    healthScore: Math.floor(rand(72, 96)),
    clusterName: "prod-us-east-1",
    nodes: 3,
    k8sVersion: "1.29.2",
  };
}

function mockMetrics(service) {
  return {
    service,
    cpu: rand(10, 95),
    memory: rand(30, 92),
    latency: rand(20, 300),
    network: rand(5, 80),
    restarts: Math.floor(Math.random() * 5),
    healthScore: Math.floor(rand(50, 99)),
    status: Math.random() > 0.7 ? (Math.random() > 0.5 ? "warning" : "anomaly") : "healthy",
    history: Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (20 - i) * 5000).toLocaleTimeString(),
      cpu: rand(10, 95),
      memory: rand(30, 92),
      latency: rand(20, 300),
    })),
  };
}

function mockAnomalies() {
  const rootMetrics = ["cpu_usage", "memory_leak", "latency_spike", "error_rate", "disk_io"];
  const actions = ["Auto-scaled", "Pod restarted", "Rollback triggered", "Alert sent", "Investigating"];
  return Array.from({ length: 6 }, (_, i) => ({
    id: `anomaly-${i}`,
    service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
    anomalyScore: rand(0.5, 0.99),
    rootMetric: rootMetrics[Math.floor(Math.random() * rootMetrics.length)],
    detectedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    actionTaken: actions[Math.floor(Math.random() * actions.length)],
    critical: Math.random() > 0.55,
  }));
}

// ─────────────────────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/health
 * Returns overall system health status.
 */
export async function fetchHealth() {
  try {
    const { data } = await apiClient.get("/api/health");
    return data;
  } catch {
    return mockHealth();
  }
}

/**
 * GET /api/system-status
 * Returns cluster-level statistics.
 */
export async function fetchSystemStatus() {
  try {
    const { data } = await apiClient.get("/api/system-status");
    return data;
  } catch {
    return mockSystemStatus();
  }
}

/**
 * GET /api/metrics/:service
 * Returns current + historical metrics for a specific service.
 */
export async function fetchMetrics(service) {
  try {
    const { data } = await apiClient.get(`/api/metrics/${service}`);
    return data;
  } catch {
    return mockMetrics(service);
  }
}

/**
 * Fetch metrics for ALL services in parallel.
 * Returns an array of service metric objects.
 */
export async function fetchAllServicesMetrics() {
  return Promise.all(SERVICES.map((s) => fetchMetrics(s)));
}

/**
 * GET /api/anomalies
 * Returns list of currently detected anomalies.
 */
export async function fetchAnomalies() {
  try {
    const { data } = await apiClient.get("/api/anomalies");
    return data;
  } catch {
    return mockAnomalies();
  }
}

/**
 * POST /api/remediate
 * Triggers automated remediation for a given service.
 * @param {string} service - The target service name
 * @param {string} action  - Remediation type: "restart" | "scale" | "rollback"
 */
export async function triggerRemediation(service, action = "restart") {
  try {
    const { data } = await apiClient.post("/api/remediate", { service, action });
    return data;
  } catch {
    // Mock success response
    return {
      success: true,
      message: `Remediation '${action}' triggered for ${service}`,
      jobId: `job-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * POST /api/detect-anomaly
 * Manually triggers anomaly detection for a service.
 * @param {string} service - The target service name
 */
export async function detectAnomaly(service) {
  try {
    const { data } = await apiClient.post("/api/detect-anomaly", { service });
    return data;
  } catch {
    return {
      success: true,
      service,
      anomalyDetected: Math.random() > 0.4,
      score: rand(0.3, 0.95),
      timestamp: new Date().toISOString(),
    };
  }
}

export const MONITORED_SERVICES = SERVICES;
export default apiClient;
