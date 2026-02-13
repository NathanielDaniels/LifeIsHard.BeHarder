'use client';

// ============================================
// Admin Page: WHOOP Connection Management
// URL: /admin/whoop
// Protected by ADMIN_SECRET
// ============================================

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

interface WhoopStatus {
  connected: boolean;
  mode: 'live' | 'demo' | 'unauthorized' | 'error';
  lastUpdated: string | null;
  recovery?: number | null;
  strain?: number | null;
  error?: string;
}

function WhoopAdminContent() {
  const [status, setStatus] = useState<WhoopStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const userName = searchParams.get('user');

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whoop/stats');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setStatus({
        connected: false,
        mode: 'error',
        lastUpdated: null,
        error: 'Failed to fetch status',
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check if we have a stored secret in session
    const stored = sessionStorage.getItem('admin_secret');
    if (stored) {
      setAdminSecret(stored);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatus();
    }
  }, [isAuthenticated, fetchStatus]);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!adminSecret.trim()) return;
    sessionStorage.setItem('admin_secret', adminSecret);
    setIsAuthenticated(true);
  }

  async function handleDisconnect() {
    if (!confirm('Are you sure you want to disconnect WHOOP?')) return;
    
    try {
      await fetch('/api/whoop/disconnect', {
        method: 'POST',
        headers: {
          'x-admin-secret': adminSecret,
        },
      });
      fetchStatus();
    } catch (err) {
      alert('Failed to disconnect');
    }
  }

  // --- Auth Gate ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-2 text-center">Admin Access</h1>
          <p className="text-white/60 mb-8 text-center">Enter admin secret to continue</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/50"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">WHOOP Integration</h1>
        <p className="text-white/60 mb-8">Manage biometric data connection</p>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-400">
              ✓ Successfully connected{userName ? ` as ${userName}` : ''}!
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">
              ✗ Connection failed: {decodeURIComponent(error)}
            </p>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Connection Status</h2>
            {loading ? (
              <span className="text-white/40">Loading...</span>
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm ${
                status?.mode === 'live' 
                  ? 'bg-green-500/20 text-green-400' 
                  : status?.mode === 'demo'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {status?.mode === 'live' ? 'Connected' : 
                 status?.mode === 'demo' ? 'Demo Mode' : 'Not Connected'}
              </span>
            )}
          </div>

          {status && !loading && (
            <div className="space-y-3 text-sm">
              {status.mode === 'live' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-white/60">Last Updated</span>
                    <span>{status.lastUpdated ? new Date(status.lastUpdated).toLocaleString() : 'N/A'}</span>
                  </div>
                  {status.recovery !== null && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Recovery</span>
                      <span className="text-green-400">{status.recovery}%</span>
                    </div>
                  )}
                  {status.strain !== null && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Strain</span>
                      <span className="text-orange-400">{status.strain}</span>
                    </div>
                  )}
                </>
              )}
              
              {status.mode === 'demo' && (
                <p className="text-white/60">
                  WHOOP integration is not configured or disabled. 
                  The site is showing demo data.
                </p>
              )}
              
              {status.error && (
                <p className="text-red-400 text-sm">{status.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {status?.mode !== 'live' ? (
            <a
              href={`/api/whoop/auth?secret=${encodeURIComponent(adminSecret)}`}
              className="block w-full py-4 px-6 bg-orange-500 hover:bg-orange-600 text-white text-center font-semibold rounded-lg transition-colors"
            >
              Connect WHOOP Account
            </a>
          ) : (
            <button
              onClick={handleDisconnect}
              className="w-full py-4 px-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-colors"
            >
              Disconnect WHOOP
            </button>
          )}
          
          <button
            onClick={fetchStatus}
            className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
          >
            Refresh Status
          </button>
        </div>

        {/* Setup Instructions */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4">Setup Instructions</h3>
          <ol className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <span className="text-orange-400 font-mono">1.</span>
              <span>Patrick logs into <a href="https://developer.whoop.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">developer.whoop.com</a></span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-400 font-mono">2.</span>
              <span>Create a new app with redirect URL pointing to this site</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-400 font-mono">3.</span>
              <span>Copy the Client ID and Client Secret</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-400 font-mono">4.</span>
              <span>Add credentials to environment variables and set WHOOP_ENABLED=true</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-400 font-mono">5.</span>
              <span>Click &quot;Connect WHOOP Account&quot; above and authorize</span>
            </li>
          </ol>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-white/40 hover:text-white text-sm">
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}

export default function WhoopAdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/40">Loading...</p>
      </div>
    }>
      <WhoopAdminContent />
    </Suspense>
  );
}
