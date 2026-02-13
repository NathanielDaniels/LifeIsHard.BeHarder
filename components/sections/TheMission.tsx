'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function TheMission() {
  return (
    <section className="relative min-h-screen py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />
      
      {/* Radial glow effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            THE <span className="text-orange-500">MISSION</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 font-light max-w-3xl mx-auto">
            Representing the elite. Pushing boundaries. Inspiring possibility.
          </p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80"
              alt="Dare2tri athlete"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            {/* Elite badge overlay */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
              className="absolute top-8 right-8 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-4 border-white/20"
              style={{
                boxShadow: '0 0 40px rgba(249, 115, 22, 0.6)'
              }}
            >
              <span className="text-white font-black text-sm text-center leading-tight">
                ELITE
                <br />
                TEAM
              </span>
            </motion.div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
                Dare2tri <span className="text-orange-500">Elite Team</span>
              </h3>
              <p className="text-xl text-white/70 leading-relaxed mb-6">
                Acceptance to the Dare2tri Elite Team represents the pinnacle of para-triathlon achievement. 
                It's not just about athletic performance—it's about embodying resilience, dedication, and 
                the relentless pursuit of excellence.
              </p>
              <p className="text-xl text-white/70 leading-relaxed">
                Patrick was selected in 2025, joining an extraordinary group of athletes who prove that 
                physical limitations are merely starting points, not endpoints.
              </p>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-6">
              <StatBadge label="Acceptance Year" value="2025" />
              <StatBadge label="Team Size" value="Elite 12" />
            </div>
          </motion.div>
        </div>

        {/* What it takes section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
            What It Takes to <span className="text-orange-500">Compete</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <CostCard
              icon="✈️"
              title="Travel"
              description="Multiple races across the country require flights, ground transportation, and logistics."
              highlight="$8,000-12,000"
            />
            <CostCard
              icon="🏨"
              title="Lodging"
              description="Race weekends demand accommodation near venues, often in peak tourism areas."
              highlight="$3,000-5,000"
            />
            <CostCard
              icon="🏃"
              title="Equipment & Fees"
              description="Race registrations, specialized equipment, training gear, and adaptive technology."
              highlight="$5,000-8,000"
            />
          </div>
        </motion.div>

        {/* Mission statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block p-12 md:p-16 rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent backdrop-blur-sm">
            <p className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              Every race is proof.
              <br />
              Every mile is a message.
              <br />
              <span className="text-orange-500">Limits are negotiable.</span>
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface StatBadgeProps {
  label: string;
  value: string;
}

function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="p-6 rounded-2xl border border-orange-500/30 bg-orange-500/5 backdrop-blur-sm">
      <div className="text-sm text-white/50 uppercase tracking-widest mb-2">
        {label}
      </div>
      <div className="text-3xl font-black text-orange-500">
        {value}
      </div>
    </div>
  );
}

interface CostCardProps {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

function CostCard({ icon, title, description, highlight }: CostCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h4 className="text-2xl font-bold text-white mb-3">{title}</h4>
      <p className="text-white/60 mb-4 leading-relaxed">{description}</p>
      <div className="text-xl font-black text-orange-500">{highlight}</div>
    </motion.div>
  );
}
