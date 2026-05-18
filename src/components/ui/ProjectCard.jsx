import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProjectCard({ title, description, tools, index, accentColor = '#4fc3f7' }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="group relative border border-white/5 p-6 md:p-8 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={() => setExpanded(!expanded)}
      whileHover={{ borderColor: `${accentColor}40` }}
      style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      {/* Scan line effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${accentColor}08 50%, transparent 100%)`,
          animation: 'scanLine 3s linear infinite',
        }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-grotesk font-semibold text-base md:text-lg tracking-wide">
            {title}
          </h3>
          <motion.span
            className="text-xs font-mono opacity-40"
            animate={{ rotate: expanded ? 45 : 0 }}
          >
            +
          </motion.span>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm opacity-70 font-inter leading-relaxed mb-4">
                {description}
              </p>
              <div className="flex flex-wrap gap-2">
                {tools.map(tool => (
                  <span
                    key={tool}
                    className="px-3 py-1 text-xs font-mono border"
                    style={{ borderColor: `${accentColor}30`, color: accentColor }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!expanded && (
          <p className="text-sm opacity-40 font-inter">
            Click to expand
          </p>
        )}
      </div>
    </motion.div>
  )
}
