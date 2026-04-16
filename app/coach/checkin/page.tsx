'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function CheckinForm() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date') || '';
  const token = searchParams.get('token') || '';
  const confirmed = searchParams.get('confirmed') || '';

  const [limbStatus, setLimbStatus] = useState(confirmed || '');
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!date || !token) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/coach/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, token, limbStatus, energyLevel, notes }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={container}>
        <div style={card}>
          <p style={checkmark}>&#10003;</p>
          <h1 style={title}>Got it, Coach.</h1>
          <p style={subtitle}>Your check-in has been logged. Tomorrow&apos;s briefing will use this.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>DAILY CHECK-IN</h1>
        <p style={subtitle}>{date}</p>

        {confirmed && (
          <div style={confirmBanner}>
            &#10003; Logged: <strong>{confirmed.replace(/-/g, ' ')}</strong>
          </div>
        )}

        {/* Limb Status */}
        <div style={section}>
          <label style={label}>HOW&apos;S THE LEG?</label>
          <div style={buttonGroup}>
            {[
              { value: 'leg-healing', label: 'Still healing' },
              { value: 'leg-healed', label: 'Leg healed' },
              { value: 'socket-ready', label: 'Socket tested, good to go' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLimbStatus(opt.value)}
                style={limbStatus === opt.value ? selectedBtn : optionBtn}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div style={section}>
          <label style={label}>ENERGY LEVEL</label>
          <div style={buttonGroup}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setEnergyLevel(n)}
                style={energyLevel === n ? selectedBtn : optionBtn}
              >
                {n === 1 ? '1 - Drained' : n === 3 ? '3 - OK' : n === 5 ? '5 - Strong' : String(n)}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={section}>
          <label style={label}>ANYTHING ELSE?</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did training feel? Any pain? Something on your mind?"
            style={textArea}
            rows={3}
          />
        </div>

        {error && (
          <div style={errorBanner}>{error}</div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={submitBtn}
        >
          {submitting ? 'Sending...' : 'Send to Coach'}
        </button>
      </div>
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense fallback={
      <div style={container}>
        <div style={card}>
          <p style={subtitle}>Loading...</p>
        </div>
      </div>
    }>
      <CheckinForm />
    </Suspense>
  );
}

// ============================================
// Styles — dark theme matching the email
// ============================================

const container: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const card: React.CSSProperties = {
  backgroundColor: '#050505',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '32px 24px',
  maxWidth: '420px',
  width: '100%',
};

const title: React.CSSProperties = {
  fontFamily: '"Bebas Neue", Arial, sans-serif',
  fontSize: '28px',
  letterSpacing: '4px',
  color: '#fff',
  margin: '0 0 4px',
  textAlign: 'center',
};

const subtitle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(255,255,255,0.4)',
  textAlign: 'center',
  margin: '0 0 24px',
  fontFamily: 'monospace',
  letterSpacing: '2px',
};

const confirmBanner: React.CSSProperties = {
  backgroundColor: 'rgba(34,197,94,0.1)',
  border: '1px solid rgba(34,197,94,0.2)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#22c55e',
  fontSize: '14px',
  marginBottom: '24px',
  textAlign: 'center',
};

const checkmark: React.CSSProperties = {
  fontSize: '48px',
  color: '#22c55e',
  textAlign: 'center',
  margin: '0 0 12px',
};

const section: React.CSSProperties = {
  marginBottom: '24px',
};

const label: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '10px',
  letterSpacing: '3px',
  color: 'rgba(255,255,255,0.4)',
  display: 'block',
  marginBottom: '10px',
};

const buttonGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const optionBtn: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '14px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s',
};

const selectedBtn: React.CSSProperties = {
  ...optionBtn,
  backgroundColor: 'rgba(249,115,22,0.1)',
  borderColor: '#f97316',
  color: '#f97316',
};

const textArea: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: 'rgba(255,255,255,0.8)',
  fontSize: '14px',
  resize: 'vertical',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  boxSizing: 'border-box',
};

const errorBanner: React.CSSProperties = {
  backgroundColor: 'rgba(239,68,68,0.1)',
  border: '1px solid rgba(239,68,68,0.2)',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#ef4444',
  fontSize: '14px',
  marginBottom: '16px',
  textAlign: 'center',
};

const submitBtn: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#f97316',
  border: 'none',
  borderRadius: '8px',
  padding: '14px',
  color: '#000',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '1px',
  cursor: 'pointer',
  textTransform: 'uppercase',
};
