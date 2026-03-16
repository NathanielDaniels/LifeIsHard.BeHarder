'use client';

interface GlitchTextProps {
  text: string;
  themeColor: string;
}

export default function GlitchText({ text, themeColor }: GlitchTextProps) {
  return (
    <span className="relative inline-block">
      <span
        className="relative z-10"
        style={{
          color: themeColor,
          textShadow: `0 0 30px ${themeColor}66, 3px 3px 0 rgba(0,0,0,0.4)`,
        }}
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 z-0 opacity-80"
        style={{ color: '#0ff', animation: 'glitch-1 3s infinite' }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute top-0 left-0 z-0 opacity-80"
        style={{ color: '#f0f', animation: 'glitch-2 3s infinite' }}
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}
