import { motion } from 'framer-motion'
import SectionLabel from '../ui/SectionLabel'
import TimelineNode from '../ui/TimelineNode'

const timeline = [
  { title: 'UT Dallas', subtitle: 'Biomedical Engineering (B.S.)' },
  { title: 'UT Southwestern Medical Center', subtitle: 'Research Technician — Cardiovascular & Thoracic Anesthesiology' },
  { title: 'Astherion', subtitle: 'Founder — Wearable Health-Tech' },
  { title: 'Next', subtitle: 'Medical Device Company & Beyond' },
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
              Every builder begins with a foundation — mine was forged in discipline,
              sharpened in science, and tempered in the operating room.
            </p>
            <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
              I studied Biomedical Engineering at UT Dallas, where I learned to think
              in systems — biological, electrical, computational. I carried that
              thinking into UT Southwestern Medical Center, where I worked in the
              Research Department in Cardiovascular and Thoracic Anesthesiology. Currently I am
              focused on my new venture Astherion, at the intersection of the next generation of 
              wellness monitoring and AI digital twins
            </p>
            <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
              My work sits at the intersection of healthcare/wellness and engineering:
              extracting meaning from physiological data, building automated pipelines,
              and creating tools that make research reproducible and scalable.
            </p>
            <p className="font-cinzel text-sm tracking-wider text-gold/80 pt-4">
              This is not a career path. It is a campaign.
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
