import { motion } from 'framer-motion'

export default function SectionLabel({ numeral, title, accentColor = '#c9a84c' }) {
  return (
    <motion.div
      className="mb-12 md:mb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-4 mb-3">
        <div
          className="h-px w-12 md:w-20"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color: accentColor }}
        >
          {numeral}
        </span>
        <div
          className="h-px w-12 md:w-20"
          style={{ backgroundColor: accentColor }}
        />
      </div>
      <h2 className="font-cinzel text-2xl md:text-4xl tracking-wider uppercase">
        {title}
      </h2>
    </motion.div>
  )
}
