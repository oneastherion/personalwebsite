import { motion } from 'framer-motion'

/*
  Era-themed dividers placed between sections.
  Each is a small SVG icon flanked by horizontal lines.
*/

export function SwordDivider({ color = '#c9a84c' }) {
  return (
    <DividerWrapper color={color}>
      <svg viewBox="0 0 24 48" className="w-4 h-8" fill="none">
        <line x1="12" y1="2" x2="12" y2="38" stroke={color} strokeWidth="1.2" />
        <line x1="6" y1="12" x2="18" y2="12" stroke={color} strokeWidth="1.5" />
        <circle cx="12" cy="40" r="2" stroke={color} strokeWidth="1" />
      </svg>
    </DividerWrapper>
  )
}

export function QuillDivider({ color = '#b8860b' }) {
  return (
    <DividerWrapper color={color}>
      <svg viewBox="0 0 24 48" className="w-4 h-8" fill="none">
        <path d="M12 4 Q18 16 14 32 L12 44 L10 32 Q6 16 12 4" stroke={color} strokeWidth="0.8" fill={`${color}10`} />
        <line x1="12" y1="32" x2="12" y2="46" stroke={color} strokeWidth="1" />
        <circle cx="12" cy="47" r="0.8" fill={color} opacity="0.6" />
      </svg>
    </DividerWrapper>
  )
}

export function PulseDivider({ color = '#4fc3f7' }) {
  return (
    <DividerWrapper color={color}>
      <svg viewBox="0 0 48 24" className="w-12 h-4" fill="none">
        <motion.polyline
          points="2,12 10,12 14,4 18,20 22,8 26,16 30,12 46,12"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </svg>
    </DividerWrapper>
  )
}

export function CircuitDivider({ color = '#4fc3f7' }) {
  return (
    <DividerWrapper color={color}>
      <svg viewBox="0 0 48 24" className="w-12 h-4" fill="none">
        <line x1="2" y1="12" x2="16" y2="12" stroke={color} strokeWidth="0.8" opacity="0.5" />
        <rect x="18" y="8" width="8" height="8" stroke={color} strokeWidth="1" fill={`${color}10`} />
        <motion.circle cx="22" cy="12" r="2" fill={color} opacity="0.5"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <line x1="28" y1="12" x2="46" y2="12" stroke={color} strokeWidth="0.8" opacity="0.5" />
      </svg>
    </DividerWrapper>
  )
}

export function RocketDivider({ color = '#7c4dff' }) {
  return (
    <DividerWrapper color={color}>
      <svg viewBox="0 0 24 48" className="w-4 h-8" fill="none">
        <path d="M12 4 L8 20 L12 18 L16 20 Z" stroke={color} strokeWidth="0.8" fill={`${color}15`} />
        <line x1="8" y1="20" x2="6" y2="28" stroke={color} strokeWidth="0.6" />
        <line x1="16" y1="20" x2="18" y2="28" stroke={color} strokeWidth="0.6" />
        {/* Exhaust */}
        <motion.path
          d="M10 20 Q12 32 12 40 Q12 32 14 20"
          stroke={color}
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>
    </DividerWrapper>
  )
}

function DividerWrapper({ children, color }) {
  return (
    <motion.div
      className="flex items-center justify-center gap-4 py-4"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-px w-16 md:w-24" style={{ background: `linear-gradient(to right, transparent, ${color}40)` }} />
      {children}
      <div className="h-px w-16 md:w-24" style={{ background: `linear-gradient(to left, transparent, ${color}40)` }} />
    </motion.div>
  )
}
