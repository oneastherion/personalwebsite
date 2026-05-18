import { useEffect } from 'react'
import { useEraTransition } from './hooks/useEraTransition'
import SmoothScroll from './components/layout/SmoothScroll'
import Navigation from './components/layout/Navigation'
import ParticleSystem from './components/three/ParticleSystem'
import PixelCharacter from './components/ui/PixelCharacter'
import MouseParticles from './components/ui/MouseParticles'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Astherion from './components/sections/Astherion'
import Future from './components/sections/Future'
import Contact from './components/sections/Contact'
import { SwordDivider, QuillDivider, PulseDivider, CircuitDivider, RocketDivider } from './components/ui/EraDivider'

export default function App() {
  const { bg, text } = useEraTransition()

  // Dynamically update body background and text color based on scroll era
  useEffect(() => {
    document.body.style.backgroundColor = bg
    document.body.style.color = text
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'
  }, [bg, text])

  return (
    <SmoothScroll>
      <ParticleSystem />
      <Navigation />
      <PixelCharacter />
      <MouseParticles />

      <main className="relative z-10">
        <Hero />
        <SwordDivider />
        <About />
        <QuillDivider />
        <Skills />
        <PulseDivider />
        <Projects />
        <CircuitDivider color="#4fc3f7" />
        <Astherion />
        <RocketDivider />
        <Future />
        <RocketDivider color="#7c4dff" />
        <Contact />
      </main>
    </SmoothScroll>
  )
}
