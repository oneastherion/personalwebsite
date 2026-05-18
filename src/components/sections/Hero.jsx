import { motion } from 'framer-motion'
import GlowButton from '../ui/GlowButton'

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(13,11,8,0.8) 100%)',
        }}
      />

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gold/40" />
            <div className="w-2 h-2 rotate-45 border border-gold/60" />
            <div className="h-px w-16 bg-gold/40" />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-cinzel text-4xl sm:text-5xl md:text-7xl tracking-[0.15em] text-medieval-text mb-6"
        >
          JUAN GONZALEZ
          <br />
          <span className="text-gold">FLORES</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="font-grotesk text-base md:text-lg tracking-[0.1em] text-medieval-text/70 mb-4"
        >
          Biomedical Engineer. Builder. Strategist.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="font-inter text-sm md:text-base text-gold/70 max-w-lg mx-auto mb-12 leading-relaxed"
        >
          From the discipline of the oath to the frontier of space
          — building what medicine will become.
        </motion.p>

        <motion.div variants={fadeUp}>
          <GlowButton
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Enter the Journey &darr;
          </GlowButton>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-medieval-bg to-transparent pointer-events-none" />
    </section>
  )
}
