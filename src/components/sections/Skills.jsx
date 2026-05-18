import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'

const categories = [
  {
    title: 'Languages & Computation',
    skills: ['MATLAB (Advanced)', 'Python', 'SQL', 'JavaScript / React', 'R'],
  },
  {
    title: 'Engineering & Signal Processing',
    skills: ['Biosignal Processing', 'EDA/GSR Analysis', 'ECG/HR Pipelines', 'IMU Sensor Fusion', 'Spectral Analysis', 'Filtering & Artifact Removal'],
  },
  {
    title: 'Data & Infrastructure',
    skills: ['EPIC EHR Extraction', 'REDCap', 'Clinical Data Pipelines', 'Automated Reporting', 'Reproducible Research Workflows'],
  },
  {
    title: 'Medical & Clinical',
    skills: ['Cardiovascular Physiology', 'Anesthesiology Research', 'Perioperative Monitoring', 'Clinical Trial Data Management'],
  },
  {
    title: 'Hardware & Wearables',
    skills: ['ESP32 / nRF52 Microcontrollers', 'Biosensor Integration', 'PCB Design Fundamentals', 'Wearable Device Architecture'],
  },
  {
    title: 'Strategy & Leadership',
    skills: ['Product Vision', 'Technical Architecture', 'Research Design', 'Cross-functional Communication', 'Venture Building'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 md:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel numeral="II" title="The Arsenal" accentColor="#b8860b" />

        <motion.p
          className="font-inter text-sm md:text-base opacity-60 mb-16 max-w-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Tools, languages, and domains, forged through years of applied work.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              className="border border-white/5 p-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: catIdx * 0.08 }}
              whileHover={{ borderColor: 'rgba(184,134,11,0.3)' }}
              style={{ backgroundColor: 'rgba(255,255,255,0.01)' }}
            >
              {/* Blueprint corner markers */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold-dark/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold-dark/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold-dark/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold-dark/30" />

              <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-gold-dark mb-5">
                {cat.title}
              </h3>
              <div className="space-y-2">
                {cat.skills.map((skill, skillIdx) => (
                  <motion.div
                    key={skill}
                    className="flex items-center gap-2 text-sm font-inter opacity-70"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 0.7, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: catIdx * 0.08 + skillIdx * 0.05 }}
                  >
                    <span className="w-1 h-1 bg-gold-dark/50 rounded-full flex-shrink-0" />
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
