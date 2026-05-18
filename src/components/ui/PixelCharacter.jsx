import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'

/*
  Minecraft-style pixel art character that evolves through 5 phases.
  Left panel has clickable phase buttons with roman numerals.
  Each phase has sub-steps that add/remove equipment as you scroll.

  Phases:
    0  Neutral    (0.00–0.15)   — basic clothes, no gear
    1  Scholar    (0.15–0.35)   — black gown, orange stole, cap w/ tassel, diploma
    2  Knight     (0.35–0.55)   — chainmail, armor, helmet, sword, shield, cape
    3  Engineer   (0.55–0.75)   — lab coat, stethoscope, glasses, tablet
    4  Astronaut  (0.75–1.00)   — space suit, helmet, visor, backpack + space objects
*/

const phases = [
  { id: 'neutral',   label: 'I',   color: '#c9a84c', section: 'hero' },
  { id: 'scholar',   label: 'II',  color: '#e87722', section: 'about' },
  { id: 'knight',    label: 'III', color: '#c9a84c', section: 'skills' },
  { id: 'engineer',  label: 'IV',  color: '#4fc3f7', section: 'astherion' },
  { id: 'astronaut', label: 'V',   color: '#7c4dff', section: 'future' },
]

function getPhase(progress) {
  if (progress < 0.15) return 0
  if (progress < 0.35) return 1
  if (progress < 0.55) return 2
  if (progress < 0.75) return 3
  return 4
}

/*
  Sub-phase equipping — within each phase, items appear piece-by-piece.
  Returns a sub-step index (0-based) for the current phase.
*/
function getSubPhase(progress, phase) {
  switch (phase) {
    case 0: return 0 // Neutral has no sub-phases
    case 1: { // Scholar: gown(0.15), stole(0.21), cap(0.27), diploma(0.33) — spans full Chronicle→Campaign
      if (progress < 0.21) return 0
      if (progress < 0.27) return 1
      if (progress < 0.33) return 2
      return 3
    }
    case 2: { // Knight: chainmail(0.35), chestplate(0.39), helmet(0.43), sword(0.47), shield(0.50), cape(0.53)
      if (progress < 0.39) return 0
      if (progress < 0.43) return 1
      if (progress < 0.47) return 2
      if (progress < 0.50) return 3
      if (progress < 0.53) return 4
      return 5
    }
    case 3: { // Engineer: coat(0.55), stethoscope(0.61), glasses(0.67), tablet(0.73) — ends at Next Frontier
      if (progress < 0.61) return 0
      if (progress < 0.67) return 1
      if (progress < 0.73) return 2
      return 3
    }
    case 4: { // Astronaut: suit(0.75), helmet(0.80), visor(0.85), backpack(0.90)
      if (progress < 0.80) return 0
      if (progress < 0.85) return 1
      if (progress < 0.90) return 2
      return 3
    }
    default: return 0
  }
}

