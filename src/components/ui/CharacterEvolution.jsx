import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'

/*
  4 evolution stages based on scroll progress:
  0.00–0.20  Knight     (medieval armor, sword, shield)
  0.20–0.45  Scholar    (robes, book, compass)
  0.45–0.70  Engineer   (lab coat, stethoscope, data tablet)
  0.70–1.00  Astronaut  (space suit, helmet visor, stars)
*/

function getStage(progress) {
  if (progress < 0.20) return 0 // Knight
  if (progress < 0.45) return 1 // Scholar
  if (progress < 0.70) return 2 // Engineer
  return 3 // Astronaut
}

const stages = [
  { label: 'KNIGHT', color: '#c9a84c', glow: 'rgba(201,168,76,0.15)' },
  { label: 'SCHOLAR', color: '#b8860b', glow: 'rgba(184,134,11,0.12)' },
  { label: 'ENGINEER', color: '#4fc3f7', glow: 'rgba(79,195,247,0.12)' },
  { label: 'ASTRONAUT', color: '#7c4dff', glow: 'rgba(124,77,255,0.15)' },
]

export default function CharacterEvolution() {
  const progress = useScrollProgress()
  const stage = getStage(progress)
  const { label, color, glow } = stages[stage]

  // Calculate transition progress within each stage for smooth morphing
  const stageRanges = [[0, 0.20], [0.20, 0.45], [0.45, 0.70], [0.70, 1.0]]
  const [sStart, sEnd] = stageRanges[stage]
  const stageProgress = sEnd > sStart ? (progress - sStart) / (sEnd - sStart) : 0

  return (
    <div className="fixed left-6 lg:left-12 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 pointer-events-none">
      {/* Character container */}
      <div className="relative w-16 h-64">
        {/* Aura glow behind character */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          animate={{ backgroundColor: glow }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ transform: 'scale(1.5)' }}
        />

        {/* The character SVG */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              {stage === 0 && <KnightSVG color={color} />}
              {stage === 1 && <ScholarSVG color={color} />}
              {stage === 2 && <EngineerSVG color={color} />}
              {stage === 3 && <AstronautSVG color={color} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Stage label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-px h-6" style={{ backgroundColor: `${color}40` }} />
          <span
            className="font-mono text-[9px] tracking-[0.3em] uppercase"
            style={{ color: `${color}80` }}
          >
            {label}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex flex-col gap-1.5 mt-2">
        {stages.map((s, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            animate={{
              backgroundColor: i <= stage ? color : 'rgba(255,255,255,0.1)',
              scale: i === stage ? 1.3 : 1,
              boxShadow: i === stage ? `0 0 8px ${color}60` : '0 0 0px transparent',
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  )
}

/* ====================================
   SVG CHARACTER ILLUSTRATIONS
   Stylized, minimal, tarot-card inspired
   ==================================== */

function KnightSVG({ color }) {
  return (
    <svg viewBox="0 0 64 256" className="w-full h-full" fill="none">
      {/* Helmet */}
      <motion.path
        d="M24 40 L32 24 L40 40 L40 56 L24 56 Z"
        stroke={color}
        strokeWidth="1.2"
        fill={`${color}10`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      {/* Helmet visor slit */}
      <line x1="28" y1="44" x2="36" y2="44" stroke={color} strokeWidth="1.5" />
      {/* Helmet plume */}
      <motion.path
        d="M32 24 Q38 12 32 4 Q26 12 32 24"
        stroke={color}
        strokeWidth="0.8"
        fill={`${color}15`}
        animate={{ d: ['M32 24 Q38 12 32 4 Q26 12 32 24', 'M32 24 Q40 14 34 4 Q24 14 32 24', 'M32 24 Q38 12 32 4 Q26 12 32 24'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Shoulders / pauldrons */}
      <path d="M16 60 L24 56 L40 56 L48 60 L48 72 L16 72 Z" stroke={color} strokeWidth="1" fill={`${color}08`} />
      {/* Cross emblem on chest */}
      <line x1="32" y1="68" x2="32" y2="84" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="26" y1="76" x2="38" y2="76" stroke={color} strokeWidth="1" opacity="0.6" />

      {/* Body armor */}
      <path d="M20 72 L20 130 L32 140 L44 130 L44 72" stroke={color} strokeWidth="1" fill={`${color}05`} />

      {/* Sword (right hand) */}
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 90px' }}
      >
        <line x1="50" y1="60" x2="50" y2="150" stroke={color} strokeWidth="1.5" />
        {/* Crossguard */}
        <line x1="44" y1="90" x2="56" y2="90" stroke={color} strokeWidth="2" />
        {/* Pommel */}
        <circle cx="50" cy="152" r="2" stroke={color} strokeWidth="1" fill={`${color}20`} />
      </motion.g>

      {/* Shield (left hand) */}
      <path d="M6 78 L6 110 L14 120 L22 110 L22 78 Z" stroke={color} strokeWidth="1" fill={`${color}08`} />
      {/* Shield emblem */}
      <path d="M14 88 L10 96 L14 104 L18 96 Z" stroke={color} strokeWidth="0.8" fill={`${color}15`} />

      {/* Legs */}
      <line x1="26" y1="140" x2="22" y2="200" stroke={color} strokeWidth="1.2" />
      <line x1="38" y1="140" x2="42" y2="200" stroke={color} strokeWidth="1.2" />
      {/* Boots */}
      <path d="M18 198 L22 200 L26 198" stroke={color} strokeWidth="1" />
      <path d="M38 198 L42 200 L46 198" stroke={color} strokeWidth="1" />

      {/* Ground flame embers */}
      {[0, 1, 2].map(i => (
        <motion.circle
          key={i}
          cx={24 + i * 8}
          cy={220}
          r={1}
          fill={color}
          opacity={0.4}
          animate={{
            cy: [220, 210, 200],
            opacity: [0.4, 0.7, 0],
            r: [1, 1.5, 0.5],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeOut',
          }}
        />
      ))}
    </svg>
  )
}

function ScholarSVG({ color }) {
  return (
    <svg viewBox="0 0 64 256" className="w-full h-full" fill="none">
      {/* Head with cap */}
      <circle cx="32" cy="38" r="12" stroke={color} strokeWidth="1" fill={`${color}08`} />
      {/* Scholar cap / beret */}
      <path d="M20 34 Q32 20 44 34" stroke={color} strokeWidth="1" fill={`${color}10`} />
      <circle cx="32" cy="24" r="2" fill={color} opacity="0.3" />

      {/* Face hint */}
      <circle cx="28" cy="36" r="0.8" fill={color} opacity="0.5" />
      <circle cx="36" cy="36" r="0.8" fill={color} opacity="0.5" />

      {/* Robe / cloak */}
      <path d="M18 50 L14 160 L32 170 L50 160 L46 50" stroke={color} strokeWidth="1" fill={`${color}05`} />
      {/* Robe collar */}
      <path d="M22 50 L32 58 L42 50" stroke={color} strokeWidth="0.8" />

      {/* Robe vertical fold lines */}
      <line x1="28" y1="70" x2="26" y2="160" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <line x1="36" y1="70" x2="38" y2="160" stroke={color} strokeWidth="0.4" opacity="0.3" />

      {/* Book (left hand) */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '12px 100px' }}
      >
        <rect x="2" y="88" width="18" height="24" rx="1" stroke={color} strokeWidth="1" fill={`${color}10`} />
        {/* Book spine */}
        <line x1="2" y1="88" x2="2" y2="112" stroke={color} strokeWidth="1.5" />
        {/* Book lines (text) */}
        <line x1="6" y1="94" x2="16" y2="94" stroke={color} strokeWidth="0.4" opacity="0.4" />
        <line x1="6" y1="98" x2="14" y2="98" stroke={color} strokeWidth="0.4" opacity="0.4" />
        <line x1="6" y1="102" x2="16" y2="102" stroke={color} strokeWidth="0.4" opacity="0.4" />
        <line x1="6" y1="106" x2="12" y2="106" stroke={color} strokeWidth="0.4" opacity="0.4" />
      </motion.g>

      {/* Compass (right hand) */}
      <motion.g
        animate={{ rotate: [0, 15, 0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '52px 95px' }}
      >
        <circle cx="52" cy="95" r="8" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <line x1="52" y1="87" x2="52" y2="103" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <line x1="44" y1="95" x2="60" y2="95" stroke={color} strokeWidth="0.5" opacity="0.4" />
        {/* Compass needle */}
        <motion.line
          x1="52" y1="95" x2="52" y2="88"
          stroke={color}
          strokeWidth="1"
          animate={{ rotate: [0, 30, -20, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '52px 95px' }}
        />
      </motion.g>

      {/* Legs */}
      <line x1="28" y1="170" x2="24" y2="210" stroke={color} strokeWidth="1" />
      <line x1="36" y1="170" x2="40" y2="210" stroke={color} strokeWidth="1" />

      {/* Floating ink particles */}
      {[0, 1, 2, 3].map(i => (
        <motion.circle
          key={i}
          cx={18 + i * 10}
          cy={220}
          r={0.8}
          fill={color}
          opacity={0.3}
          animate={{
            cy: [220, 215, 225, 220],
            cx: [18 + i * 10, 20 + i * 10, 16 + i * 10, 18 + i * 10],
            opacity: [0.3, 0.5, 0.2, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  )
}

function EngineerSVG({ color }) {
  return (
    <svg viewBox="0 0 64 256" className="w-full h-full" fill="none">
      {/* Head */}
      <circle cx="32" cy="36" r="11" stroke={color} strokeWidth="1" fill={`${color}08`} />
      {/* Hair / clean cut */}
      <path d="M21 32 Q32 22 43 32" stroke={color} strokeWidth="0.8" fill={`${color}06`} />

      {/* Glasses / eye protection */}
      <rect x="25" y="33" width="5" height="4" rx="1" stroke={color} strokeWidth="0.6" opacity="0.6" />
      <rect x="34" y="33" width="5" height="4" rx="1" stroke={color} strokeWidth="0.6" opacity="0.6" />
      <line x1="30" y1="35" x2="34" y2="35" stroke={color} strokeWidth="0.4" opacity="0.4" />

      {/* Lab coat */}
      <path d="M18 48 L16 155 L30 158 L32 155 L34 158 L48 155 L46 48" stroke={color} strokeWidth="1" fill={`${color}05`} />
      {/* Coat lapels */}
      <path d="M24 48 L32 64 L40 48" stroke={color} strokeWidth="0.8" fill={`${color}08`} />
      {/* Coat buttons */}
      <circle cx="32" cy="75" r="1" fill={color} opacity="0.4" />
      <circle cx="32" cy="90" r="1" fill={color} opacity="0.4" />
      <circle cx="32" cy="105" r="1" fill={color} opacity="0.4" />
      {/* Pocket */}
      <rect x="22" y="85" width="6" height="8" stroke={color} strokeWidth="0.5" opacity="0.3" />

      {/* Stethoscope around neck */}
      <motion.path
        d="M26 48 Q20 60 22 75 Q24 85 28 80"
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <circle cx="22" cy="76" r="3" stroke={color} strokeWidth="1" fill={`${color}15`} />

      {/* Tablet / data device (right hand) */}
      <motion.g
        animate={{ y: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="44" y="82" width="14" height="20" rx="1.5" stroke={color} strokeWidth="1" fill={`${color}10`} />
        {/* Screen content - data lines */}
        <line x1="47" y1="87" x2="55" y2="87" stroke={color} strokeWidth="0.4" opacity="0.5" />
        <line x1="47" y1="90" x2="53" y2="90" stroke={color} strokeWidth="0.4" opacity="0.4" />
        <line x1="47" y1="93" x2="55" y2="93" stroke={color} strokeWidth="0.4" opacity="0.5" />
        {/* Heartbeat line on screen */}
        <motion.polyline
          points="47,96 49,96 50,92 51,99 52,96 55,96"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>

      {/* Legs */}
      <line x1="28" y1="158" x2="26" y2="205" stroke={color} strokeWidth="1" />
      <line x1="36" y1="158" x2="38" y2="205" stroke={color} strokeWidth="1" />

      {/* Floating data nodes */}
      {[0, 1, 2].map(i => (
        <motion.g key={i}>
          <motion.rect
            x={10 + i * 18}
            y={218}
            width={3}
            height={3}
            stroke={color}
            strokeWidth="0.5"
            fill="none"
            opacity={0.3}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            style={{ transformOrigin: `${11.5 + i * 18}px 219.5px` }}
          />
        </motion.g>
      ))}
    </svg>
  )
}

function AstronautSVG({ color }) {
  return (
    <svg viewBox="0 0 64 256" className="w-full h-full" fill="none">
      {/* Helmet - large dome */}
      <motion.ellipse
        cx="32" cy="36" rx="16" ry="18"
        stroke={color}
        strokeWidth="1.2"
        fill={`${color}06`}
        animate={{
          fill: [`${color}06`, `${color}12`, `${color}06`],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      {/* Visor */}
      <motion.ellipse
        cx="32" cy="38" rx="11" ry="10"
        stroke={color}
        strokeWidth="0.8"
        fill={`${color}15`}
        animate={{
          fill: [`${color}15`, `${color}25`, `${color}15`],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Visor reflection */}
      <path d="M26 32 Q30 28 36 32" stroke={color} strokeWidth="0.5" opacity="0.4" fill="none" />

      {/* Suit neck ring */}
      <ellipse cx="32" cy="54" rx="14" ry="3" stroke={color} strokeWidth="1" fill={`${color}08`} />

      {/* Space suit body */}
      <path d="M18 56 L16 145 L32 150 L48 145 L46 56" stroke={color} strokeWidth="1" fill={`${color}05`} />
      {/* Suit chest panel */}
      <rect x="25" y="65" width="14" height="20" rx="2" stroke={color} strokeWidth="0.8" fill={`${color}08`} />
      {/* HUD indicators on chest */}
      <motion.circle cx="29" cy="72" r="1.5" fill={color} opacity={0.6}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.circle cx="35" cy="72" r="1.5" stroke={color} strokeWidth="0.5" fill="none" opacity={0.4}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <line x1="28" y1="78" x2="36" y2="78" stroke={color} strokeWidth="0.4" opacity="0.4" />
      <line x1="28" y1="81" x2="34" y2="81" stroke={color} strokeWidth="0.4" opacity="0.3" />

      {/* Arm packs */}
      <rect x="8" y="70" width="8" height="14" rx="2" stroke={color} strokeWidth="0.8" fill={`${color}06`} />
      <rect x="48" y="70" width="8" height="14" rx="2" stroke={color} strokeWidth="0.8" fill={`${color}06`} />

      {/* Life support backpack hint */}
      <rect x="24" y="90" width="16" height="30" rx="2" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="32" y1="95" x2="32" y2="115" stroke={color} strokeWidth="0.3" opacity="0.2" />

      {/* Suit belt */}
      <line x1="18" y1="120" x2="46" y2="120" stroke={color} strokeWidth="1" opacity="0.5" />
      <rect x="29" y="117" width="6" height="6" rx="1" stroke={color} strokeWidth="0.6" fill={`${color}10`} />

      {/* Legs */}
      <path d="M24 150 L22 200 L18 205 L28 205 L26 150" stroke={color} strokeWidth="0.8" fill={`${color}04`} />
      <path d="M38 150 L36 200 L44 205 L46 205 L42 150" stroke={color} strokeWidth="0.8" fill={`${color}04`} />

      {/* Floating stars */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.circle
          key={i}
          cx={8 + i * 12}
          cy={220 + (i % 2) * 8}
          r={0.8}
          fill={color}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  )
}
