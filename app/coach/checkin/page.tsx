'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function CheckinForm() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date') || '';
  const token = searchParams.get('token') || '';
  const confirmed = searchParams.get('confirmed') || '';
  const mode = searchParams.get('mode') || 'training';
  const coachQuestion = searchParams.get('q') || '';
  const coachOptions = (searchParams.get('opts') || '').split('||').filter(Boolean);
  const isLimbMode = mode === 'limb';

  const [status, setStatus] = useState(confirmed || '');
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);
  const [bodyFeeling, setBodyFeeling] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [trainingStatus, setTrainingStatus] = useState('');
  const [limbStatus, setLimbStatus] = useState('');
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
        body: JSON.stringify({
          date, token,
          limbStatus: limbStatus || status,
          energyLevel,
          bodyFeeling,
          stressLevel,
          trainingStatus,
          notes,
        }),
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

        {/* Coach's question — dynamic from today's briefing */}
        {coachQuestion && (
          <div style={section}>
            <div style={coachQuestionBox}>
              <label style={label}>COACH ASKED</label>
              <p style={coachQuestionText}>{coachQuestion}</p>
            </div>
          </div>
        )}

        {/* Training plan */}
        <div style={section}>
          <label style={label}>TODAY&apos;S PLAN</label>
          <div style={buttonRow}>
            {[
              { value: 'following-plan', label: 'Following coach plan' },
              { value: 'different-plan', label: 'Doing something else' },
              { value: 'rest-day', label: 'Taking a rest day' },
              { value: 'unsure', label: 'Not sure yet' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTrainingStatus(opt.value)}
                style={trainingStatus === opt.value ? selectedBtnCompact : optionBtnCompact}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body check */}
        <div style={section}>
          <label style={label}>HOW ARE YOU FEELING THIS MORNING?</label>
          <div style={buttonRow}>
            {[
              { value: 'strong', label: '\u{1F4AA} Strong' },
              { value: 'good', label: '\u{1F44D} Good' },
              { value: 'tight', label: '\u{1F9B4} Tight/sore' },
              { value: 'beat-up', label: '\u{1F915} Beat up' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBodyFeeling(opt.value)}
                style={bodyFeeling === opt.value ? selectedBtnCompact : optionBtnCompact}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div style={section}>
          <label style={label}>ENERGY LEVEL</label>
          <div style={buttonRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setEnergyLevel(n)}
                style={energyLevel === n ? selectedBtnCompact : optionBtnCompact}
              >
                {n === 1 ? '1 \u2014 Drained' : n === 3 ? '3 \u2014 OK' : n === 5 ? '5 \u2014 Strong' : String(n)}
              </button>
            ))}
          </div>
        </div>

        {/* Stress check */}
        <div style={section}>
          <label style={label}>STRESS OUTSIDE TRAINING</label>
          <div style={buttonRow}>
            {[
              { value: 'low', label: 'Low' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'high', label: 'High' },
              { value: 'none', label: 'All good' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStressLevel(opt.value)}
                style={stressLevel === opt.value ? selectedBtnCompact : optionBtnCompact}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Limb status — always available, not just limb mode */}
        <div style={section}>
          <label style={label}>LEG / PROSTHETIC</label>
          <div style={buttonRow}>
            {[
              { value: 'good', label: 'Feeling good' },
              { value: 'minor', label: 'Minor issues' },
              { value: 'healing', label: 'Still healing' },
              { value: 'healed', label: 'Fully healed' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLimbStatus(opt.value)}
                style={limbStatus === opt.value ? selectedBtnCompact : optionBtnCompact}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Open notes */}
        <div style={section}>
          <label style={label}>ANYTHING ELSE FOR COACH?</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How training felt, what&apos;s on your mind, plans for tomorrow..."
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

const buttonRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
};

const optionBtnCompact: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: 'rgba(255,255,255,0.6)',
  fontSize: '13px',
  cursor: 'pointer',
  textAlign: 'center',
  flex: '1 1 auto',
  minWidth: '80px',
};

const selectedBtnCompact: React.CSSProperties = {
  ...optionBtnCompact,
  backgroundColor: 'rgba(249,115,22,0.1)',
  borderColor: '#f97316',
  color: '#f97316',
};

const coachQuestionBox: React.CSSProperties = {
  backgroundColor: 'rgba(249,115,22,0.04)',
  border: '1px solid rgba(249,115,22,0.15)',
  borderLeft: '3px solid #f97316',
  borderRadius: '0 8px 8px 0',
  padding: '16px',
};

const coachQuestionText: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: 'rgba(255,255,255,0.7)',
  margin: '8px 0 0',
  fontStyle: 'italic',
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