export default function PixelCharacter() {
  const progress = useScrollProgress()
  const phase = getPhase(progress)
  const subPhase = getSubPhase(progress, phase)
  const current = phases[phase]

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col items-center w-20 pointer-events-none">
      {/* Phase buttons with roman numerals — top half */}
      <div className="flex flex-col items-center justify-center gap-1 pt-6 pointer-events-auto">
        {phases.map((p, i) => (
          <motion.button
            key={p.id}
            onClick={() => scrollToSection(p.section)}
            className="w-11 h-11 flex flex-col items-center justify-center relative transition-all duration-300 gap-0.5"
            style={{
              imageRendering: 'pixelated',
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Active highlight */}
            {i === phase && (
              <motion.div
                className="absolute inset-0"
                layoutId="phase-highlight"
                style={{
                  border: `2px solid ${p.color}`,
                  boxShadow: `0 0 12px ${p.color}40, inset 0 0 8px ${p.color}15`,
                  imageRendering: 'pixelated',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {/* Mini pixel icon for each phase */}
            <PhaseIcon phase={i} color={i <= phase ? p.color : 'rgba(255,255,255,0.15)'} />
            {/* Roman numeral label */}
            <span
              className="font-mono leading-none"
              style={{
                fontSize: '8px',
                color: i <= phase ? p.color : 'rgba(255,255,255,0.2)',
                letterSpacing: '0.08em',
                fontWeight: i === phase ? 700 : 400,
              }}
            >
              {p.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Pixel connector line */}
      <div className="flex flex-col items-center my-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-[2px] h-2" style={{ backgroundColor: `${current.color}20` }} />
        ))}
      </div>

      {/* Character — center */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative" style={{ imageRendering: 'pixelated' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.8, filter: 'brightness(2)' }}
              animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
              exit={{ opacity: 0, scale: 0.8, filter: 'brightness(0.5)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <PixelSprite phase={phase} subPhase={subPhase} color={current.color} />
            </motion.div>
          </AnimatePresence>

          {/* Animated space objects for Astronaut phase */}
          {phase === 4 && <SpaceObjects color={current.color} subPhase={subPhase} />}
        </div>
      </div>

      {/* Bottom connector */}
      <div className="pb-6 flex flex-col items-center gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-[2px] h-2" style={{ backgroundColor: `${current.color}15` }} />
        ))}
      </div>
    </div>
  )
}

/* ====================================
   PHASE ICONS — tiny 7x7 pixel icons
   for the sidebar buttons
   ==================================== */

function PhaseIcon({ phase, color }) {
  const icons = [
    // Neutral — person
    [[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0],[0,1,1,1,1,1,0],[0,0,0,1,0,0,0],[0,0,1,0,1,0,0],[0,0,1,0,1,0,0]],
    // Scholar — graduation cap + gown
    [[0,1,1,1,1,1,0],[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0],[0,1,1,1,1,1,0],[0,0,1,0,1,0,0],[0,0,1,0,1,0,0]],
    // Knight — helmet + sword + shield
    [[0,0,1,1,1,0,0],[0,1,1,1,1,1,0],[0,0,0,1,0,0,1],[1,1,1,1,1,0,1],[1,0,0,1,0,0,1],[0,0,1,0,1,0,0],[0,0,1,0,1,0,0]],
    // Engineer — person with cross
    [[0,0,1,1,1,0,0],[0,0,1,1,1,0,0],[0,0,0,1,0,0,0],[0,1,1,1,1,1,0],[0,0,0,1,0,1,1],[0,0,1,0,1,0,0],[0,0,1,0,1,0,0]],
    // Astronaut — helmet person
    [[0,1,1,1,1,1,0],[0,1,1,1,1,1,0],[0,1,0,1,0,1,0],[0,1,1,1,1,1,0],[0,0,1,1,1,0,0],[0,0,1,0,1,0,0],[0,0,1,0,1,0,0]],
  ]

  return (
    <svg viewBox="0 0 7 7" width="14" height="14" style={{ imageRendering: 'pixelated' }}>
      {icons[phase].map((row, y) =>
        row.map((cell, x) =>
          cell ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} /> : null
        )
      )}
    </svg>
  )
}

/* ====================================
   PIXEL SPRITE — 16x32 Minecraft-style character
   Each phase is a unique pixel grid
   ==================================== */

function PixelSprite({ phase, subPhase, color }) {
  const W = 16
  const H = 25
  const SCALE = 5

  // Get the appropriate sprite grid and palette for phase + subPhase
  const { grid, palette } = useMemo(() => {
    const grids = spriteSubGrids[phase]
    const palettes = spritePalettes[phase]
    if (!grids) return { grid: spriteSubGrids[0][0], palette: spritePalettes[0] }
    // Pick the highest subPhase grid available
    const maxSub = Math.min(subPhase, grids.length - 1)
    return { grid: grids[maxSub], palette: palettes }
  }, [phase, subPhase])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * SCALE}
      height={H * SCALE}
      style={{ imageRendering: 'pixelated' }}
    >
      {grid.map((row, y) =>
        row.split('').map((cell, x) => {
          if (cell === '.') return null
          const fillColor = palette[cell] || '#ff00ff'
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={fillColor}
            />
          )
        })
      )}
    </svg>
  )
}

/* ====================================
   SPACE OBJECTS — animated planets, black hole, galaxy, ship
   orbiting around the astronaut sprite
   ==================================== */

