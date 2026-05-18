import SectionLabel from '../ui/SectionLabel'
import ProjectCard from '../ui/ProjectCard'
import { motion } from 'framer-motion'

const projects = [
  {
    title: 'EPIC Data Extraction Pipeline',
    description:
      'Built an automated MATLAB pipeline for extracting, cleaning, and structuring patient data from EPIC EHR systems. Reduced manual processing time and improved reproducibility across research studies.',
    tools: ['MATLAB', 'SQL', 'EPIC API'],
  },
  {
    title: 'Cardiovascular Research Tools',
    description:
      'Developed signal processing tools for intraoperative physiological monitoring — enabling real-time analysis of hemodynamic data during cardiac surgery cases.',
    tools: ['MATLAB', 'Biosignal Processing', 'Statistical Analysis'],
  },
  {
    title: 'Automated Research Reporting',
    description:
      'Created reproducible reporting workflows that generate standardized outputs from raw clinical data — reducing analyst error and accelerating publication timelines.',
    tools: ['MATLAB', 'Data Visualization', 'Pipeline Automation'],
  },
]

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 md:py-40 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionLabel numeral="III" title="The Campaigns" accentColor="#4fc3f7" />

        <motion.p
          className="font-inter text-sm md:text-base opacity-60 mb-16 max-w-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Selected works — where theory met execution.
        </motion.p>

        <div className="space-y-4">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              tools={project.tools}
              index={i}
              accentColor="#4fc3f7"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
