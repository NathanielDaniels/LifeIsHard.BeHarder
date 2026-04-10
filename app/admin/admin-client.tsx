"use client";

import { useState, useEffect, useCallback } from "react";
import { ConnectionRecord, ConnectionStatus } from "@/types/api-tokens";
import BriefingCard from './components/briefing-card';

// ============================================
// Status dot colors
// ============================================
const STATUS_COLORS: Record<ConnectionStatus, string> = {
  connected: "bg-green-500",
  expiring: "bg-orange-400",
  expired: "bg-red-500",
  error: "bg-red-500",
  disconnected: "bg-white/30",
};

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  connected: "Connected",
  expiring: "Expiring Soon",
  expired: "Expired",
  error: "Error",
  disconnected: "Disconnected",
};

// ============================================
// Helpers
// ============================================
function timeAgo(iso: string | null): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatExpiry(iso: string | null, status: string): string {
  if (!iso) return "N/A";
  const date = new Date(iso);
  const diff = date.getTime() - Date.now();
  if (diff < 0) return "Expired";
  const mins = Math.floor(diff / 60000);
  // Short-lived tokens (under 2h) that are connected = auto-refreshing
  if (status === "connected" && diff < 2 * 60 * 60 * 1000) {
    return `Auto-refreshes in ${mins}m`;
  }
  if (mins < 60) return `${mins}m remaining`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h remaining`;
  const days = Math.floor(hours / 24);
  return `${days}d remaining`;
}

// ============================================
// Main Component
// ============================================
export default function AdminClient() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [healthCheckLoading, setHealthCheckLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ============================================
  // Fetch status
  // ============================================
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/status");
      if (res.status === 401) {
        setIsAuthed(false);
        return;
      }
      const data = await res.json();
      setConnections(data.connections || []);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if we already have a valid session on mount
  useEffect(() => {
    fetch("/api/admin/status")
      .then((res) => {
        if (res.ok) {
          setIsAuthed(true);
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data) setConnections(data.connections || []);
      })
      .catch(() => {});
  }, []);

  // Tick the countdown display every 30 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!isAuthed) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, [isAuthed]);

  // Auto-trigger health check when the earliest token expires
  useEffect(() => {
    if (!isAuthed || connections.length === 0) return;

    // Find the earliest token_expires_at that's still in the future
    const expiries = connections
      .map((c) => c.token_expires_at ? new Date(c.token_expires_at).getTime() : null)
      .filter((t): t is number => t !== null && t > Date.now());

    if (expiries.length === 0) return;

    const earliest = Math.min(...expiries);
    // Add 5 second buffer so the token has actually refreshed server-side
    const delay = earliest - Date.now() + 5000;

    if (delay <= 0) return;

    const timeout = setTimeout(() => {
      runHealthCheck();
    }, delay);

    return () => clearTimeout(timeout);
  }, [isAuthed, connections]); // eslint-disable-line react-hooks/exhaustive-deps

  // ============================================
  // Login
  // ============================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.error || "Login failed.");
        return;
      }

      setIsAuthed(true);
      setPassword("");
      fetchStatus();
    } catch {
      setLoginError("Network error. Try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ============================================
  // Logout
  // ============================================
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthed(false);
    setConnections([]);
  };

  // ============================================
  // Run health check manually
  // ============================================
  const runHealthCheck = async () => {
    setHealthCheckLoading(true);
    try {
      await fetch("/api/cron/health-check");
      await fetchStatus();
    } catch (err) {
      console.error("Health check failed:", err);
    } finally {
      setHealthCheckLoading(false);
    }
  };

  // ============================================
  // Reconnect
  // ============================================
  const handleReconnect = async (serviceId: string) => {
    setActionLoading(serviceId);
    try {
      const res = await fetch("/api/admin/reconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to get reconnect URL.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================
  // Disconnect
  // ============================================
  const handleDisconnect = async (serviceId: string) => {
    if (!confirm(`Disconnect ${serviceId.toUpperCase()}? This will revoke the API token.`)) return;

    setActionLoading(serviceId);
    try {
      // For WHOOP, use the existing disconnect endpoint
      // Cookie session handles auth automatically
      if (serviceId === "whoop") {
        await fetch("/api/whoop/disconnect", { method: "POST" });
      }
      await fetchStatus();
    } catch {
      alert("Disconnect failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================
  // Login Screen
  // ============================================
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl tracking-wider text-white/90">
              COMMAND CENTER
            </h1>
            <p className="font-mono text-xs tracking-widest text-white/30 uppercase">
              API Monitoring Dashboard
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 font-mono text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-colors"
            />
            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full py-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 font-mono text-sm tracking-wider uppercase hover:bg-orange-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loginLoading ? "Authenticating..." : "Authenticate"}
            </button>
          </div>

          {loginError && (
            <p className="text-red-400 text-center font-mono text-xs">
              {loginError}
            </p>
          )}
        </form>
      </div>
    );
  }

  // ============================================
  // Dashboard
  // ============================================
  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-wider text-white/90">
              COMMAND CENTER
            </h1>
            <p className="font-mono text-xs tracking-widest text-white/30 uppercase mt-1">
              API Health Monitor
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-mono text-xs tracking-wider text-white/40 hover:text-white/70 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Actions Bar */}
        <div className="flex gap-3">
          <button
            onClick={runHealthCheck}
            disabled={healthCheckLoading}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs tracking-wider text-white/60 hover:bg-white/10 hover:text-white/80 transition-colors disabled:opacity-40"
          >
            {healthCheckLoading ? "Checking..." : "Refresh"}
          </button>
        </div>

        {/* AI Intelligence Briefing */}
        <BriefingCard />

        {/* Service Cards */}
        {connections.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="font-mono text-sm text-white/30">
              No API connections configured.
            </p>
            <p className="font-mono text-xs text-white/20 mt-2">
              Run a health check to initialize connection records.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {connections.map((conn) => (
            <ServiceCard
              key={conn.id}
              connection={conn}
              isActionLoading={actionLoading === conn.id}
              onReconnect={() => handleReconnect(conn.id)}
              onDisconnect={() => handleDisconnect(conn.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center font-mono text-xs text-white/15 pt-8">
          Health checks run daily at 8:00 AM UTC
        </p>
      </div>
    </div>
  );
}

// ============================================
// Service Card Component
// ============================================
function ServiceCard({
  connection,
  isActionLoading,
  onReconnect,
  onDisconnect,
}: {
  connection: ConnectionRecord;
  isActionLoading: boolean;
  onReconnect: () => void;
  onDisconnect: () => void;
}) {
  const status = connection.status as ConnectionStatus;
  const isHealthy = status === "connected";
  const isExpiring = status === "expiring";

  return (
    <div
      className={`p-5 rounded-xl border transition-colors ${
        isHealthy
          ? "bg-white/[0.02] border-white/5"
          : isExpiring
          ? "bg-orange-500/[0.03] border-orange-500/20"
          : "bg-red-500/[0.03] border-red-500/20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status]} ${
              isHealthy ? "animate-pulse" : ""
            }`}
          />
          <h2 className="font-display text-xl tracking-wider text-white/90">
            {connection.display_name}
          </h2>
        </div>
        <span
          className={`font-mono text-xs tracking-wider uppercase ${
            isHealthy
              ? "text-green-400"
              : isExpiring
              ? "text-orange-400"
              : status === "disconnected"
              ? "text-white/30"
              : "text-red-400"
          }`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
        <Detail label="Token Expiry" value={formatExpiry(connection.token_expires_at, connection.status)} />
        <Detail label="Last Health Check" value={timeAgo(connection.last_health_check)} />
        <Detail label="Last Data Fetch" value={timeAgo(connection.last_successful_fetch)} />
        <Detail label="Updated" value={timeAgo(connection.updated_at)} />
      </div>

      {/* Error */}
      {connection.last_error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="font-mono text-xs text-red-300 break-words">
            {connection.last_error}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!isHealthy && (
          <button
            onClick={onReconnect}
            disabled={isActionLoading}
            className="px-4 py-2 bg-orange-500/15 border border-orange-500/25 rounded-lg font-mono text-xs tracking-wider text-orange-400 hover:bg-orange-500/25 transition-colors disabled:opacity-40"
          >
            {isActionLoading ? "..." : "Reconnect"}
          </button>
        )}
        {isHealthy && (
          <button
            onClick={onDisconnect}
            disabled={isActionLoading}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs tracking-wider text-white/40 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors disabled:opacity-40"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
        {label}
      </span>
      <p className="font-mono text-xs text-white/60">{value}</p>
    </div>
  );
}
