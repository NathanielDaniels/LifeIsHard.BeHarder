'use client';

import { useState, useEffect, useRef } from 'react';
import { useVitality } from '@/contexts/VitalityContext';

export default function SoundController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  
  // Get vitality stats to drive the heartbeat speed
  const { energyState } = useVitality();
  
  // Determine heart rate based on energy state
  const getHeartRate = () => {
    switch (energyState) {
      case 'HIGH': return 160; // Racing heart
      case 'MEDIUM': return 120; // Elevated
      case 'LOW': return 65;   // Resting/Fatigued
      default: return 72;
    }
  };

  const bpm = getHeartRate();
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

  // Initialize Audio Context (must be user triggered partially, but we setup ref first)
  const initAudio = () => {
    if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.gain.value = 0; // Start muted
        masterGainRef.current.connect(audioContextRef.current.destination);
    }
    
    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
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
    if (!audioContextRef.current || !masterGainRef.current || droneOscRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(35, ctx.currentTime); // Deep sub-bass drone
    
    // Filter to make it dark and atmospheric
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
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
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
        // Schedule next beat
        playHeartbeat(nextNoteTimeRef.current);
        // Advance time by 60 / bpm
        const secondsPerBeat = 60.0 / bpm;
        nextNoteTimeRef.current += secondsPerBeat;
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  };

  const toggleSound = () => {
    if (isPlaying) {
      // Fade out
      if (masterGainRef.current && audioContextRef.current) {
         masterGainRef.current.gain.setTargetAtTime(0, audioContextRef.current.currentTime, 0.5);
      }
      if (timerIDRef.current) clearTimeout(timerIDRef.current);
      if (droneOscRef.current) {
          droneOscRef.current.stop(audioContextRef.current!.currentTime + 1);
          droneOscRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Init and Fade in
      initAudio();
      if (masterGainRef.current && audioContextRef.current) {
        masterGainRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 2); // 2s fade in
        
        startDrone();
        nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
        scheduler();
      }
      setIsPlaying(true);
    }
  };

  return (
    <button 
      onClick={toggleSound}
      className="fixed top-4 right-4 z-50 px-5 py-3 bg-white/5 backdrop-blur-md rounded-full text-white/50 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/30 border border-white/5 transition-all text-xs font-mono tracking-widest uppercase flex items-center gap-2 group"
    >
      {isPlaying ? (
         <>
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>Sound On</span>
         </>
      ) : (
        <>
            <span className="h-2 w-2 rounded-full bg-white/20 group-hover:bg-orange-500/50 transition-colors"></span>
            <span>Sound Off</span>
        </>
      )}
    </button>
  );
}
