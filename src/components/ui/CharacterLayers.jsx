import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollProgress } from '../../hooks/useScrollProgress'

/*
  Layered Image Character Evolution

  Each era has a set of PNG layers (transparent background) that
  appear at specific scroll thresholds. Place your AI-generated
  images in /public/character/{era}/ and they'll load automatically.

  SCROLL MAP:
  ───────────────────────────────────────────
  0.00  Base figure (always visible)

  KNIGHT (0.02–0.28):
   0.02  tunic        — undergarment layer
   0.05  chainmail    — chain layer over tunic
   0.08  chestplate   — front armor with cross
   0.10  pauldrons    — both shoulder guards
   0.13  gauntlets    — arm guards
   0.16  greaves      — leg armor
   0.19  helmet       — full helm
   0.22  shield       — left hand
   0.24  sword        — right hand
   0.26  cape         — back drape

  SCHOLAR (0.30–0.44):
   0.30  robes        — full scholar outfit
   0.34  cap          — beret / headwear
   0.37  book         — left hand
   0.40  compass      — right hand

  ENGINEER (0.46–0.64):
   0.46  labcoat      — white coat
   0.50  glasses      — eyewear
   0.54  stethoscope  — around neck
   0.58  tablet       — right hand

  ASTRONAUT (0.68–0.94):
   0.68  suit         — full space suit
   0.74  chestmodule  — HUD panel
   0.78  armmodules   — arm tech
   0.82  helmet       — dome
   0.86  visor        — glow overlay
   0.90  backpack     — life support
   0.94  aura         — energy glow (CSS effect)
*/

// Layer definitions: [scrollThreshold, imagePath, slideDirection, label]
const layers = {
  base: { threshold: 0, path: '/character/base.png', slide: 'none', label: 'Base Figure' },

  knight: [
    { id: 'k-tunic',      threshold: 0.02, path: '/character/knight/tunic.png',      slide: 'bottom', label: 'Tunic' },
    { id: 'k-chainmail',  threshold: 0.05, path: '/character/knight/chainmail.png',  slide: 'bottom', label: 'Chainmail' },
    { id: 'k-chestplate', threshold: 0.08, path: '/character/knight/chestplate.png', slide: 'front',  label: 'Chest Plate' },
    { id: 'k-pauldrons',  threshold: 0.10, path: '/character/knight/pauldrons.png',  slide: 'top',    label: 'Pauldrons' },
    { id: 'k-gauntlets',  threshold: 0.13, path: '/character/knight/gauntlets.png',  slide: 'sides',  label: 'Gauntlets' },
    { id: 'k-greaves',    threshold: 0.16, path: '/character/knight/greaves.png',    slide: 'bottom', label: 'Greaves' },
    { id: 'k-helmet',     threshold: 0.19, path: '/character/knight/helmet.png',     slide: 'top',    label: 'Helmet' },
    { id: 'k-shield',     threshold: 0.22, path: '/character/knight/shield.png',     slide: 'left',   label: 'Shield' },
    { id: 'k-sword',      threshold: 0.24, path: '/character/knight/sword.png',      slide: 'right',  label: 'Sword' },
    { id: 'k-cape',       threshold: 0.26, path: '/character/knight/cape.png',       slide: 'back',   label: 'Cape' },
  ],

  scholar: [
    { id: 's-robes',   threshold: 0.30, path: '/character/scholar/robes.png',   slide: 'bottom', label: 'Robes' },
    { id: 's-cap',     threshold: 0.34, path: '/character/scholar/cap.png',     slide: 'top',    label: 'Cap' },
    { id: 's-book',    threshold: 0.37, path: '/character/scholar/book.png',    slide: 'left',   label: 'Book' },
    { id: 's-compass', threshold: 0.40, path: '/character/scholar/compass.png', slide: 'right',  label: 'Compass' },
  ],

  engineer: [
    { id: 'e-labcoat',     threshold: 0.46, path: '/character/engineer/labcoat.png',     slide: 'bottom', label: 'Lab Coat' },
    { id: 'e-glasses',     threshold: 0.50, path: '/character/engineer/glasses.png',     slide: 'front',  label: 'Glasses' },
    { id: 'e-stethoscope', threshold: 0.54, path: '/character/engineer/stethoscope.png', slide: 'top',    label: 'Stethoscope' },
    { id: 'e-tablet',      threshold: 0.58, path: '/character/engineer/tablet.png',      slide: 'right',  label: 'Tablet' },
  ],

  astronaut: [
    { id: 'a-suit',       threshold: 0.68, path: '/character/astronaut/suit.png',       slide: 'bottom', label: 'Space Suit' },
    { id: 'a-chestmod',   threshold: 0.74, path: '/character/astronaut/chestmodule.png', slide: 'front', label: 'Chest Module' },
    { id: 'a-armmod',     threshold: 0.78, path: '/character/astronaut/armmodules.png', slide: 'sides',  label: 'Arm Modules' },
    { id: 'a-helmet',     threshold: 0.82, path: '/character/astronaut/helmet.png',     slide: 'top',    label: 'Helmet' },
    { id: 'a-visor',      threshold: 0.86, path: '/character/astronaut/visor.png',      slide: 'front',  label: 'Visor' },
    { id: 'a-backpack',   threshold: 0.90, path: '/character/astronaut/backpack.png',   slide: 'back',   label: 'Backpack' },
  ],
}

