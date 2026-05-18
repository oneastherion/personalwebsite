import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { sections } from '../../utils/eraConfig'

const navSections = sections.filter(s => s.numeral)

export default function Navigation() {
  const progress = useScrollProgress()
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const accentColor =
    progress < 0.25 ? '#c9a84c' :
    progress < 0.5 ? '#b8860b' :
    progress < 0.7 ? '#4fc3f7' :
    '#7c4dff'

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-4">
      {navSections.map(({ id, numeral, label }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group flex items-center gap-3 transition-all duration-300"
          >
            <span
              className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
              style={{ color: accentColor }}
            >
              {numeral} {label}
            </span>
            <motion.div
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? 12 : 6,
                height: isActive ? 12 : 6,
                backgroundColor: isActive ? accentColor : 'rgba(255,255,255,0.2)',
                boxShadow: isActive ? `0 0 12px ${accentColor}40` : 'none',
              }}
              layout
            />
          </button>
        )
      })}
    </nav>
  )
}
