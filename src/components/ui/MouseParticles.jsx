import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'

/*
  Ambient parallax background objects that shift when the mouse moves.
  Each section has themed objects spread across the viewport.
  Mouse movement causes subtle depth-based displacement.

  Section map:
    0  Hero        (0.00–0.15)  — Fire / flames / embers
    1  Chronicle   (0.15–0.30)  — Flying papers / code
    2  Arsenal     (0.30–0.50)  — Circuits / gears / tech
    3  Astherion   (0.50–0.70)  — Wearable / sensors / health
    4  Future      (0.70–1.00)  — GARGANTUA BLACK HOLE + gravitational suction
*/

function getSection(progress) {
  if (progress < 0.15) return 0
  if (progress < 0.30) return 1
  if (progress < 0.50) return 2
  if (progress < 0.70) return 3
  return 4
}

/* ─── Parallax wrapper ─── each object shifts based on mouse & depth */
function Parallax({ mouseX, mouseY, depth = 1, top, left, right, bottom, className = '', children }) {
  const px = useTransform(mouseX, [0, 1], [depth * -30, depth * 30])
  const py = useTransform(mouseY, [0, 1], [depth * -22, depth * 22])

  const posStyle = {}
  if (top !== undefined) posStyle.top = top
  if (left !== undefined) posStyle.left = left
  if (right !== undefined) posStyle.right = right
  if (bottom !== undefined) posStyle.bottom = bottom

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ ...posStyle, x: px, y: py }}
    >
      {children}
    </motion.div>
  )
}