// All layers flattened with era tags
const allLayers = [
  ...layers.knight.map(l => ({ ...l, era: 'knight', hideAbove: 0.30 })),
  ...layers.scholar.map(l => ({ ...l, era: 'scholar', hideAbove: 0.46 })),
  ...layers.engineer.map(l => ({ ...l, era: 'engineer', hideAbove: 0.68 })),
  ...layers.astronaut.map(l => ({ ...l, era: 'astronaut', hideAbove: 1.1 })),
]

function getSlideOffset(slide) {
  switch (slide) {
    case 'left':   return { x: -60, y: 0 }
    case 'right':  return { x: 60, y: 0 }
    case 'top':    return { x: 0, y: -50 }
    case 'bottom': return { x: 0, y: 50 }
    case 'front':  return { x: 0, y: 0 }  // scale only
    case 'back':   return { x: 0, y: 0 }
    case 'sides':  return { x: 0, y: 0 }
    default:       return { x: 0, y: 0 }
  }
}

export default function CharacterLayers() {
  const progress = useScrollProgress()

  const currentEra = progress < 0.30 ? 'knight'
    : progress < 0.46 ? 'scholar'
    : progress < 0.68 ? 'engineer'
    : 'astronaut'

  const eraColor = {
    knight: '#c9a84c',
    scholar: '#b8860b',
    engineer: '#4fc3f7',
    astronaut: '#7c4dff',
  }[currentEra]

  const eraLabel = currentEra.toUpperCase()
  const stageIndex = { knight: 0, scholar: 1, engineer: 2, astronaut: 3 }[currentEra]

  return (
    <div className="fixed left-4 lg:left-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 pointer-events-none">
      {/* Character container */}
      <div className="relative w-32 h-80">
        {/* Era glow */}
        <div
          className="absolute inset-0 blur-3xl rounded-full opacity-15 transition-colors duration-1000 scale-125"
          style={{ backgroundColor: eraColor }}
        />

        {/* Base figure — always visible */}
        <ImageLayer
          src="/character/base.png"
          label="Base"
          show={true}
          slide="none"
          eraColor={eraColor}
          isBase
        />

        {/* Equipment layers */}
        {allLayers.map(layer => {
          const show = progress >= layer.threshold && progress < layer.hideAbove
          return (
            <ImageLayer
              key={layer.id}
              src={layer.path}
              label={layer.label}
              show={show}
              slide={layer.slide}
              eraColor={eraColor}
            />
          )
        })}

        {/* Astronaut aura effect (CSS only, no image needed) */}
        {progress >= 0.94 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: `radial-gradient(circle, ${eraColor}20 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />
        )}
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={eraLabel}
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-px h-5" style={{ backgroundColor: `${eraColor}40` }} />
          <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color: `${eraColor}90` }}>
            {eraLabel}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex flex-col gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              backgroundColor: i <= stageIndex ? eraColor : 'rgba(255,255,255,0.1)',
              boxShadow: i === stageIndex ? `0 0 6px ${eraColor}60` : 'none',
              transform: i === stageIndex ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/*
  Individual layer renderer.
  Shows the image if it exists, otherwise shows a styled placeholder.
*/
function ImageLayer({ src, label, show, slide, eraColor, isBase = false }) {
  const offset = getSlideOffset(slide)
  const usesScale = slide === 'front' || slide === 'sides' || slide === 'back'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{
            opacity: 0,
            x: offset.x,
            y: offset.y,
            scale: usesScale ? 0.7 : 1,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 },
          }}
          transition={{
            duration: isBase ? 0 : 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <img
            src={src}
            alt={label}
            className="w-full h-full object-contain"
            draggable={false}
            onError={(e) => {
              // If image doesn't exist, replace with placeholder
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          {/* Placeholder — shown when image is missing */}
          <div
            className="absolute inset-0 items-center justify-center hidden"
            style={{ display: 'none' }}
          >
            <PlaceholderLayer label={label} color={eraColor} isBase={isBase} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/*
  Placeholder — a styled silhouette shown until real images are added.
  Gives visual feedback for positioning and timing.
*/
function PlaceholderLayer({ label, color, isBase }) {
  if (isBase) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 80 280" className="w-full h-full opacity-30" fill="none">
          {/* Stylized human silhouette */}
          <circle cx="40" cy="32" r="16" fill={color} opacity="0.3" />
          <path d="M24 55 L24 150 L56 150 L56 55 Q40 45 24 55Z" fill={color} opacity="0.15" />
          <path d="M28 150 L26 240 L34 240 L36 150Z" fill={color} opacity="0.15" />
          <path d="M44 150 L46 240 L54 240 L52 150Z" fill={color} opacity="0.15" />
          <path d="M18 60 L6 120 L14 122 L24 65Z" fill={color} opacity="0.12" />
          <path d="M56 65 L66 122 L74 120 L62 60Z" fill={color} opacity="0.12" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="border border-dashed rounded px-2 py-1 text-center"
      style={{ borderColor: `${color}40`, maxWidth: '90%' }}
    >
      <span className="font-mono text-[7px] tracking-wider uppercase block" style={{ color: `${color}60` }}>
        {label}
      </span>
    </div>
  )
}