function SpaceObjects({ color, subPhase }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {/* Planet 1 — small purple planet orbiting top-right */}
      <motion.div
        className="absolute"
        style={{ top: -12, right: -20 }}
        animate={{
          x: [0, 8, 0, -8, 0],
          y: [0, -5, -8, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="16" height="16" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }}>
          <rect x="2" y="0" width="4" height="1" fill={color} opacity="0.8" />
          <rect x="1" y="1" width="6" height="1" fill={color} opacity="0.9" />
          <rect x="0" y="2" width="8" height="1" fill={color} />
          <rect x="0" y="3" width="8" height="1" fill="#9060ff" />
          <rect x="0" y="4" width="8" height="1" fill={color} />
          <rect x="1" y="5" width="6" height="1" fill={color} opacity="0.9" />
          <rect x="2" y="6" width="4" height="1" fill={color} opacity="0.8" />
          {/* Ring */}
          <rect x="-1" y="3" width="1" height="1" fill="#b090ff" opacity="0.5" />
          <rect x="8" y="3" width="1" height="1" fill="#b090ff" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Planet 2 — orange/warm planet bottom-left */}
      <motion.div
        className="absolute"
        style={{ bottom: 5, left: -18 }}
        animate={{
          x: [0, -6, 0, 6, 0],
          y: [0, 4, 8, 4, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="12" height="12" viewBox="0 0 6 6" style={{ imageRendering: 'pixelated' }}>
          <rect x="2" y="0" width="2" height="1" fill="#ff8844" opacity="0.8" />
          <rect x="1" y="1" width="4" height="1" fill="#ff6622" />
          <rect x="0" y="2" width="6" height="2" fill="#ff8844" />
          <rect x="1" y="4" width="4" height="1" fill="#ff6622" />
          <rect x="2" y="5" width="2" height="1" fill="#ff8844" opacity="0.8" />
        </svg>
      </motion.div>

      {/* Black hole — swirling dark vortex top-left */}
      <motion.div
        className="absolute"
        style={{ top: 20, left: -22 }}
        animate={{
          rotate: [0, 360],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg width="18" height="18" viewBox="0 0 9 9" style={{ imageRendering: 'pixelated' }}>
          <rect x="3" y="0" width="3" height="1" fill="#2a1050" />
          <rect x="1" y="1" width="2" height="1" fill="#3a2060" />
          <rect x="6" y="1" width="2" height="1" fill="#3a2060" />
          <rect x="0" y="2" width="2" height="1" fill="#4a3070" />
          <rect x="7" y="2" width="2" height="1" fill="#4a3070" />
          <rect x="0" y="3" width="1" height="3" fill="#3a2060" />
          <rect x="8" y="3" width="1" height="3" fill="#3a2060" />
          <rect x="3" y="3" width="3" height="3" fill="#0a0015" />
          <rect x="4" y="4" width="1" height="1" fill="#000005" />
          <rect x="0" y="6" width="2" height="1" fill="#4a3070" />
          <rect x="7" y="6" width="2" height="1" fill="#4a3070" />
          <rect x="1" y="7" width="2" height="1" fill="#3a2060" />
          <rect x="6" y="7" width="2" height="1" fill="#3a2060" />
          <rect x="3" y="8" width="3" height="1" fill="#2a1050" />
        </svg>
      </motion.div>

      {/* Galaxy — small spiral bottom-right */}
      <motion.div
        className="absolute"
        style={{ bottom: 30, right: -24 }}
        animate={{
          rotate: [0, 360],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <svg width="14" height="14" viewBox="0 0 7 7" style={{ imageRendering: 'pixelated' }}>
          <rect x="3" y="0" width="1" height="1" fill="#b090ff" opacity="0.4" />
          <rect x="4" y="1" width="2" height="1" fill="#9070dd" opacity="0.5" />
          <rect x="5" y="2" width="1" height="1" fill="#7c4dff" opacity="0.6" />
          <rect x="2" y="2" width="3" height="3" fill="#7c4dff" opacity="0.8" />
          <rect x="3" y="3" width="1" height="1" fill="#ffffff" opacity="0.9" />
          <rect x="1" y="4" width="1" height="1" fill="#7c4dff" opacity="0.6" />
          <rect x="1" y="5" width="2" height="1" fill="#9070dd" opacity="0.5" />
          <rect x="3" y="6" width="1" height="1" fill="#b090ff" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Ship — tiny pixel spaceship moving across */}
      <motion.div
        className="absolute"
        style={{ top: -5, left: -10 }}
        animate={{
          x: [0, 100, 100, 0],
          y: [0, -15, -15, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="10" height="8" viewBox="0 0 5 4" style={{ imageRendering: 'pixelated' }}>
          <rect x="2" y="0" width="1" height="1" fill="#e0e0ff" />
          <rect x="1" y="1" width="3" height="1" fill="#c0c0e0" />
          <rect x="0" y="2" width="5" height="1" fill="#a0a0d0" />
          <rect x="1" y="3" width="1" height="1" fill={color} opacity="0.8" />
          <rect x="3" y="3" width="1" height="1" fill={color} opacity="0.8" />
        </svg>
      </motion.div>

      {/* Twinkling stars */}
      {[
        { x: -15, y: 50, delay: 0 },
        { x: 85, y: 70, delay: 1 },
        { x: -8, y: 100, delay: 2 },
        { x: 90, y: 30, delay: 0.5 },
      ].map((star, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full"
          style={{
            left: star.x,
            top: star.y,
            backgroundColor: '#ffffff',
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ====================================
   SPRITE DATA
   16 wide × 32 tall pixel grids
   '.' = transparent
   ==================================== */

const spritePalettes = {
  // 0: Neutral
  0: {
    'S': '#8d6e4a', // skin
    'H': '#3a2510', // hair
    's': '#7a5c3a', // skin shadow
    'T': '#2a2a3a', // shirt
    't': '#1e1e2a', // shirt shadow
    'P': '#1a1a28', // pants
    'p': '#12121e', // pants shadow
    'B': '#3a2a1a', // boots
    'b': '#2a1a0a', // boots dark
    'E': '#2a1e10', // eyes
  },
  // 1: Scholar — black gown, orange tassel/stole, diploma
  1: {
    'S': '#8d6e4a', // skin
    'H': '#3a2510', // hair
    's': '#7a5c3a', // skin shadow
    'R': '#1a1a1e', // black gown
    'r': '#101014', // gown shadow
    'G': '#e87722', // orange (stole/tassel)
    'g': '#c06018', // orange dark
    'K': '#f5f0e0', // diploma paper
    'k': '#d4c8a0', // diploma shadow
    'C': '#1a1a1e', // cap (black)
    'c': '#101014', // cap shadow
    'F': '#e87722', // tassel
    'E': '#2a1e10', // eyes
    'B': '#1a1a1e', // shoes match gown
    'b': '#101014',
  },
  // 2: Knight — medieval armor, sword, shield, cape
  2: {
    'S': '#8d6e4a', // skin
    's': '#7a5c3a', // skin shadow
    'A': '#707880', // steel armor
    'a': '#505860', // armor shadow
    'G': '#c9a84c', // gold trim
    'g': '#a08030', // gold shadow
    'M': '#606870', // chainmail
    'm': '#404850', // chainmail shadow
    'W': '#d0d4d8', // sword blade
    'w': '#a0a4a8', // blade shadow
    'D': '#505860', // dark armor plate
    'd': '#383e48', // dark plate shadow
    'L': '#8a1a1a', // cape red
    'l': '#5a0a0a', // cape dark
    'E': '#2a1e10', // eyes (visor slit)
    'H': '#606870', // helmet
    'T': '#2a2a3a', // tunic under armor
    'P': '#404850', // leg armor
    'p': '#303840', // leg shadow
  },
  // 3: Engineer
  3: {
    'S': '#8d6e4a',
    'H': '#3a2510',
    's': '#7a5c3a',
    'C': '#e8e8e8', // coat
    'c': '#c0c0c0', // coat shadow
    'T': '#2a2a3a', // shirt under
    'G': '#4fc3f7', // blue accent
    'g': '#2a8ab0', // blue dark
    'K': '#1a1a2a', // tablet
    'k': '#4fc3f7', // tablet screen
    'P': '#2a2a3a', // pants
    'p': '#1e1e2a',
    'B': '#3a3a4a', // shoes
    'b': '#2a2a3a',
    'E': '#2a1e10',
    'L': '#4fc3f7', // stethoscope
  },
  // 4: Astronaut
  4: {
    'S': '#c0c0d0', // suit white
    's': '#9090a0', // suit shadow
    'H': '#d0d0e0', // helmet
    'h': '#a0a0b0', // helmet shadow
    'V': '#7c4dff', // visor/accent
    'v': '#5a30cc', // visor dark
    'G': '#7c4dff', // glow
    'g': '#5a30cc', // glow dark
    'P': '#c0c0d0', // suit legs
    'p': '#9090a0',
    'B': '#7c4dff', // boots accent
    'b': '#5a30cc',
    'K': '#d0d0e0', // backpack
    'k': '#a0a0b0',
    'E': '#7c4dff', // visor "eyes"
  },
}

/*
  SPRITE SUB-GRIDS — each phase has an array of sub-phase grids.
  Sub-phase 0 = first equipment piece added, sub-phase N = fully equipped.
  16 wide × 25 tall pixel grids, '.' = transparent
*/
const spriteSubGrids = {
  // 0: NEUTRAL — single sub-phase (no equipment progression)
  0: [[
    '......HHHH......',
    '.....HHHHHH.....',
    '.....HSSSSH.....',
    '.....SESESH.....',
    '.....SSSSSH.....',
    '......SSSS......',
    '.......SS.......',
    '.....TTTTTT.....',
    '....TTTTTTTT....',
    '...tTTTTTTTTt...',
    '...SS.TTTT.SS...',
    '...SS.TTTT.SS...',
    '...SS.TTTT.SS...',
    '...ss.tttt.ss...',
    '......TTTT......',
    '......PPPP......',
    '......PPPP......',
    '.....PPPPPP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....PP..PP.....',
    '.....pp..pp.....',
    '.....BB..BB.....',
    '.....BB..BB.....',
    '....BBB..BBB....',
  ]],

  // 1: SCHOLAR — sub0: gown, sub1: +stole, sub2: +cap, sub3: +diploma
  1: [
    // Sub 0: Black graduation gown only
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '.....SESESH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '.......SS.......',
      '.....RRRRRR.....',
      '....RRRRRRRR....',
      '...rRRRRRRRRr...',
      '...SS.RRRR.SS...',
      '...SS.RRRR.SS...',
      '...SS.RRRR.SS...',
      '...ss.rrrr.ss...',
      '......RRRR......',
      '......RRRR......',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RR..RR.....',
      '.....RR..RR.....',
      '.....rr..rr.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
    // Sub 1: Gown + orange stole (G = orange)
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '.....SESESH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '.......SS.......',
      '.....GRRRRG.....',
      '....GRRRRRRRG...',
      '...rGRRRRRRGr...',
      '...SS.RRRR.SS...',
      '...SS.RRRR.SS...',
      '...SS.RRRR.SS...',
      '...ss.rrrr.ss...',
      '......RRRR......',
      '......RRRR......',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RR..RR.....',
      '.....RR..RR.....',
      '.....rr..rr.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
    // Sub 2: Gown + stole + graduation cap with orange tassel
    [
      '....CCCCCCCC....',
      '...CCCCCCCCCC...',
      '......HHHH......',
      '.....HSSSSH.....',
      '.....SESESH.....',
      '......SSSS......',
      '.......SS.......',
      '.....GRRRRG.....',
      '....GRRRRRRRG...',
      '...rGRRRRRRGr...',
      '...SS.RRRR.SS...',
      '...SS.RRRR.SS...',
      '...SS.RRRR.SS...',
      '...ss.rrrr.ss...',
      '......RRRR......',
      '......RRRR......',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RR..RR.....',
      '.....RR..RR.....',
      '.....rr..rr.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
    // Sub 3: Full — gown + stole + cap + diploma in hand
    [
      '....CCCCCCCC....',
      '..F.CCCCCCCCCC..',
      '..F...HHHH......',
      '.....HSSSSH.....',
      '.....SESESH.....',
      '......SSSS......',
      '.......SS.......',
      '.....GRRRRG.....',
      '....GRRRRRRRG...',
      '...rGRRRRRRGr...',
      '...SS.RRRR.SS...',
      '..KSS.RRRR.SS..',
      '..KKS.RRRR.SS..',
      '..KKs.rrrr.ss..',
      '......RRRR......',
      '......RRRR......',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RRRRRR.....',
      '.....RR..RR.....',
      '.....RR..RR.....',
      '.....rr..rr.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
  ],

  // 2: KNIGHT — sub0: chainmail, sub1: +chestplate, sub2: +helmet, sub3: +sword, sub4: +shield, sub5: +cape
  2: [
    // Sub 0: Chainmail over tunic
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '.....SESESH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '.......MM.......',
      '.....MMMMMM.....',
      '....MMMMMMMM....',
      '...mMMMMMMMMm...',
      '...SS.MMMM.SS...',
      '...SS.MMMM.SS...',
      '...SS.MMMM.SS...',
      '...ss.mmmm.ss...',
      '......MMMM......',
      '......PPPP......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....AA..AA.....',
      '.....AA..AA.....',
      '....AAA..AAA....',
    ],
    // Sub 1: + chestplate + pauldrons
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '.....SESESH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '.......MM.......',
      '...AAAMMMMAA....',
      '...DDMGMMGMDD...',
      '..DDDMGMGMMDD...',
      '...SS.AMMM.SS...',
      '...SS.AMMM.SS...',
      '...SS.AMMM.SS...',
      '...ss.ammm.ss...',
      '......AMMM......',
      '......PPPP......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....AA..AA.....',
      '.....AA..AA.....',
      '....AAA..AAA....',
    ],
    // Sub 2: + helmet (replaces hair with full helm)
    [
      '......AAAA......',
      '.....AAAAAA.....',
      '.....AGGGGA.....',
      '.....AEEEEA.....',
      '.....AAAAAA.....',
      '......aGGa......',
      '.......MM.......',
      '...AAAMMMMAA....',
      '...DDMGMMGMDD...',
      '..DDDMGMGMMDD...',
      '...SS.AMMM.SS...',
      '...SS.AMMM.SS...',
      '...SS.AMMM.SS...',
      '...ss.ammm.ss...',
      '......AMMM......',
      '......PPPP......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....AA..AA.....',
      '.....AA..AA.....',
      '....AAA..AAA....',
    ],
    // Sub 3: + sword (right hand)
    [
      '......AAAA......',
      '.....AAAAAA.....',
      '.....AGGGGA.....',
      '.....AEEEEA.....',
      '.....AAAAAA.....',
      '......aGGa......',
      '.......MM.......',
      '...AAAMMMMAA....',
      '...DDMGMMGMDD.W.',
      '..DDDMGMGMMDD.W.',
      '...SS.AMMM.SS.W.',
      '...SS.AMMM.SSWW.',
      '...SS.AMMM.SWW..',
      '...ss.ammm.swg..',
      '......AMMM..gG..',
      '......PPPP..gG..',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....AA..AA.....',
      '.....AA..AA.....',
      '....AAA..AAA....',
    ],
    // Sub 4: + shield (left hand)
    [
      '......AAAA......',
      '.....AAAAAA.....',
      '.....AGGGGA.....',
      '.....AEEEEA.....',
      '.....AAAAAA.....',
      '......aGGa......',
      '.......MM.......',
      '...AAAMMMMAA....',
      '.DDDDMGMMGMDD.W.',
      '.DDDGMGMGMMDD.W.',
      '.DD.S.AMMM.SS.W.',
      '.DD.S.AMMM.SSWW.',
      '.DD.S.AMMM.SWW..',
      '.dd.s.ammm.swg..',
      '......AMMM..gG..',
      '......PPPP..gG..',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....AA..AA.....',
      '.....AA..AA.....',
      '....AAA..AAA....',
    ],
    // Sub 5: + cape (full knight)
    [
      '......AAAA......',
      '.....AAAAAA.....',
      '.....AGGGGA.....',
      '.....AEEEEA.....',
      '.....AAAAAA.....',
      '......aGGa......',
      '.......MM.......',
      '..LAAAMMMMAAL...',
      '.LDDMGMMGMDDL.W',
      '.LDDGMGMGMDDL.W',
      '.LD.S.AMMM.SSL.W',
      '.LD.S.AMMM.SSWW.',
      '.lD.S.AMMM.SWW..',
      '.ld.s.ammm.swg..',
      '......AMMM..gG..',
      '......PPPP..gG..',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....AA..AA.....',
      '.....AA..AA.....',
      '....AAA..AAA....',
    ],
  ],

  // 3: ENGINEER — sub0: coat, sub1: +stethoscope, sub2: +glasses, sub3: +tablet
  3: [
    // Sub 0: Lab coat only
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '.....HSESEH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '.......SS.......',
      '....CCCCCCC.....',
      '....CCTTTTCC....',
      '...cCCTTTTCCc...',
      '...SS.CCCC.SS...',
      '...SS.CCCC.SS...',
      '...SS.CCCC.SS...',
      '...ss.cccc.ss...',
      '......CCCC......',
      '......PPPP......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
    // Sub 1: + stethoscope
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '.....HSESEH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '......LSS.......',
      '....LCCCCCCC....',
      '....CCTTTTCC....',
      '...cCCTTTTCCc...',
      '...SS.CCCC.SS...',
      '...SS.CCCC.SS...',
      '...SS.CCCC.SS...',
      '...ss.cccc.ss...',
      '......CCCC......',
      '......PPPP......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
    // Sub 2: + glasses (blue accent on face)
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '....GHSESEH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '......LSS.......',
      '....LCCCCCCC....',
      '....CCTTTTCC....',
      '...cCCTTTTCCc...',
      '...SS.CCCC.SS...',
      '...SS.CCCC.SS...',
      '...SS.CCCC.SS...',
      '...ss.cccc.ss...',
      '......CCCC......',
      '......PPPP......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
    // Sub 3: + tablet (full engineer)
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '....GHSESEH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '......LSS.......',
      '....LCCCCCCC....',
      '....CCTTTTCC....',
      '...cCCTTTTCCc...',
      '...SS.CCCC.SS...',
      '...SS.CCCC.SSK..',
      '...SS.CCCC.SKK..',
      '...ss.cccc.skk..',
      '......CCCC......',
      '......PPPP......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '.....BB..BB.....',
      '....BBB..BBB....',
    ],
  ],

  // 4: ASTRONAUT — sub0: suit, sub1: +helmet, sub2: +visor, sub3: +backpack
  4: [
    // Sub 0: Space suit body only (no helmet)
    [
      '......HHHH......',
      '.....HHHHHH.....',
      '.....HSSSSH.....',
      '.....SESESH.....',
      '.....SSSSSH.....',
      '......SSSS......',
      '.......SS.......',
      '....VSSSSSSV....',
      '....SSGVGSSS....',
      '...sSSSVVSSSs...',
      '...SS.SSSS.SS...',
      '...SS.SSSS.SS...',
      '...SS.SSSS.SS...',
      '...ss.ssss.ss...',
      '......SSSS......',
      '.....VPPPV......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '....VBBVVBBV....',
      '....BBB..BBB....',
    ],
    // Sub 1: + helmet dome
    [
      '.....HHHHHH.....',
      '....HHHHHHHH....',
      '....HhSSSSHH....',
      '....HhSEESHH....',
      '....HhSSSSHH....',
      '....HHHHHHHH....',
      '......hSSh......',
      '....VSSSSSSV....',
      '....SSGVGSSS....',
      '...sSSSVVSSSs...',
      '...SS.SSSS.SS...',
      '...SS.SSSS.SS...',
      '...SS.SSSS.SS...',
      '...ss.ssss.ss...',
      '......SSSS......',
      '.....VPPPV......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '....VBBVVBBV....',
      '....BBB..BBB....',
    ],
    // Sub 2: + visor (glowing purple)
    [
      '.....HHHHHH.....',
      '....HHHHHHHH....',
      '....HVVVVVVH....',
      '....HVEEEVH.....',
      '....HVVVVVH.....',
      '....HHHHHHHH....',
      '......hSSh......',
      '....VSSSSSSV....',
      '....SSGVGSSS....',
      '...sSSSVVSSSs...',
      '...SS.SSSS.SS...',
      '..BSS.SSSS.SSB..',
      '..BSS.SSSS.SSB..',
      '..bss.ssss.ssb..',
      '......SSSS......',
      '.....VPPPV......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '....VBBVVBBV....',
      '....BBB..BBB....',
    ],
    // Sub 3: + backpack (full astronaut)
    [
      '.....HHHHHH.....',
      '....HHHHHHHH....',
      '....HVVVVVVH....',
      '....HVEEEVH.....',
      '....HVVVVVH.....',
      '....HHHHHHHH....',
      '......hSSh......',
      '....VSSSSSSV....',
      '....SSGVGSSS....',
      '...sSSSVVSSSs...',
      '...SS.SSSS.SS...',
      '..BSS.SSSS.SSB..',
      '..BSS.SSSS.SSB..',
      '..bss.ssss.ssb..',
      '......SSSS......',
      '.....VPPPV......',
      '......PPPP......',
      '.....PPPPPP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....PP..PP.....',
      '.....pp..pp.....',
      '.....BB..BB.....',
      '....VBBVVBBV....',
      '....BBB..BBB....',
    ],
  ],
}
