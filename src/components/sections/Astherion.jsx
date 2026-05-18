import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'

const moats = [
  { label: 'Thermal Matrix', desc: 'Metabolic state & cardiovascular stress' },
  { label: 'Spinal Dynamics', desc: 'Load, compensation, injury prediction' },
  { label: 'Edge AI', desc: 'Real-time inference on Apollo510B' },
  { label: 'Dataset', desc: 'The torso data Apple cannot build' },
]

const trajectory = [
  '2026–27: Performance Coach ($45B)',
  '2027–28: Predictive Prevention ($200B)',
  '2029–30: Pre-symptomatic Health ($500B)',
  '2031+: Personalized Medicine ($1T+)',
]

export default function Astherion() {
  return (
    <section id="astherion" className="relative py-32 md:py-48 px-6">
      {/* Gradient transition overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(124,77,255,0.03) 50%, rgba(124,77,255,0.06) 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionLabel numeral="IV" title="Astherion" accentColor="#7c4dff" />

        <motion.p
          className="font-cinzel text-xl md:text-3xl tracking-wider mb-4"
          style={{ color: '#7c4dff' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          The body is the next data platform.
        </motion.p>

        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-inter text-sm md:text-base leading-relaxed opacity-70 mb-6">
            Astherion is building the AI that learns it.
          </p>
          <p className="font-inter text-sm md:text-base leading-relaxed opacity-70 mb-6">
            The wrist gave us heart rate ($3.6B WHOOP). The finger gave us sleep ($11B Oura). 
            The torso gives us everything else — and no one is building it.
          </p>
          <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
            Ascendra One is a sensor-integrated performance base layer that captures thermal matrix gradient 
            and spinal dynamics — physiological data anatomically inaccessible to wrist devices. 
            The hardware is the data acquisition layer. The AI is the product. The dataset is the company.
          </p>
        </motion.div>

        {/* The moat */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {moats.map((moat, i) => (
            <motion.div
              key={moat.label}
              className="border border-white/5 p-5 text-center relative overflow-hidden"
              style={{ backgroundColor: 'rgba(124,77,255,0.03)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ borderColor: 'rgba(124,77,255,0.4)', backgroundColor: 'rgba(124,77,255,0.06)' }}
            >
              {/* Pulse dot */}
              <motion.div
                className="w-2 h-2 rounded-full mx-auto mb-3"
                style={{ backgroundColor: '#7c4dff' }}
                animate={{
                  boxShadow: [
                    '0 0 4px rgba(124,77,255,0.4)',
                    '0 0 16px rgba(124,77,255,0.8)',
                    '0 0 4px rgba(124,77,255,0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <h4 className="font-mono text-xs tracking-wider text-space-accent mb-1">
                {moat.label}
              </h4>
              <p className="text-xs font-inter opacity-50">{moat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision + Trajectory */}
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-space-accent mb-4">
              The Bet
            </h3>
            <p className="font-inter text-sm leading-relaxed opacity-70">
              Build the AI platform that owns distributed torso physiology — 
              starting with performance coaching, scaling to injury prediction, 
              and ultimately powering personalized medicine. Performance is the wedge. 
              Medicine is the prize.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-space-accent mb-4">
              The Trajectory
            </h3>
            <div className="space-y-2">
              {trajectory.map((phase, i) => (
                <motion.div
                  key={phase}
                  className="flex items-center gap-3 text-sm font-inter opacity-60"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 0.6, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className="w-4 h-px" style={{ backgroundColor: '#7c4dff' }} />
                  {phase}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}