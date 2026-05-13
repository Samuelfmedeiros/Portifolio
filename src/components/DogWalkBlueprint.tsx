/**
 * EasterEggs.tsx - Diagrama interativo estilo blueprint/engenharia
 * Planta de engenharia da nave DogWalk
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  data: string[];
  requirements: string[];
}

const MODULES: Module[] = [
  {
    id: 'database',
    name: 'Database Schema',
    icon: '🗄️',
    description: 'Estrutura da base de dados PostgreSQL no Supabase',
    color: '#06b6d4',
    data: [
      'profiles (id, email, role, full_name)',
      'pets (id, owner_id, breed, size)',
      'bookings (id, tutor_id, walker_id, status)',
      'walks (id, booking_id, started_at)',
      'wallet_transactions (id, user_id, amount)',
    ],
    requirements: ['PostgreSQL', 'RLS Policies', 'Triggers']
  },
  {
    id: 'auth',
    name: 'Authentication',
    icon: '🔐',
    description: 'Sistema de autenticação com roles',
    color: '#8b5cf6',
    data: [
      'Supabase Auth (email/password)',
      'user_metadata (role: tutor/walker/master)',
      'JWT refresh token flow',
      'Rate limiting via Edge Functions',
    ],
    requirements: ['Supabase Auth', 'Custom claims', 'MFA']
  },
  {
    id: 'payments',
    name: 'Payment Engine',
    icon: '💳',
    description: 'Stripe Connect para payouts de walkers',
    color: '#10b981',
    data: [
      'Stripe Checkout Session',
      'Stripe Connect (onboarding)',
      'Webhooks (_worker.js)',
      'Wallet transactions ledger',
    ],
    requirements: ['Stripe Dashboard', 'Connect T&Cs', 'Webhook endpoint']
  },
  {
    id: 'realtime',
    name: 'Real-time Sync',
    icon: '📡',
    description: 'Supabase Realtime para GPS tracking',
    color: '#f59e0b',
    data: [
      'GPSContext (watchPosition)',
      'Supabase Realtime channels',
      'ActiveWalkInterface',
      'Chat via Realtime subscriptions',
    ],
    requirements: ['HTTPS/WSS', 'GPS permission', 'Channel auth']
  },
  {
    id: 'maps',
    name: 'Map System',
    icon: '🗺️',
    description: 'Leaflet + OpenStreetMap para geolocalização',
    color: '#ef4444',
    data: [
      'react-leaflet (map rendering)',
      'leaflet-draw (service area)',
      'OpenStreetMap tiles',
      'Geocoding via Nominatim',
    ],
    requirements: ['Map tiles API', 'GPS coordinates', 'Distance calc']
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    icon: '🤖',
    description: 'Chatbot AI para dúvidas dos usuários',
    color: '#ec4899',
    data: [
      'AIChat.jsx component',
      'OpenRouter API (llama-3.3)',
      'System prompt (pt-BR)',
      'Conversation history',
    ],
    requirements: ['OpenRouter key', 'Rate limits', 'Context window']
  },
];

export function DogWalkBlueprint() {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full min-h-[600px] bg-slate-950 rounded-xl border border-cyan-500/30 overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Title */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-cyan-400 font-mono text-sm tracking-wider">
          [ DOGWALK SYSTEM ARCHITECTURE ]
        </h3>
        <p className="text-slate-500 text-xs mt-1">Clique em um módulo para ver detalhes</p>
      </div>

      {/* Connection lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        {MODULES.map((mod, i) => {
          const x = 15 + (i % 3) * 30;
          const y = 25 + Math.floor(i / 3) * 40;
          return (
            <motion.line
              key={mod.id}
              x1={`${x}%`} y1={`${y}%`}
              x2="50%" y2="50%"
              stroke={mod.color}
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Module nodes */}
      <div className="absolute inset-0 p-8 flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.id}
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => setActiveModule(activeModule?.id === mod.id ? null : mod)}
                onMouseEnter={() => setHoveredNode(mod.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`
                  w-full p-4 rounded-lg border transition-all duration-300
                  ${hoveredNode === mod.id 
                    ? 'bg-slate-900/80 scale-105' 
                    : 'bg-slate-900/40'
                  }
                `}
                style={{ 
                  borderColor: activeModule?.id === mod.id ? mod.color : `${mod.color}50`,
                  boxShadow: activeModule?.id === mod.id ? `0 0 20px ${mod.color}40` : 'none'
                }}
              >
                <div className="text-3xl mb-2">{mod.icon}</div>
                <div className="text-sm font-mono" style={{ color: mod.color }}>
                  {mod.name}
                </div>
              </button>

              {/* Pulse animation */}
              {activeModule?.id !== mod.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg border"
                  style={{ borderColor: mod.color }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-24 h-24 rounded-full border-2 border-cyan-400 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ boxShadow: '0 0 30px rgba(6,182,212,0.3)' }}
        >
          <span className="text-4xl">🐕</span>
        </motion.div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {activeModule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-sm rounded-lg border p-4"
            style={{ borderColor: activeModule.color }}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{activeModule.icon}</span>
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-1" style={{ color: activeModule.color }}>
                  {activeModule.name}
                </h4>
                <p className="text-slate-400 text-sm mb-3">{activeModule.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs text-slate-500 uppercase mb-1">Database Schema</h5>
                    <ul className="text-xs font-mono text-slate-300 space-y-1">
                      {activeModule.data.map((d, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span style={{ color: activeModule.color }}>▸</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs text-slate-500 uppercase mb-1">Requirements</h5>
                    <div className="flex flex-wrap gap-1">
                      {activeModule.requirements.map((req, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${activeModule.color}20`, color: activeModule.color }}
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
