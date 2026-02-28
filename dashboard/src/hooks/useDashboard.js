import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchHealth,
  fetchSystemStatus,
  fetchAllServicesMetrics,
  fetchAnomalies,
} from "../services/api";

const REFRESH_INTERVAL = 5000;

/**
 * useAutoRefresh
 * Polls a given async function every `interval` ms.
 * Returns { data, loading, error, refresh }
 */
export function useAutoRefresh(fetchFn, interval = REFRESH_INTERVAL) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    mountedRef.current = true;
    refresh();
    const timer = setInterval(refresh, interval);
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [refresh, interval]);

  return { data, loading, error, refresh };
}

/**
 * useDashboard
 * Central hook that manages ALL dashboard data with 5s auto-refresh.
 */
export function useDashboard() {
  const [health, setHealth] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [services, setServices] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const mountedRef = useRef(true);

  const refreshAll = useCallback(async () => {
    try {
      const [h, s, svc, a] = await Promise.all([
        fetchHealth(),
        fetchSystemStatus(),
        fetchAllServicesMetrics(),
        fetchAnomalies(),
      ]);
      if (!mountedRef.current) return;
      setHealth(h);
      setSystemStatus(s);
      setServices(svc);
      setAnomalies(a);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Dashboard refresh error:", err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refreshAll();
    const timer = setInterval(refreshAll, REFRESH_INTERVAL);
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [refreshAll]);

  return { health, systemStatus, services, anomalies, loading, lastUpdated, refresh: refreshAll };
}

/**
 * useMetricsHistory
 * Maintains a rolling 30-point history for live charts.
 */
export function useMetricsHistory(services) {
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memHistory, setMemHistory] = useState([]);
  const [latHistory, setLatHistory] = useState([]);
  const [netHistory, setNetHistory] = useState([]);

  useEffect(() => {
    if (!services?.length) return;

    const avgCpu = services.reduce((s, v) => s + parseFloat(v.cpu), 0) / services.length;
    const avgMem = services.reduce((s, v) => s + parseFloat(v.memory), 0) / services.length;
    const avgLat = services.reduce((s, v) => s + parseFloat(v.latency), 0) / services.length;
    const avgNet = services.reduce((s, v) => s + parseFloat(v.network || 0), 0) / services.length;
    const point = { time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) };

    setCpuHistory((p) => [...p.slice(-29), { ...point, value: +avgCpu.toFixed(1) }]);
    setMemHistory((p) => [...p.slice(-29), { ...point, value: +avgMem.toFixed(1) }]);
    setLatHistory((p) => [...p.slice(-29), { ...point, value: +avgLat.toFixed(0) }]);
    setNetHistory((p) => [...p.slice(-29), { ...point, value: +avgNet.toFixed(1) }]);
  }, [services]);

  return { cpuHistory, memHistory, latHistory, netHistory };
}