export default function MouseParticles() {
  const progress = useScrollProgress()
  const section = getSection(progress)

  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)
  const mouseX = useSpring(rawX, { stiffness: 40, damping: 18 })
  const mouseY = useSpring(rawY, { stiffness: 40, damping: 18 })

  useEffect(() => {
    const handler = (e) => {
      rawX.set(e.clientX / window.innerWidth)
      rawY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [rawX, rawY])

  const sections = [FireSection, PaperSection, TechSection, WearableSection, SpaceSection]
  const Section = sections[section]

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden hidden lg:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Section mouseX={mouseX} mouseY={mouseY} progress={progress} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION I — FIRE / FLAMES / EMBERS
   Warm ambient glow patches + floating pixel embers
   ═══════════════════════════════════════════════════════ */

function FireSection({ mouseX, mouseY }) {
  return (
    <>
      {/* Large warm glow — top right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.4} top="5%" right="8%">
        <div style={{
          width: '18vw', height: '18vw', borderRadius: '50%',
          background: 'radial-gradient(circle, #ff880040 0%, #ff660020 40%, transparent 70%)',
          filter: 'blur(30px)',
        }} />
      </Parallax>

      {/* Flame cluster — right side */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.5} top="25%" right="12%">
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="40" height="56" viewBox="0 0 10 14" style={{ imageRendering: 'pixelated' }}>
            <rect x="4" y="0" width="2" height="1" fill="#ffcc0080" />
            <rect x="3" y="1" width="4" height="1" fill="#ffaa00a0" />
            <rect x="3" y="2" width="4" height="2" fill="#ff8800b0" />
            <rect x="2" y="4" width="6" height="2" fill="#ff6600b0" />
            <rect x="2" y="6" width="6" height="2" fill="#ff4400a0" />
            <rect x="3" y="8" width="4" height="2" fill="#cc330078" />
            <rect x="4" y="10" width="2" height="2" fill="#aa220058" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Ember 1 — bottom left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.0} bottom="20%" left="15%">
        <motion.div
          animate={{ y: [0, -30, -50], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <svg width="12" height="12" viewBox="0 0 3 3" style={{ imageRendering: 'pixelated' }}>
            <rect x="1" y="0" width="1" height="1" fill="#ff8800c0" />
            <rect x="0" y="1" width="3" height="1" fill="#ff6600b0" />
            <rect x="1" y="2" width="1" height="1" fill="#ff4400a0" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Ember 2 — top left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.8} top="15%" left="25%">
        <motion.div
          animate={{ y: [0, -25, -45], opacity: [0.7, 0.3, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
        >
          <svg width="8" height="8" viewBox="0 0 2 2" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="0" width="2" height="2" fill="#ffaa00b0" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Small flame — center left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.2} top="55%" left="8%">
        <motion.div
          animate={{ y: [0, -8, 0], opacity: [0.5, 0.9, 0.5], rotate: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <svg width="20" height="28" viewBox="0 0 5 7" style={{ imageRendering: 'pixelated' }}>
            <rect x="2" y="0" width="1" height="1" fill="#ffcc0068" />
            <rect x="1" y="1" width="3" height="1" fill="#ff880090" />
            <rect x="0" y="2" width="5" height="2" fill="#ff660080" />
            <rect x="1" y="4" width="3" height="1" fill="#ff440068" />
            <rect x="2" y="5" width="1" height="1" fill="#cc330058" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Warm glow — bottom */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.3} bottom="5%" left="30%">
        <div style={{
          width: '25vw', height: '12vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse, #ff660020 0%, transparent 70%)',
          filter: 'blur(20px)',
        }} />
      </Parallax>

      {/* Rising spark cluster — right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.2} top="40%" right="25%">
        <motion.div
          animate={{ y: [10, -20, -40], opacity: [0, 0.9, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffcc00b0', boxShadow: '0 0 8px #ff880080' }} />
        </motion.div>
      </Parallax>

      {/* Ember 3 — center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.6} top="35%" left="55%">
        <motion.div
          animate={{ y: [0, -35, -60], opacity: [0.6, 0.2, 0], x: [0, 5, 10] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ff8840a0' }} />
        </motion.div>
      </Parallax>

      {/* Extra flame — bottom right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.3} bottom="30%" right="18%">
        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          <svg width="28" height="40" viewBox="0 0 7 10" style={{ imageRendering: 'pixelated' }}>
            <rect x="3" y="0" width="1" height="1" fill="#ffcc0070" />
            <rect x="2" y="1" width="3" height="1" fill="#ff880090" />
            <rect x="1" y="2" width="5" height="2" fill="#ff660088" />
            <rect x="2" y="4" width="3" height="2" fill="#ff440078" />
            <rect x="3" y="6" width="1" height="1" fill="#cc330060" />
          </svg>
        </motion.div>
      </Parallax>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION II — PAPERS / CODE / BRACKETS
   Floating code snippets + paper scraps in scholar gold
   ═══════════════════════════════════════════════════════ */

function PaperSection({ mouseX, mouseY }) {
  return (
    <>
      {/* Large paper scrap — right side */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.4} top="18%" right="10%">
        <motion.div
          animate={{ rotate: [-5, 8, -5], y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="48" height="56" viewBox="0 0 12 14" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="0" width="12" height="14" fill="#d4c5a020" />
            <rect x="0" y="0" width="12" height="1" fill="#d4c5a038" />
            <rect x="0" y="0" width="1" height="14" fill="#d4c5a030" />
            <rect x="11" y="0" width="1" height="14" fill="#d4c5a018" />
            <rect x="2" y="3" width="8" height="1" fill="#b8860b28" />
            <rect x="2" y="5" width="6" height="1" fill="#b8860b22" />
            <rect x="2" y="7" width="7" height="1" fill="#b8860b28" />
            <rect x="2" y="9" width="5" height="1" fill="#b8860b18" />
            <rect x="2" y="11" width="8" height="1" fill="#b8860b22" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Code bracket — top left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.8} top="12%" left="18%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '24px', color: '#e8772250' }}
          animate={{ rotate: [-3, 3, -3], y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {'{ }'}
        </motion.span>
      </Parallax>

      {/* HTML tag — bottom right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.2} bottom="25%" right="20%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '18px', color: '#e8772245' }}
          animate={{ opacity: [0.4, 0.8, 0.4], rotate: [2, -2, 2] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          {'</>'}
        </motion.span>
      </Parallax>

      {/* Binary — center right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.0} top="45%" right="15%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '12px', color: '#d4c5a035', letterSpacing: '2px' }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          01101001
        </motion.span>
      </Parallax>

      {/* Paper scrap 2 — left side */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.0} top="60%" left="10%">
        <motion.div
          animate={{ rotate: [3, -6, 3], y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <svg width="32" height="40" viewBox="0 0 8 10" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="0" width="8" height="10" fill="#d4c5a018" />
            <rect x="1" y="2" width="6" height="1" fill="#b8860b22" />
            <rect x="1" y="4" width="4" height="1" fill="#b8860b18" />
            <rect x="1" y="6" width="5" height="1" fill="#b8860b22" />
          </svg>
        </motion.div>
      </Parallax>

      {/* fn() — bottom left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.6} bottom="15%" left="30%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '14px', color: '#e8772238' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          fn()
        </motion.span>
      </Parallax>

      {/* Quill pixel — top right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.3} top="30%" right="30%">
        <motion.div
          animate={{ rotate: [-8, 8, -8], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <svg width="16" height="32" viewBox="0 0 4 8" style={{ imageRendering: 'pixelated' }}>
            <rect x="3" y="0" width="1" height="1" fill="#e8772260" />
            <rect x="2" y="1" width="2" height="1" fill="#e8772250" />
            <rect x="1" y="2" width="2" height="1" fill="#b8860b45" />
            <rect x="1" y="3" width="1" height="3" fill="#b8860b38" />
            <rect x="0" y="6" width="1" height="2" fill="#3a251030" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Semicolon — center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.2} top="38%" left="60%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '20px', color: '#b8860b35' }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ;
        </motion.span>
      </Parallax>

      {/* Extra: import statement — bottom right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.5} bottom="35%" right="8%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '11px', color: '#e8772230' }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          import &#123;&#125;
        </motion.span>
      </Parallax>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION III — CIRCUITS / GEARS / TECH
   Blueprint-style background with gold tech objects
   ═══════════════════════════════════════════════════════ */

function TechSection({ mouseX, mouseY }) {
  return (
    <>
      {/* Large gear — right side */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.0} top="15%" right="8%">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="80" height="80" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            <rect x="6" y="0" width="4" height="2" fill="#c9a84c22" />
            <rect x="0" y="6" width="2" height="4" fill="#c9a84c22" />
            <rect x="14" y="6" width="2" height="4" fill="#c9a84c22" />
            <rect x="6" y="14" width="4" height="2" fill="#c9a84c22" />
            <rect x="3" y="3" width="10" height="10" fill="#c9a84c12" rx="5" />
            <rect x="5" y="5" width="6" height="6" fill="#c9a84c1a" rx="3" />
            <rect x="7" y="7" width="2" height="2" fill="#c9a84c38" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Circuit node — top left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.6} top="20%" left="12%">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 6 6" style={{ imageRendering: 'pixelated' }}>
            <rect x="2" y="0" width="2" height="6" fill="#c9a84c28" />
            <rect x="0" y="2" width="6" height="2" fill="#c9a84c28" />
            <rect x="2" y="2" width="2" height="2" fill="#c9a84c50" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Small gear — bottom left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.8} bottom="20%" left="20%">
        <motion.div
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="40" height="40" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
            <rect x="3" y="0" width="2" height="1" fill="#c9a84c28" />
            <rect x="0" y="3" width="1" height="2" fill="#c9a84c28" />
            <rect x="7" y="3" width="1" height="2" fill="#c9a84c28" />
            <rect x="3" y="7" width="2" height="1" fill="#c9a84c28" />
            <rect x="2" y="2" width="4" height="4" fill="#c9a84c1a" />
            <rect x="3" y="3" width="2" height="2" fill="#c9a84c38" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Lightning bolt — center right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.4} top="50%" right="22%">
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="48" viewBox="0 0 6 12" style={{ imageRendering: 'pixelated' }}>
            <rect x="3" y="0" width="3" height="2" fill="#c9a84c45" />
            <rect x="2" y="2" width="3" height="2" fill="#c9a84c50" />
            <rect x="1" y="4" width="5" height="1" fill="#c9a84c60" />
            <rect x="3" y="5" width="2" height="2" fill="#c9a84c45" />
            <rect x="2" y="7" width="2" height="2" fill="#c9a84c38" />
            <rect x="1" y="9" width="2" height="2" fill="#c9a84c28" />
          </svg>
        </motion.div>
      </Parallax>

      {/* ++ operator — top center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.0} top="10%" left="50%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '20px', color: '#c9a84c35' }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ++
        </motion.span>
      </Parallax>

      {/* Data arrow — bottom right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.2} bottom="30%" right="15%">
        <motion.div
          animate={{ x: [-10, 15, -10], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <svg width="48" height="12" viewBox="0 0 12 3" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="1" width="9" height="1" fill="#c9a84c30" />
            <rect x="9" y="0" width="1" height="3" fill="#c9a84c38" />
            <rect x="10" y="1" width="2" height="1" fill="#c9a84c48" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Grid overlay hint — background */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.3} top="0" left="0">
        <div style={{
          width: '100vw', height: '100vh',
          backgroundImage: 'linear-gradient(#c9a84c08 1px, transparent 1px), linear-gradient(90deg, #c9a84c08 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </Parallax>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION IV — WEARABLE / HEALTH-TECH
   Clinical blue — heartbeats, sensors, DNA, signals
   ═══════════════════════════════════════════════════════ */

function WearableSection({ mouseX, mouseY }) {
  return (
    <>
      {/* Large heartbeat waveform — spanning center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.6} top="30%" left="5%">
        <motion.div
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="400" height="40" viewBox="0 0 100 10" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="5" width="25" height="1" fill="#4fc3f735" />
            <rect x="25" y="4" width="2" height="1" fill="#4fc3f748" />
            <rect x="27" y="3" width="2" height="1" fill="#4fc3f760" />
            <rect x="29" y="1" width="2" height="1" fill="#4fc3f780" />
            <rect x="31" y="3" width="2" height="1" fill="#4fc3f760" />
            <rect x="33" y="6" width="2" height="1" fill="#4fc3f760" />
            <rect x="35" y="8" width="2" height="1" fill="#4fc3f780" />
            <rect x="37" y="6" width="2" height="1" fill="#4fc3f760" />
            <rect x="39" y="5" width="30" height="1" fill="#4fc3f735" />
            <rect x="69" y="4" width="2" height="1" fill="#4fc3f748" />
            <rect x="71" y="2" width="2" height="1" fill="#4fc3f770" />
            <rect x="73" y="0" width="2" height="1" fill="#4fc3f780" />
            <rect x="75" y="3" width="2" height="1" fill="#4fc3f760" />
            <rect x="77" y="7" width="2" height="1" fill="#4fc3f770" />
            <rect x="79" y="5" width="21" height="1" fill="#4fc3f735" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Sensor pulse — top right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.4} top="15%" right="15%">
        <motion.div
          animate={{ scale: [0.5, 2.5, 0.5], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #4fc3f740' }} />
        </motion.div>
      </Parallax>

      {/* DNA strand — right side */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.6} top="20%" right="8%">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="24" height="80" viewBox="0 0 3 10" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="0" width="1" height="1" fill="#4fc3f745" />
            <rect x="2" y="1" width="1" height="1" fill="#4fc3f745" />
            <rect x="0" y="2" width="3" height="1" fill="#4fc3f728" />
            <rect x="2" y="3" width="1" height="1" fill="#4fc3f745" />
            <rect x="0" y="4" width="1" height="1" fill="#4fc3f745" />
            <rect x="0" y="5" width="3" height="1" fill="#4fc3f728" />
            <rect x="0" y="6" width="1" height="1" fill="#4fc3f745" />
            <rect x="2" y="7" width="1" height="1" fill="#4fc3f745" />
            <rect x="0" y="8" width="3" height="1" fill="#4fc3f728" />
            <rect x="2" y="9" width="1" height="1" fill="#4fc3f745" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Heart ♥ — bottom left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.2} bottom="20%" left="15%">
        <motion.span
          className="select-none"
          style={{ fontSize: '28px', color: '#4fc3f738' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          ♥
        </motion.span>
      </Parallax>

      {/* Signal wave — bottom */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.8} bottom="35%" left="35%">
        <motion.div
          animate={{ x: [-8, 8, -8], opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <svg width="60" height="16" viewBox="0 0 15 4" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="2" width="2" height="1" fill="#4fc3f738" />
            <rect x="2" y="1" width="2" height="1" fill="#4fc3f750" />
            <rect x="4" y="2" width="2" height="1" fill="#4fc3f738" />
            <rect x="6" y="3" width="2" height="1" fill="#4fc3f750" />
            <rect x="8" y="2" width="2" height="1" fill="#4fc3f738" />
            <rect x="10" y="1" width="2" height="1" fill="#4fc3f750" />
            <rect x="12" y="0" width="2" height="1" fill="#4fc3f760" />
            <rect x="14" y="1" width="1" height="1" fill="#4fc3f740" />
          </svg>
        </motion.div>
      </Parallax>

      {/* BPM readout — top left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.0} top="12%" left="20%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '14px', color: '#4fc3f740' }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          72 bpm
        </motion.span>
      </Parallax>

      {/* Clinical glow — center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.3} top="20%" left="25%">
        <div style={{
          width: '30vw', height: '30vw', borderRadius: '50%',
          background: 'radial-gradient(circle, #4fc3f718 0%, transparent 60%)',
          filter: 'blur(30px)',
        }} />
      </Parallax>

      {/* Sensor pulse 2 — center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.5} top="50%" left="55%">
        <motion.div
          animate={{ scale: [0.8, 3, 0.8], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
        >
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #4fc3f738' }} />
        </motion.div>
      </Parallax>

      {/* SpO2 readout — right center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.3} top="55%" right="12%">
        <motion.span
          className="font-mono select-none"
          style={{ fontSize: '12px', color: '#4fc3f735' }}
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          SpO₂ 98%
        </motion.span>
      </Parallax>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION V/VI — SPACE — INTERSTELLAR GARGANTUA
   Massive black hole with bright orange accretion disk,
   Einstein ring (gravitational lensing), photon sphere,
   suction debris streaming toward the singularity
   ═══════════════════════════════════════════════════════ */

/* Suction debris config — particles streaming toward the BH */
const SUCTION_DEBRIS = [
  { id: 1,  sx: '5%',  sy: '80%', dur: 9,  delay: 0,   size: 3, color: '#ff8844' },
  { id: 2,  sx: '15%', sy: '60%', dur: 11, delay: 1.5, size: 2, color: '#ffaa55' },
  { id: 3,  sx: '10%', sy: '30%', dur: 8,  delay: 3,   size: 4, color: '#ff6633' },
  { id: 4,  sx: '25%', sy: '90%', dur: 12, delay: 0.5, size: 2, color: '#ffcc66' },
  { id: 5,  sx: '60%', sy: '85%', dur: 7,  delay: 2,   size: 3, color: '#ff9944' },
  { id: 6,  sx: '40%', sy: '10%', dur: 10, delay: 4,   size: 2, color: '#ffbb55' },
  { id: 7,  sx: '70%', sy: '75%', dur: 6,  delay: 1,   size: 3, color: '#ff7733' },
  { id: 8,  sx: '20%', sy: '15%', dur: 13, delay: 3.5, size: 2, color: '#ffaa44' },
  { id: 9,  sx: '50%', sy: '92%', dur: 8,  delay: 5,   size: 3, color: '#ff8855' },
  { id: 10, sx: '85%', sy: '70%', dur: 9,  delay: 2.5, size: 2, color: '#ffcc77' },
  { id: 11, sx: '30%', sy: '5%',  dur: 11, delay: 6,   size: 2, color: '#ff9955' },
  { id: 12, sx: '90%', sy: '45%', dur: 7,  delay: 0.8, size: 3, color: '#ff6644' },
  { id: 13, sx: '45%', sy: '75%', dur: 10, delay: 4.5, size: 2, color: '#ffbb66' },
  { id: 14, sx: '8%',  sy: '50%', dur: 14, delay: 7,   size: 2, color: '#ff8833' },
]

/* BH center destination (approximately center of the 28vw BH at top:10% right:5%) */
const BH_X = '81%'
const BH_Y = '24%'

function SpaceSection({ mouseX, mouseY, progress }) {
  /* BH starts far away (small) at section entry and grows closer as you scroll */
  const spaceProgress = Math.min(1, Math.max(0, (progress - 0.70) / 0.30))
  const bhScale = 0.3 + spaceProgress * 0.7

  return (
    <>
      {/* ═══════════ THE GARGANTUA BLACK HOLE ═══════════
          Interstellar-accurate: bright orange accretion disk,
          photon ring (full circle), gravitational lensing arcs,
          dark event horizon, pitch-black singularity.
          NO rotating bars — clean, cinematic silhouette.
          Scales from distant to close as user scrolls.
          ═══════════════════════════════════════════════════ */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.4} top="8%" right="3%">
        <div
          className="relative"
          style={{
            width: '28vw', height: '28vw',
            transform: `scale(${bhScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease-out',
          }}
        >

          {/* ── Outer gravitational glow — warm orange ── */}
          <div className="absolute inset-[-60%] rounded-full" style={{
            background: 'radial-gradient(circle, #ff880025 0%, #ff660015 25%, #ff44000c 40%, transparent 65%)',
            filter: 'blur(40px)',
          }} />

          {/* ── Accretion disk — bright horizontal band ──
              The main visual: a thin brilliant orange band
              extending past the BH on both sides */}
          <motion.div
            className="absolute"
            style={{
              left: '-25%', right: '-25%',
              top: '46%', height: '8%',
              background: 'linear-gradient(to right, transparent 0%, #ff440030 10%, #ff884480 25%, #ffaa55e0 40%, #ffcc66ff 50%, #ffaa55e0 60%, #ff884480 75%, #ff440030 90%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(1.5px)',
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Accretion disk — thinner brighter core line ── */}
          <div
            className="absolute"
            style={{
              left: '-20%', right: '-20%',
              top: '48.5%', height: '3%',
              background: 'linear-gradient(to right, transparent 5%, #ffcc6640 20%, #ffdd88c0 40%, #ffeeddff 50%, #ffdd88c0 60%, #ffcc6640 80%, transparent 95%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
            }}
          />

          {/* ── Disk glow layer — softer wider bloom ── */}
          <div
            className="absolute"
            style={{
              left: '-30%', right: '-30%',
              top: '40%', height: '20%',
              background: 'linear-gradient(to right, transparent 5%, #ff660015 20%, #ff884430 35%, #ffaa4440 50%, #ff884430 65%, #ff660015 80%, transparent 95%)',
              borderRadius: '50%',
              filter: 'blur(10px)',
            }}
          />

          {/* ── Photon ring — the bright full circle defining the BH silhouette ──
              This is THE signature Gargantua ring: a clean, bright,
              thin circle of light just outside the event horizon shadow */}
          <motion.div
            className="absolute inset-[10%] rounded-full"
            style={{
              border: '2px solid #ffaa5590',
              boxShadow: '0 0 20px #ff884450, 0 0 40px #ff884425, inset 0 0 15px #ff884418',
            }}
            animate={{ scale: [0.98, 1.01, 0.98] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* ── Outer photon ring — fainter, slightly larger ── */}
          <div
            className="absolute inset-[6%] rounded-full"
            style={{
              border: '1px solid #ff884430',
              boxShadow: '0 0 12px #ff884418',
            }}
          />

          {/* ── Gravitational lensing arcs ──
              The back of the accretion disk bends around the BH.
              Visible as bright spots/arcs at the TOP and BOTTOM
              of the photon ring where lensed light concentrates */}
          <div className="absolute" style={{
            left: '44%', right: '44%', top: '6%', height: '8%',
            background: 'radial-gradient(ellipse, #ffaa5560 0%, #ff884430 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(3px)',
          }} />
          <div className="absolute" style={{
            left: '44%', right: '44%', bottom: '6%', height: '8%',
            background: 'radial-gradient(ellipse, #ffaa5550 0%, #ff884425 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(3px)',
          }} />

          {/* ── Lensed disk wrap — thin vertical arc over/under ──
              Very subtle scaleX ring representing the lensed back-side
              of the accretion disk wrapping around. Static, no rotation. */}
          <div
            className="absolute inset-[4%] rounded-full"
            style={{
              border: '1.5px solid #ff884438',
              boxShadow: '0 0 18px #ff884420, 0 0 35px #ff884410',
              transform: 'scaleX(0.15)',
            }}
          />

          {/* ── Dark sphere — the event horizon shadow ── */}
          <div className="absolute inset-[13%] rounded-full" style={{
            background: 'radial-gradient(circle, #000000 55%, #050000 70%, #0a020080 85%, transparent 100%)',
            boxShadow: 'inset 0 0 50px #000000',
          }} />

          {/* ── Core void — absolute black singularity ── */}
          <div className="absolute inset-[26%] rounded-full" style={{
            background: '#000000',
            boxShadow: 'inset 0 0 30px #000000, 0 0 10px #00000080',
          }} />

          {/* ── Doppler brightening — approaching side of disk is brighter ── */}
          <div className="absolute inset-0 rounded-full" style={{
            background: 'linear-gradient(90deg, transparent 25%, #ff884410 45%, #ffaa4420 60%, #ff884410 75%, transparent 100%)',
          }} />

        </div>
      </Parallax>

      {/* ═══════════ SUCTION DEBRIS ═══════════
          Particles streaming from various positions toward BH center.
          ease-in timing simulates gravitational acceleration. */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.6} top="0" left="0">
        <div className="absolute inset-0">
          {SUCTION_DEBRIS.map((d) => (
            <motion.div
              key={d.id}
              className="absolute rounded-full"
              style={{
                width: d.size,
                height: d.size,
                backgroundColor: d.color,
                boxShadow: `0 0 ${d.size * 3}px ${d.color}, 0 0 ${d.size * 6}px ${d.color}50`,
              }}
              initial={{ left: d.sx, top: d.sy, scale: 1, opacity: 0 }}
              animate={{
                left: [d.sx, BH_X],
                top: [d.sy, BH_Y],
                scale: [1, 0.6, 0],
                opacity: [0, 0.9, 0.8, 0.5, 0],
              }}
              transition={{
                duration: d.dur,
                delay: d.delay,
                repeat: Infinity,
                ease: [0.55, 0.05, 0.68, 0.53],
                opacity: {
                  duration: d.dur,
                  delay: d.delay,
                  repeat: Infinity,
                  times: [0, 0.15, 0.5, 0.8, 1],
                },
              }}
            />
          ))}
        </div>
      </Parallax>

      {/* ═══════════ SPACE OBJECTS ═══════════ */}

      {/* Planet — bottom left, with ring */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.5} bottom="15%" left="10%">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="48" height="48" viewBox="0 0 12 12" style={{ imageRendering: 'pixelated' }}>
            <rect x="4" y="1" width="4" height="1" fill="#7c4dff58" />
            <rect x="3" y="2" width="6" height="1" fill="#7c4dff70" />
            <rect x="2" y="3" width="8" height="2" fill="#7c4dff68" />
            <rect x="1" y="4" width="10" height="1" fill="#9060ff50" />
            <rect x="2" y="5" width="8" height="2" fill="#7c4dff68" />
            <rect x="3" y="7" width="6" height="1" fill="#7c4dff70" />
            <rect x="4" y="8" width="4" height="1" fill="#7c4dff58" />
            <rect x="0" y="4" width="2" height="1" fill="#b090ff35" />
            <rect x="10" y="4" width="2" height="1" fill="#b090ff35" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Planet 2 — small orange, left center */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.0} top="40%" left="15%">
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="24" height="24" viewBox="0 0 6 6" style={{ imageRendering: 'pixelated' }}>
            <rect x="2" y="0" width="2" height="1" fill="#ff884458" />
            <rect x="1" y="1" width="4" height="1" fill="#ff662268" />
            <rect x="0" y="2" width="6" height="2" fill="#ff884458" />
            <rect x="1" y="4" width="4" height="1" fill="#ff662258" />
            <rect x="2" y="5" width="2" height="1" fill="#ff884450" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Star cluster — top left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.8} top="8%" left="20%">
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg width="20" height="20" viewBox="0 0 5 5" style={{ imageRendering: 'pixelated' }}>
            <rect x="2" y="0" width="1" height="5" fill="#ffffff50" />
            <rect x="0" y="2" width="5" height="1" fill="#ffffff50" />
            <rect x="2" y="2" width="1" height="1" fill="#ffffffa0" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Star 2 — bottom right */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.2} bottom="25%" right="30%">
        <motion.div
          animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        >
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffffffd0', boxShadow: '0 0 6px #ffffff80' }} />
        </motion.div>
      </Parallax>

      {/* Nebula cloud — left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.5} top="25%" left="0%">
        <div style={{
          width: '20vw', height: '15vw', borderRadius: '50%',
          background: 'radial-gradient(ellipse, #7c4dff18 0%, #4a209010 30%, transparent 60%)',
          filter: 'blur(25px)',
        }} />
      </Parallax>

      {/* Comet — diagonal movement */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.3} top="20%" left="40%">
        <motion.div
          animate={{ x: [-80, 120], y: [40, -60], opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="32" height="8" viewBox="0 0 16 4" style={{ imageRendering: 'pixelated' }}>
            <rect x="0" y="2" width="2" height="1" fill="#ffffff20" />
            <rect x="2" y="2" width="3" height="1" fill="#ffffff40" />
            <rect x="5" y="1" width="3" height="2" fill="#ffffff60" />
            <rect x="8" y="1" width="4" height="2" fill="#ffffff90" />
            <rect x="12" y="0" width="4" height="3" fill="#ffffffc0" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Star 3 — distant twinkle */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.5} top="60%" left="70%">
        <motion.div
          animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#ffffffb0' }} />
        </motion.div>
      </Parallax>

      {/* Distant galaxy — subtle spiral */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={0.8} bottom="40%" left="55%">
        <motion.div
          animate={{ rotate: [0, 360], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 5, repeat: Infinity },
          }}
        >
          <svg width="28" height="28" viewBox="0 0 7 7" style={{ imageRendering: 'pixelated' }}>
            <rect x="3" y="0" width="1" height="1" fill="#b090ff35" />
            <rect x="4" y="1" width="2" height="1" fill="#9070dd45" />
            <rect x="2" y="2" width="3" height="3" fill="#7c4dff38" />
            <rect x="3" y="3" width="1" height="1" fill="#ffffff58" />
            <rect x="1" y="5" width="2" height="1" fill="#9070dd30" />
            <rect x="3" y="6" width="1" height="1" fill="#b090ff22" />
          </svg>
        </motion.div>
      </Parallax>

      {/* Extra star 4 — near BH, bright */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={1.0} top="45%" right="35%">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#ffcc88e0', boxShadow: '0 0 4px #ffaa4480' }} />
        </motion.div>
      </Parallax>

      {/* Extra star 5 — upper left */}
      <Parallax mouseX={mouseX} mouseY={mouseY} depth={2.8} top="5%" left="45%">
        <motion.div
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, delay: 3 }}
        >
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#ffffff90' }} />
        </motion.div>
      </Parallax>
    </>
  )
}
