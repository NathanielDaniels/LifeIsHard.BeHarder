"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useVitality } from "@/contexts/VitalityContext";
import { HeartPulse, HeartOff, Users, Handshake, CalendarDays, ArrowLeft } from "lucide-react";

export default function SiteControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerIDRef.current) {
        clearTimeout(timerIDRef.current);
        timerIDRef.current = null;
      }
      if (droneOscRef.current) {
        try { droneOscRef.current.stop(); } catch {}
        droneOscRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Get vitality stats to drive the heartbeat speed
  const { energyState } = useVitality();

  // Determine heart rate based on energy state
  const getHeartRate = () => {
    switch (energyState) {
      case "HIGH":
        return 160; // Racing heart
      case "MEDIUM":
        return 120; // Elevated
      case "LOW":
        return 65; // Resting/Fatigued
      default:
        return 72;
    }
  };

  const bpm = getHeartRate();
  const bpmRef = useRef(bpm);
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  // Initialize Audio Context (must be user triggered partially, but we setup ref first)
  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.value = 0; // Start muted
      masterGainRef.current.connect(audioContextRef.current.destination);
    }

    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  const playHeartbeat = (time: number) => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    const ctx = audioContextRef.current;

    // Create oscillator for the "thump"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(masterGainRef.current);

    // Low frequency thump
    osc.frequency.setValueAtTime(60, time);
    osc.frequency.exponentialRampToValueAtTime(10, time + 0.1);

    // Envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.8, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.start(time);
    osc.stop(time + 0.2);

    // Secondary "du-dump" part of the heartbeat
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const t2 = time + 0.15; // Delay for second beat

    osc2.connect(gain2);
    gain2.connect(masterGainRef.current);

    osc2.frequency.setValueAtTime(50, t2);
    osc2.frequency.exponentialRampToValueAtTime(10, t2 + 0.1);

    gain2.gain.setValueAtTime(0, t2);
    gain2.gain.linearRampToValueAtTime(0.6, t2 + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.15);

    osc2.start(t2);
    osc2.stop(t2 + 0.2);
  };

  const startDrone = () => {
    if (
      !audioContextRef.current ||
      !masterGainRef.current ||
      droneOscRef.current
    )
      return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(35, ctx.currentTime); // Deep sub-bass drone

    // Filter to make it dark and atmospheric
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(80, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainRef.current);

    // Low constant volume
    gain.gain.setValueAtTime(0.05, ctx.currentTime);

    osc.start();
    droneOscRef.current = osc;
  };

  const scheduler = () => {
    if (!audioContextRef.current) return;
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (
      nextNoteTimeRef.current <
      audioContextRef.current.currentTime + scheduleAheadTime
    ) {
      // Schedule next beat
      playHeartbeat(nextNoteTimeRef.current);
      // Advance time by 60 / bpm
      const secondsPerBeat = 60.0 / bpmRef.current;
      nextNoteTimeRef.current += secondsPerBeat;
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  };

  const toggleSound = () => {
    if (isPlaying) {
      // Fade out
      if (masterGainRef.current && audioContextRef.current) {
        masterGainRef.current.gain.setTargetAtTime(
          0,
          audioContextRef.current.currentTime,
          0.5,
        );
        if (droneOscRef.current) {
          droneOscRef.current.stop(audioContextRef.current.currentTime + 1);
          droneOscRef.current = null;
        }
      }
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
      setIsPlaying(false);
    } else {
      // Init and Fade in
      initAudio();
      if (masterGainRef.current && audioContextRef.current) {
        masterGainRef.current.gain.setValueAtTime(
          0,
          audioContextRef.current.currentTime,
        );
        masterGainRef.current.gain.linearRampToValueAtTime(
          0.5,
          audioContextRef.current.currentTime + 2,
        ); // 2s fade in

        startDrone();
        nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
        scheduler();
      }
      setIsPlaying(true);
    }
  };

  const pathname = usePathname();
  const isOnTeamPage = pathname === "/team";
  const isOnSponsorsPage = pathname === "/sponsors";
  const isOnSchedulePage = pathname === "/schedule";
  const isOnAdminPage = pathname === "/admin";
  const isOnHomePage = pathname === "/";

  // Hide all controls on admin page
  if (isOnAdminPage) return null;

  return (
    <>
    {!isOnHomePage && (
      <Link
        href="/"
        className="fixed top-3 left-3 md:top-4 md:left-4 z-50 group p-3 md:p-3.5 backdrop-blur-md rounded-full border flex items-center justify-center bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80 transition-colors duration-200"
        aria-label="Back to main site"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="absolute left-full ml-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 whitespace-nowrap font-mono text-xs tracking-wider text-white/80 opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          Home
        </span>
      </Link>
    )}
    <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50 flex items-center gap-2">
      {!isOnSchedulePage && (
        <Link
          href="/schedule"
          className="group relative p-3 md:p-3.5 backdrop-blur-md rounded-full border transition-colors duration-200 flex items-center justify-center bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80"
        >
          <CalendarDays className="w-5 h-5" />
          <span className="absolute right-full mr-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 whitespace-nowrap font-mono text-xs tracking-wider text-white/80 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
            Schedule
          </span>
        </Link>
      )}
      {!isOnSponsorsPage && (
        <Link
          href="/sponsors"
          className="group relative p-3 md:p-3.5 backdrop-blur-md rounded-full border transition-colors duration-200 flex items-center justify-center bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80"
        >
          <Handshake className="w-5 h-5" />
          <span className="absolute right-full mr-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 whitespace-nowrap font-mono text-xs tracking-wider text-white/80 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
            Supporters
          </span>
        </Link>
      )}
      {!isOnTeamPage && (
        <Link
          href="/team"
          className="group relative p-3 md:p-3.5 backdrop-blur-md rounded-full border transition-colors duration-200 flex items-center justify-center bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80"
        >
          <Users className="w-5 h-5" />
          <span className="absolute right-full mr-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 whitespace-nowrap font-mono text-xs tracking-wider text-white/80 opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
            Team
          </span>
        </Link>
      )}
      <button
        onClick={toggleSound}
        title={isPlaying ? "Mute sound" : "Unmute sound"}
        className={`p-3 md:p-3.5 backdrop-blur-md rounded-full border transition-all flex items-center justify-center group ${
          isPlaying
            ? "bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20"
            : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white/80"
        }`}
      >
        {isPlaying ? (
          <HeartPulse className="w-5 h-5 text-orange-500 fill-orange-500/20" />
        ) : (
          <HeartOff className="w-5 h-5" />
        )}
      </button>
    </div>
    </>
  );
}
