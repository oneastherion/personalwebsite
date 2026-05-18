import { motion } from 'framer-motion'

export default function GlowButton({ children, onClick, color = '#c9a84c', className = '' }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-8 py-3 font-mono text-sm tracking-[0.2em] uppercase border transition-all duration-500 ${className}`}
      style={{
        borderColor: `${color}60`,
        color: color,
      }}
      whileHover={{
        boxShadow: `0 0 30px ${color}30, inset 0 0 30px ${color}10`,
        borderColor: color,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}
