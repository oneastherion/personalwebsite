import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'

const phases = [
  {
    phase: 'Phase I',
    title: 'Establish',
    items: [
      'Launch Astheríon\'s first product line.',
      'Validate biosensor garment technology in real-world use.',
    ],
  },
  {
    phase: 'Phase II',
    title: 'Scale',
    items: [
      'Build the data platform.',
      'Expand from wearables to clinical-grade remote monitoring.',
    ],
  },
  {
    phase: 'Phase III',
    title: 'Transform',
    items: [
      'Found a medical device company.',
      'Pursue FDA clearance for diagnostic-grade wearable systems.',
    ],
  },
  {
    phase: 'Phase IV',
    title: 'Expand',
    items: [
      'Space-rated biosensing.',
      'Human performance monitoring for extreme environments.',
      'Contribute to the infrastructure of off-world medicine.',
    ],
  },
]

export default function Future() {
  return (
    <section id="future" className="relative py-32 md:py-48 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionLabel numeral="V" title="The Next Frontier" accentColor="#7c4dff" />

        <motion.p
          className="font-inter text-sm md:text-base opacity-60 mb-20 max-w-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          What comes after the foundation is set.
        </motion.p>

        {/* Roadmap */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-space-accent/40 via-space-accent/20 to-transparent" />

          <div className="space-y-16">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                className="relative pl-12 md:pl-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                {/* Node */}
                <motion.div
                  className="absolute left-2.5 md:left-4 top-1 w-3 h-3 rounded-full border-2"
                  style={{
                    borderColor: '#7c4dff',
                    backgroundColor: i === 0 ? '#7c4dff' : 'transparent',
                  }}
                  whileInView={{
                    boxShadow: [
                      '0 0 0px rgba(124,77,255,0)',
                      '0 0 20px rgba(124,77,255,0.6)',
                      '0 0 0px rgba(124,77,255,0)',
                    ],
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />

                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-xs tracking-wider text-space-accent">
                    {phase.phase}
                  </span>
                  <span className="text-xs text-white/20">—</span>
                  <h3 className="font-grotesk font-semibold text-lg tracking-wide">
                    {phase.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  {phase.items.map((item, j) => (
                    <p key={j} className="font-inter text-sm opacity-60 leading-relaxed">
                      {item}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing quote */}
        <motion.div
          className="mt-24 md:mt-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="h-px w-20 bg-space-accent/30 mx-auto mb-8" />
          <p className="font-cinzel text-sm md:text-base tracking-wider text-space-accent/70 leading-relaxed">
            The goal was never a product.
          </p>
          <p className="font-cinzel text-sm md:text-base tracking-wider text-space-accent/70">
            The goal is a civilization that understands itself.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
