'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useVitality } from '@/contexts/VitalityContext';

export default function SupportCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Mock fundraising data - will connect to real API
  const [fundingData] = useState({
    current: 12500,
    goal: 25000,
    supporters: 47
  });

  const percentage = (fundingData.current / fundingData.goal) * 100;

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6">
      {/* Background with mountain silhouette */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black">
        {/* Mountain SVG overlay */}
        <svg className="absolute bottom-0 w-full h-64 text-white/5" viewBox="0 0 1440 320" fill="currentColor">
          <path d="M0,160L48,144C96,128,192,96,288,101.3C384,107,480,149,576,149.3C672,149,768,107,864,90.7C960,75,1056,85,1152,106.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            THE <span className="text-orange-500">CLIMB</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto">
            We're not just raising funds. We're scaling a mountain. Join the ascent.
          </p>
        </motion.div>

        {/* Elevation Map Visualization */}
        <FundingMountain 
          current={fundingData.current} 
          goal={fundingData.goal} 
          supporters={fundingData.supporters} 
        />

        {/* Sponsorship tiers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
            Supply <span className="text-orange-500">The Camp</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <TierCard
              tier="Base Camp"
              amount="$500"
              benefits={["Logo on website", "Social media shoutout", "Race day recognition"]}
              color="from-amber-600 to-amber-800"
            />
            <TierCard
              tier="High Camp"
              amount="$1,500"
              benefits={["All Base Camp benefits", "Logo on race gear", "Monthly updates", "Behind-the-scenes access"]}
              color="from-gray-400 to-gray-600"
              featured
            />
            <TierCard
              tier="Summit"
              amount="$5,000+"
              benefits={["All High Camp benefits", "Primary logo placement", "Personal meet & greet", "Custom content package"]}
              color="from-yellow-500 to-yellow-700"
            />
          </div>
        </motion.div>

        {/* Tax deductible note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-white/50 text-sm">
            All contributions made through Dare2tri are tax-deductible. Dare2tri is a 501(c)(3) nonprofit organization.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Sub-components
// Sub-components

function FundingMountain({ current, goal, supporters }: { current: number, goal: number, supporters: number }) {
  const percentage = Math.min(100, Math.max(0, (current / goal) * 100));
  const { theme, energyState } = useVitality();
  
  // Weather effects based on vitality
  const getWeatherClass = () => {
    switch(energyState) {
      case 'HIGH': return 'bg-orange-500/10'; // Clear day
      case 'MEDIUM': return 'bg-yellow-500/10'; // Hazy
      case 'LOW': return 'bg-red-900/20 backdrop-blur-sm'; // Stormy
    }
  };

  return (
    <div className={`relative mb-32 p-8 rounded-3xl border border-white/10 ${getWeatherClass()} transition-all duration-1000 overflow-hidden`}>
      {/* Fog/Weather Layers */}
      {energyState === 'LOW' && (
        <motion.div 
          animate={{ x: [-100, 100] }} 
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" 
        />
      )}

      {/* Stats Overlay */}
      <div className="flex justify-between items-end mb-8 relative z-10">
        <div>
          <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Elevation Reached</div>
          <div className="text-5xl md:text-7xl font-black text-white">
            ${current.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Summit Goal</div>
          <div className="text-3xl font-bold text-white/70">
            ${goal.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Mountain Graph */}
      <div className="relative h-64 md:h-96 w-full mt-12">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(p => (
          <div key={p} className="absolute w-full border-t border-white/5" style={{ bottom: `${p}%` }}>
            <span className="absolute -top-3 right-0 text-xs text-white/20">{p}%</span>
          </div>
        ))}

        {/* The Mountain Path SVG */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mountainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.primaryColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={theme.primaryColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Path Definition */}
          {/* M start, L points... simple mountain profile */}
          <motion.path
            d="M0,384 L100,350 L250,300 L400,320 L550,200 L700,250 L850,100 L1000,150 L1200,0 L1200,384 Z"
            fill="url(#mountainGradient)"
            className="transition-colors duration-1000"
            initial={{ d: "M0,384 L1200,384 Z" }}
            whileInView={{ d: "M0,384 L100,350 L250,300 L400,320 L550,200 L700,250 L850,100 L1000,150 L1200,0 L1200,384 Z" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          
          {/* Progress Line */}
          <motion.path
            d="M0,384 L100,350 L250,300 L400,320 L550,200 L700,250 L850,100 L1000,150 L1200,0"
            fill="none"
            stroke={theme.primaryColor}
            strokeWidth="4"
            className="transition-colors duration-1000"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />

          {/* Climber Marker - Position needs to be calculated or estimated based on path */}
          {/* Simplified for demo: Just a marker that moves horizontally and vertically based on funding % */}
        </svg>

        {/* Animated Climber Marker (Absolute positioned for simplicity over complex SVG path math for now) */}
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"
          initial={{ left: '0%', bottom: '0%' }}
          whileInView={{ 
            left: `${percentage}%`, 
            // Rough approximation of height based on % for visual effect
            bottom: `${percentage * 0.8 + (Math.sin(percentage * 0.1) * 10)}%` 
          }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white"
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          
          {/* Label tooltip */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-xs font-bold whitespace-nowrap">
            CURRENT ELEVATION
          </div>
        </motion.div>

        {/* Milestones */}
        {[25, 50, 75].map((ms) => (
          <div 
            key={ms} 
            className="absolute w-px h-full border-l border-dashed border-white/10 flex flex-col justify-end pb-2"
            style={{ left: `${ms}%` }}
          >
            <div className={`text-[10px] uppercase tracking-widest -rotate-90 origin-bottom-left translate-x-3 mb-4 ${percentage >= ms ? 'text-white' : 'text-white/30'}`}>
              Camp {ms/25}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer & CTAs */}
      <div className="mt-8 flex flex-col md:flex-row gap-8 items-center justify-between border-t border-white/10 pt-6">
        <div className="flex gap-12">
          <div>
            <span className="block text-2xl font-bold text-white">{supporters}</span>
            <span className="text-xs text-white/50 uppercase">Backers</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-white">{(percentage).toFixed(1)}%</span>
            <span className="text-xs text-white/50 uppercase">Complete</span>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 md:flex-none px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-all"
          >
           BECOME A SPONSOR
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${theme.primaryColor}` }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 md:flex-none px-8 py-3 text-white font-black rounded-full transition-all"
            style={{ backgroundColor: theme.primaryColor }}
          >
            SUPPORT NOW
          </motion.button>
        </div>
      </div>
    </div>
  );
}


interface TierCardProps {
  tier: string;
  amount: string;
  benefits: string[];
  color: string;
  featured?: boolean;
}

function TierCard({ tier, amount, benefits, color, featured }: TierCardProps) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative p-8 rounded-2xl border ${
        featured ? 'border-orange-500' : 'border-white/10'
      } bg-white/5 backdrop-blur-sm overflow-hidden`}
    >
      {featured && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-black rounded-full">
          POPULAR
        </div>
      )}

      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />

      <div className="mb-6">
        <h4 className="text-2xl font-black text-white mb-2">{tier}</h4>
        <div className="text-4xl font-black text-orange-500">{amount}</div>
      </div>

      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3 text-white/70">
            <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
