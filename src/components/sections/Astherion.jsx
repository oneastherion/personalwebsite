import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'

const capabilities = [
  { label: 'EDA', desc: 'Stress & emotional response' },
  { label: 'HR / HRV', desc: 'Cardiovascular state' },
  { label: 'Temperature', desc: 'Thermoregulation patterns' },
  { label: 'IMU', desc: 'Movement & posture dynamics' },
]

const architecture = [
  'Modular sensor pods',
  'Conductive textile integration',
  'Edge processing (ESP32 / nRF52)',
  'Cloud analytics pipeline',
  'Predictive stress & recovery models',
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
        <SectionLabel numeral="IV" title="Astheríon" accentColor="#7c4dff" />

        <motion.p
          className="font-cinzel text-xl md:text-3xl tracking-wider mb-4"
          style={{ color: '#7c4dff' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Intelligence, woven into form.
        </motion.p>

        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-inter text-sm md:text-base leading-relaxed opacity-70 mb-6">
            Astheríon is a luxury wearable health-technology brand — building
            modular biosensor garments that monitor the body's invisible signals.
          </p>
          <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
            The data flows into predictive models — turning raw physiology
            into actionable health intelligence. This is not a fitness tracker
            disguised as clothing. This is medical-grade sensing, built for daily life.
          </p>
        </motion.div>

        {/* Sensor capabilities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.label}
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
                {cap.label}
              </h4>
              <p className="text-xs font-inter opacity-50">{cap.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision + Architecture */}
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-space-accent mb-4">
              The Vision
            </h3>
            <p className="font-inter text-sm leading-relaxed opacity-70">
              Build a vertically integrated health-tech platform — from fiber
              to firmware to cloud — that redefines how humans understand
              their own biology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-space-accent mb-4">
              The Architecture
            </h3>
            <div className="space-y-2">
              {architecture.map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3 text-sm font-inter opacity-60"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 0.6, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className="w-4 h-px" style={{ backgroundColor: '#7c4dff' }} />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
