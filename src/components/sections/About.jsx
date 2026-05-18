import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import TimelineNode from '../ui/TimelineNode'

const timeline = [
  { title: 'UT Dallas', subtitle: 'Biomedical Engineering (B.S.) — 2024' },
  { title: 'UT Southwestern Medical Center', subtitle: 'Research — Cardiovascular & Thoracic Anesthesiology' },
  { title: 'Self-Taught', subtitle: 'PCB Design, Firmware, Sensor Fusion, CAD, Full-Stack Mobile' },
  { title: 'Astherion', subtitle: 'Founder — Building the AI that reads data Apple cannot collect' },
]

export default function About() {
  return (
    <section id="about" className="relative py-32 md:py-40 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionLabel numeral="I" title="The Chronicle" />
        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-inter text-sm md:text-base leading-relaxed opacity-80">
              I spent years watching the gap between what's possible in medical devices 
              and what's available to the people who actually need it.
            </p>
            
            <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
              At UT Southwestern, I built automated research pipelines for cardiovascular 
              and anesthesiology trials, clinical-grade data systems. I learned what 
              "medical-grade" actually means: reproducibility, validation, accountability. 
              I learned that physiological data is only valuable if you can extract signal from noise.
            </p>
            
            <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
              Then I realized: the wrist gave us heart rate. The finger gave us sleep. 
              No one is measuring the largest, most information-rich surface of the human body. 
              So I taught myself everything, PCB design, embedded systems, sensor fusion, 
              firmware, full-stack mobile, and built a prototype that proved it.
            </p>
            
            <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
              Four funded companies tried this problem and failed. I shipped a 14-sensor 
              prototype in 72 hours. Bootstrapped. Alone. Now I'm building the platform 
              that transforms that data into AI.
            </p>
            
            <p className="font-cinzel text-sm tracking-wider text-gold/80 pt-4">
              This is not a career. It is a campaign.
            </p>
          </motion.div>
          
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <TimelineNode
                key={item.title}
                title={item.title}
                subtitle={item.subtitle}
                index={i}
                accentColor="#c9a84c"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}