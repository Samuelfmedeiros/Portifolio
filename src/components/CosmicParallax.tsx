'use client';

import { useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';

/**
 * CosmicParallax - NASA/Star Wars inspired parallax with enhanced animations
 * 3 layers: Deep Space (L0), Holographic Data (L1), Frontal Interface (L2)
 */
<<<<<<< HEAD
export function CosmicParallax({ className, ...props }: { className?: string }) {
=======
export function CosmicParallax({ className }: { className?: string }) {
>>>>>>> origin/master
  const targetRef = useRef<HTMLDivElement>(null);

  // Scroll progress (0 to 1)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  // Layer 0: Deep Space (stars, nebulas) - very slow movement
  const layer0Y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const layer0Opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.6, 0.4]);

  // Layer 1: Holographic Data (lines, circles, text) - medium movement
  const layer1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const layer1Opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.5, 0.3]);

  // Layer 2: Frontal Interface (cards, headings) - faster movement
  const layer2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const layer2Opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.7, 0.5]);

  // Color transitions for ABNT compliance (accessible colors)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ['#0a0a0a', '#0a1a2a', '#0a2a1a', '#0a0a0a'] // Dark space with subtle shifts
  );

  const accentColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#00ffff', '#ffff00', '#ff00ff'] // Cyan, Yellow, Magenta (NASA inspired)
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#ffffff', '#ffff00', '#00ffff'] // White to Yellow to Cyan
  );

  return (
<<<<<<< HEAD
    <section ref={targetRef} className={`relative h-[300vh] w-full bg-black overflow-hidden ${className || ''}`}>
=======
    <section ref={targetRef} className={`relative h-[300vh] w-full bg-black overflow-hidden ${className || ""}`}>
>>>>>>> origin/master
      {/* LAYER 0: DEEP SPACE */}
      <motion.div
        style={{
          y: layer0Y,
          opacity: layer0Opacity,
          backgroundColor
        }}
        className="absolute inset-0 z-0"
      >
        {/* Star field */}
        <div className="absolute inset-0 bg-[url('/stars.png')] bg-[size:200px_200px] opacity-30" />
        {/* Nebula clouds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,255,0.05)_0%,_transparent_50%)] bg-[size:400px_400px] animate-[nebula_drift_20s_linear_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,0,0.03)_0%,_transparent_50%)] bg-[size:500px_500px] animate-[nebula_drift_30s_linear_infinite]" />
      </motion.div>

      {/* LAYER 1: HOLOGRAPHIC DATA */}
      <motion.div
        style={{
          y: layer1Y,
          opacity: layer1Opacity
        }}
        className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
      >
        {/* Holographic circles */}
        <div className="absolute w-[300px] h-[300px] rounded-full border-[2px] border-[hsl(180,100%,50%,0.3)] animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-[200px] h-[200px] rounded-full border-[2px] border-[hsl(60,100%,50%,0.3)] animate-[spin_15s_linear_infinite] rotate-45" />
        <div className="absolute w-[150px] h-[150px] rounded-full border-[2px] border-[hsl(300,100%,50%,0.3)] animate-[spin_25s_linear_infinite] rotate-90" />

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.line
            x1="10%" y1="20%" x2="90%" y2="40%"
            stroke="currentColor" strokeWidth="0.5"
            style={{ color: accentColor }}
          />
          <motion.line
            x1="80%" y1="30%" x2="20%" y2="70%"
            stroke="currentColor" strokeWidth="0.5"
            style={{ color: accentColor }}
          />
          <motion.line
            x1="50%" y1="10%" x2="50%" y2="90%"
            stroke="currentColor" strokeWidth="0.5"
            style={{ color: accentColor }}
          />
        </svg>

        {/* Floating holographic text */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[hsl(0,0%,100%,0.6)] text-sm font-mono">
          [<span className="animate-[pulse_2s_ease_in_out_infinite]">▓▓▓</span> TELEMETRY DATA <span className="animate-[pulse_2s_ease_in_out_infinite]">▓▓▓</span>]
        </div>
      </motion.div>

      {/* LAYER 2: FRONTAL INTERFACE */}
      <motion.div
        style={{
          y: layer2Y,
          opacity: layer2Opacity
        }}
        className="absolute inset-0 z-20 flex flex-col items-center px-4 md:px-8"
      >
        {/* Status panels */}
        <div className="space-y-6 w-full max-w-4xl">
          {/* Panel 1: Mission Status */}
          <div className="bg-[hsl(0,0%,0%,0.4)] backdrop-blur-sm border border-[hsl(180,100%,50%,0.3)] rounded-xl p-4">
            <h3 className="text-[hsl(0,0%,100%,0.9)] font-mono text-lg mb-2">
              MISSION STATUS: ACTIVE
            </h3>
            <p className="text-[hsl(0,0%,100%,0.7)] text-sm font-mono">
              LAUNCH WINDOW: OPEN • ORBITAL VELOCITY: 7.8 KM/S
            </p>
            <div className="flex space-x-4 mt-2 text-xs">
              <span>FUEL: 87%</span>
              <span>OXYGEN: 92%</span>
              <span>COMM: NOMINAL</span>
            </div>
          </div>

          {/* Panel 2: Navigation Data */}
          <div className="bg-[hsl(0,0%,0%,0.4)] backdrop-blur-sm border border-[hsl(60,100%,50%,0.3)] rounded-xl p-4">
            <h3 className="text-[hsl(0,0%,100%,0.9)] font-mono text-lg mb-2">
              NAVIGATION DATA
            </h3>
            <p className="text-[hsl(0,0%,100%,0.7)] text-sm font-mono">
              CURRENT ORBIT: LEO • INCLINATION: 28.5° • AZIMUTH: 142.3°
            </p>
            <div className="flex space-x-4 mt-2 text-xs">
              <span>ALTITUDE: 408 KM</span>
              <span>SPEED: 27,600 KM/H</span>
              <span>NEXT MANEUVER: T+00:15:00</span>
            </div>
          </div>

          {/* Panel 3: System Health */}
          <div className="bg-[hsl(0,0%,0%,0.4)] backdrop-blur-sm border border-[hsl(300,100%,50%,0.3)] rounded-xl p-4">
            <h3 className="text-[hsl(0,0%,100%,0.9)] font-mono text-lg mb-2">
              SYSTEM HEALTH
            </h3>
            <p className="text-[hsl(0,0%,100%,0.7)] text-sm font-mono">
              ALL SYSTEMS NOMINAL • RADIATION: SAFE • TEMPERATURE: OPTIMAL
            </p>
            <div className="flex space-x-4 mt-2 text-xs">
              <span>CPU: 45%</span>
              <span>MEMORY: 62%</span>
              <span>STORAGE: 78%</span>
            </div>
          </div>
        </div>

        {/* Progress indicator on the side */}
        <motion.div
          className="fixed right-6 top-1/2 -translate-y-1/2 z-30 w-1 h-24 bg-[hsl(0,0%,100%,0.2)] rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${accentColor.get()}20, ${accentColor.get()}80)`
          }}
        >
          <motion.div
            className="w-full bg-gradient-to-t from-[hsl(0,0%,100%,0.2)] to-[hsl(0,0%,100%,0.8)] rounded-full"
            style={{
              height: useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}