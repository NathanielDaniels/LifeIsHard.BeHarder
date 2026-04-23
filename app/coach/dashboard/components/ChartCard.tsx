'use client';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, description, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-[#0a0a0a] border border-white/8 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="font-mono text-xs tracking-[3px] text-white/55 uppercase">{title}</h3>
        {description && (
          <p className="text-xs text-white/35 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
