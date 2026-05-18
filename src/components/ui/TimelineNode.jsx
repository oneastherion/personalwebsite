import { motion } from 'framer-motion'

export default function TimelineNode({ title, subtitle, index, accentColor = '#c9a84c' }) {
  return (
    <motion.div
      className="flex gap-6 items-start"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}60` }}
          whileInView={{ scale: [0, 1.3, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
        />
        <div className="w-px h-16 bg-white/10" />
      </div>
      <div className="-mt-1">
        <h4 className="font-grotesk font-medium text-sm md:text-base mb-1">{title}</h4>
        <p className="text-sm opacity-60 font-inter">{subtitle}</p>
      </div>
    </motion.div>
  )
}
