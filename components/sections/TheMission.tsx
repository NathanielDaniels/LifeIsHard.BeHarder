'use client';

import { motion } from 'framer-motion';
import { useVitality } from '@/contexts/VitalityContext';
import RaceCalendar from '@/components/shared/RaceCalendar';

export default function TheMission() {
  const { theme } = useVitality();

  return (
    <section className="relative min-h-screen py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black" />

      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.primaryColor}33` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className=""
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden border border-white/10"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}22 0%, transparent 50%, ${theme.primaryColor}11 100%)`
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 px-6">
                  <div className="font-display text-6xl tracking-[0.2em] text-white/10">DARE2TRI</div>
                  <div className="font-display text-2xl tracking-[0.15em] text-white/10">ELITE DEVELOPMENT TEAM</div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                viewport={{ once: true }}
                className="absolute top-8 right-8 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white/20"
                style={{
                  backgroundColor: theme.primaryColor,
                  boxShadow: `0 0 40px ${theme.primaryColor}99`
                }}
              >
                <span className="text-white font-display text-sm text-center leading-tight tracking-wider">
                  ELITE
                  <br />
                  TEAM
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-[0.05em] text-white mb-6 leading-none">
                  NOT JUST<br />COMPETING.
                  <br />
                  <span style={{ color: theme.primaryColor }}>REPRESENTING.</span>
                </h2>
              </div>

              <div className="space-y-6 text-lg md:text-xl text-white/70 leading-relaxed">
                <p>
                  Acceptance to the <strong style={{ color: theme.primaryColor }}>Dare2Tri Elite Development Team</strong> isn't given. It's earned through relentless training, podium finishes, and a refusal to accept limitations.
                </p>
                <p>
                  Patrick was selected in 2026, joining an extraordinary group of para-triathletes who prove that physical differences are starting points, not endpoints.
                </p>
                <p>
                  Every race. Every mile. Every heartbeat is in service of the mission: <strong style={{ color: theme.primaryColor }}>show the world what's possible.</strong>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Extra tall spacer because inter-section gaps get free padding from py-32 on both sides */}
        <div className="h-[40vh]" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <RaceCalendar themeColor={theme.primaryColor} />
        </motion.div>
      </div>
    </section>
  );
}
