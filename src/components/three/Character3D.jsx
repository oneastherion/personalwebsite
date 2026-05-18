import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
// drei imports removed - using pure Three.js primitives
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useScrollProgress } from '../../hooks/useScrollProgress'

/*
  3D Character Evolution — ~18 equipment steps
  Each piece appears at a specific scroll threshold.

  MEDIEVAL KNIGHT (0.00 – 0.28)
   0.00  Base figure (always visible)
   0.02  Tunic / undergarments
   0.05  Chainmail layer
   0.08  Chest plate
   0.10  Left pauldron
   0.12  Right pauldron
   0.14  Left gauntlet
   0.16  Right gauntlet
   0.18  Greaves (leg armor)
   0.20  Helmet (open)
   0.22  Shield
   0.24  Sword
   0.26  Cape + visor closes

  SCHOLAR (0.30 – 0.42)
   0.30  Knight armor fades → Scholar robes appear
   0.34  Scholar cap
   0.37  Book
   0.40  Compass / astrolabe

  ENGINEER (0.46 – 0.62)
   0.46  Scholar fades → Lab coat
   0.50  Glasses
   0.54  Stethoscope
   0.58  Data tablet

  ASTRONAUT (0.68 – 0.95)
   0.68  Lab coat fades → Space suit base
   0.74  Chest module / HUD
   0.78  Arm modules
   0.82  Helmet dome
   0.86  Visor glow
   0.90  Backpack / life support
   0.94  Full energy aura
*/

export default function Character3D() {
  const progress = useScrollProgress()

  // Determine current era for the label
  const eraLabel = progress < 0.30 ? 'KNIGHT'
    : progress < 0.46 ? 'SCHOLAR'
    : progress < 0.68 ? 'ENGINEER'
    : 'ASTRONAUT'

  const eraColor = progress < 0.30 ? '#c9a84c'
    : progress < 0.46 ? '#b8860b'
    : progress < 0.68 ? '#4fc3f7'
    : '#7c4dff'

  // Progress dots
  const stage = progress < 0.30 ? 0 : progress < 0.46 ? 1 : progress < 0.68 ? 2 : 3

  return (
    <div className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 pointer-events-none">
      {/* 3D Canvas */}
      <div className="w-28 h-72 relative">
        {/* Era glow behind character */}
        <div
          className="absolute inset-0 blur-3xl rounded-full opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: eraColor }}
        />
        <Canvas
          camera={{ position: [0, 0, 6], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <CharacterScene progress={progress} />
        </Canvas>
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
              backgroundColor: i <= stage ? eraColor : 'rgba(255,255,255,0.1)',
              boxShadow: i === stage ? `0 0 6px ${eraColor}60` : 'none',
              transform: i === stage ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ====================================
   3D SCENE
   ==================================== */

function CharacterScene({ progress }) {
  const groupRef = useRef()

  // Gentle idle sway
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03
    }
  })

  // Era-based lighting color
  const lightColor = useMemo(() => {
    if (progress < 0.30) return '#c9a84c'
    if (progress < 0.46) return '#b8860b'
    if (progress < 0.68) return '#4fc3f7'
    return '#7c4dff'
  }, [Math.floor(progress * 10)])

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} color={lightColor} />
      <directionalLight position={[-2, 3, -2]} intensity={0.3} color="#ffffff" />
      {/* Rim light from behind */}
      <pointLight position={[0, 0, -3]} intensity={0.5} color={lightColor} />

      <group ref={groupRef} position={[0, -1.8, 0]} scale={0.85}>
        {/* BASE FIGURE — always visible */}
        <BaseFigure progress={progress} />

        {/* KNIGHT EQUIPMENT */}
        <EquipmentPiece show={progress >= 0.02 && progress < 0.30} yOffset={0}>
          <Tunic />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.05 && progress < 0.30} yOffset={0}>
          <Chainmail />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.08 && progress < 0.30} yOffset={0} slideFrom="front">
          <ChestPlate />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.10 && progress < 0.30} slideFrom="left">
          <Pauldron position={[-0.55, 1.95, 0]} />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.12 && progress < 0.30} slideFrom="right">
          <Pauldron position={[0.55, 1.95, 0]} mirror />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.14 && progress < 0.30} slideFrom="left">
          <Gauntlet position={[-0.65, 1.1, 0]} />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.16 && progress < 0.30} slideFrom="right">
          <Gauntlet position={[0.65, 1.1, 0]} mirror />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.18 && progress < 0.30}>
          <Greaves />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.20 && progress < 0.30} slideFrom="top">
          <Helmet />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.22 && progress < 0.30} slideFrom="left">
          <Shield />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.24 && progress < 0.30} slideFrom="right">
          <Sword />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.26 && progress < 0.30}>
          <Cape />
        </EquipmentPiece>

        {/* SCHOLAR EQUIPMENT */}
        <EquipmentPiece show={progress >= 0.30 && progress < 0.46}>
          <ScholarRobes />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.34 && progress < 0.46} slideFrom="top">
          <ScholarCap />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.37 && progress < 0.46} slideFrom="left">
          <Book />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.40 && progress < 0.46} slideFrom="right">
          <Compass />
        </EquipmentPiece>

        {/* ENGINEER EQUIPMENT */}
        <EquipmentPiece show={progress >= 0.46 && progress < 0.68}>
          <LabCoat />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.50 && progress < 0.68} slideFrom="front">
          <Glasses />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.54 && progress < 0.68}>
          <Stethoscope />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.58 && progress < 0.68} slideFrom="right">
          <DataTablet />
        </EquipmentPiece>

        {/* ASTRONAUT EQUIPMENT */}
        <EquipmentPiece show={progress >= 0.68}>
          <SpaceSuitBase />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.74} slideFrom="front">
          <ChestModule />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.78}>
          <ArmModules />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.82} slideFrom="top">
          <HelmetDome />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.86}>
          <VisorGlow />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.90}>
          <Backpack />
        </EquipmentPiece>
        <EquipmentPiece show={progress >= 0.94}>
          <EnergyAura progress={progress} />
        </EquipmentPiece>
      </group>
    </>
  )
}

/* ====================================
   EQUIPMENT WRAPPER — handles show/hide animation
   ==================================== */

function EquipmentPiece({ show, children, slideFrom = 'center', yOffset = 0 }) {
  const ref = useRef()
  const targetScale = show ? 1 : 0
  const slideOffset = useMemo(() => {
    switch (slideFrom) {
      case 'left': return [-1.5, 0, 0]
      case 'right': return [1.5, 0, 0]
      case 'top': return [0, 1.5, 0]
      case 'front': return [0, 0, 1.5]
      default: return [0, 0, 0]
    }
  }, [slideFrom])

  useFrame((_, delta) => {
    if (!ref.current) return
    const speed = 4 * delta

    // Scale animation
    ref.current.scale.x += (targetScale - ref.current.scale.x) * speed
    ref.current.scale.y += (targetScale - ref.current.scale.y) * speed
    ref.current.scale.z += (targetScale - ref.current.scale.z) * speed

    // Slide animation
    const tx = show ? 0 : slideOffset[0]
    const ty = show ? 0 : slideOffset[1]
    const tz = show ? 0 : slideOffset[2]
    ref.current.position.x += (tx - ref.current.position.x) * speed * 0.5
    ref.current.position.y += (ty + yOffset - ref.current.position.y) * speed * 0.5
    ref.current.position.z += (tz - ref.current.position.z) * speed * 0.5
  })

  return (
    <group ref={ref} scale={0}>
      {children}
    </group>
  )
}

/* ====================================
   MATERIALS
   ==================================== */

const mat = {
  skin: { color: '#8d6e4a', roughness: 0.8, metalness: 0.1 },
  armor: { color: '#8a7a5a', roughness: 0.3, metalness: 0.8 },
  armorDark: { color: '#4a4030', roughness: 0.4, metalness: 0.7 },
  gold: { color: '#c9a84c', roughness: 0.2, metalness: 0.9, emissive: '#3a2a00', emissiveIntensity: 0.3 },
  chainmail: { color: '#6a6a6a', roughness: 0.5, metalness: 0.9 },
  leather: { color: '#3a2a1a', roughness: 0.9, metalness: 0.1 },
  cloth: { color: '#2a1a10', roughness: 1, metalness: 0 },
  robes: { color: '#1a1028', roughness: 0.8, metalness: 0.1 },
  paper: { color: '#d4c5a0', roughness: 1, metalness: 0 },
  labCoat: { color: '#e8e8e8', roughness: 0.7, metalness: 0.05 },
  medical: { color: '#4fc3f7', roughness: 0.3, metalness: 0.5, emissive: '#0a3050', emissiveIntensity: 0.4 },
  spaceSuit: { color: '#c0c0d0', roughness: 0.3, metalness: 0.6 },
  spaceAccent: { color: '#7c4dff', roughness: 0.2, metalness: 0.7, emissive: '#2a1060', emissiveIntensity: 0.5 },
  visor: { color: '#4a3aaa', roughness: 0.1, metalness: 0.9, emissive: '#7c4dff', emissiveIntensity: 0.8 },
  energy: { color: '#7c4dff', roughness: 0, metalness: 0, emissive: '#7c4dff', emissiveIntensity: 1 },
}

function M({ type = 'skin', opacity = 1 }) {
  const m = mat[type] || mat.skin
  return (
    <meshStandardMaterial
      color={m.color}
      roughness={m.roughness}
      metalness={m.metalness}
      emissive={m.emissive || '#000000'}
      emissiveIntensity={m.emissiveIntensity || 0}
      transparent={opacity < 1}
      opacity={opacity}
    />
  )
}

/* ====================================
   BASE FIGURE
   ==================================== */

function BaseFigure({ progress }) {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2.65, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <M type="skin" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 2.38, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.12, 8]} />
        <M type="skin" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <M type="cloth" />
      </mesh>

      {/* Hips */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.25]} />
        <M type="cloth" />
      </mesh>

      {/* Left upper arm */}
      <mesh position={[-0.45, 2.05, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.08, 0.07, 0.45, 8]} />
        <M type="skin" />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-0.55, 1.6, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.07, 0.06, 0.4, 8]} />
        <M type="skin" />
      </mesh>

      {/* Right upper arm */}
      <mesh position={[0.45, 2.05, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.08, 0.07, 0.45, 8]} />
        <M type="skin" />
      </mesh>
      {/* Right forearm */}
      <mesh position={[0.55, 1.6, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.07, 0.06, 0.4, 8]} />
        <M type="skin" />
      </mesh>

      {/* Left thigh */}
      <mesh position={[-0.15, 1.0, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
        <M type="cloth" />
      </mesh>
      {/* Left calf */}
      <mesh position={[-0.15, 0.5, 0]}>
        <cylinderGeometry args={[0.09, 0.07, 0.5, 8]} />
        <M type="cloth" />
      </mesh>
      {/* Left foot */}
      <mesh position={[-0.15, 0.2, 0.05]}>
        <boxGeometry args={[0.1, 0.08, 0.2]} />
        <M type="leather" />
      </mesh>

      {/* Right thigh */}
      <mesh position={[0.15, 1.0, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
        <M type="cloth" />
      </mesh>
      {/* Right calf */}
      <mesh position={[0.15, 0.5, 0]}>
        <cylinderGeometry args={[0.09, 0.07, 0.5, 8]} />
        <M type="cloth" />
      </mesh>
      {/* Right foot */}
      <mesh position={[0.15, 0.2, 0.05]}>
        <boxGeometry args={[0.1, 0.08, 0.2]} />
        <M type="leather" />
      </mesh>
    </group>
  )
}

/* ====================================
   KNIGHT PIECES
   ==================================== */

function Tunic() {
  return (
    <mesh position={[0, 1.65, 0]}>
      <boxGeometry args={[0.64, 1.0, 0.34]} />
      <M type="leather" />
    </mesh>
  )
}

function Chainmail() {
  return (
    <mesh position={[0, 1.85, 0]}>
      <boxGeometry args={[0.66, 0.85, 0.33]} />
      <M type="chainmail" />
    </mesh>
  )
}

function ChestPlate() {
  return (
    <group>
      <mesh position={[0, 1.9, 0.1]}>
        <boxGeometry args={[0.55, 0.7, 0.12]} />
        <M type="armor" />
      </mesh>
      {/* Gold cross emblem */}
      <mesh position={[0, 1.95, 0.17]}>
        <boxGeometry args={[0.04, 0.2, 0.02]} />
        <M type="gold" />
      </mesh>
      <mesh position={[0, 1.95, 0.17]}>
        <boxGeometry args={[0.14, 0.04, 0.02]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Pauldron({ position = [0, 0, 0], mirror = false }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.15, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <M type="armor" />
    </mesh>
  )
}

function Gauntlet({ position = [0, 0, 0], mirror = false }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.09, 0.2, 8]} />
        <M type="armor" />
      </mesh>
      {/* Gold trim */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 8]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Greaves() {
  return (
    <group>
      {/* Left greave */}
      <mesh position={[-0.15, 0.75, 0.06]}>
        <boxGeometry args={[0.14, 0.7, 0.1]} />
        <M type="armor" />
      </mesh>
      {/* Right greave */}
      <mesh position={[0.15, 0.75, 0.06]}>
        <boxGeometry args={[0.14, 0.7, 0.1]} />
        <M type="armor" />
      </mesh>
      {/* Knee caps */}
      <mesh position={[-0.15, 1.05, 0.1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <M type="gold" />
      </mesh>
      <mesh position={[0.15, 1.05, 0.1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Helmet() {
  return (
    <group position={[0, 2.65, 0]}>
      {/* Main dome */}
      <mesh>
        <sphereGeometry args={[0.26, 12, 12]} />
        <M type="armor" />
      </mesh>
      {/* Face opening */}
      <mesh position={[0, -0.02, 0.15]}>
        <boxGeometry args={[0.16, 0.12, 0.1]} />
        <M type="armorDark" />
      </mesh>
      {/* Top crest */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.03, 0.12, 0.2]} />
        <M type="gold" />
      </mesh>
      {/* Nose guard */}
      <mesh position={[0, 0, 0.24]}>
        <boxGeometry args={[0.02, 0.14, 0.04]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Shield() {
  return (
    <group position={[-0.75, 1.5, 0.1]} rotation={[0, 0.3, 0]}>
      {/* Shield body */}
      <mesh>
        <boxGeometry args={[0.4, 0.6, 0.04]} />
        <M type="armorDark" />
      </mesh>
      {/* Gold rim */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.36, 0.56, 0.01]} />
        <M type="gold" />
      </mesh>
      {/* Inner dark */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.30, 0.48, 0.01]} />
        <M type="armorDark" />
      </mesh>
      {/* Diamond emblem */}
      <mesh position={[0, 0.05, 0.04]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Sword() {
  return (
    <group position={[0.7, 1.4, 0]} rotation={[0, 0, -0.1]}>
      {/* Blade */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.04, 0.8, 0.015]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.95} />
      </mesh>
      {/* Crossguard */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.04]} />
        <M type="gold" />
      </mesh>
      {/* Grip */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
        <M type="leather" />
      </mesh>
      {/* Pommel */}
      <mesh position={[0, -0.24, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Cape() {
  return (
    <group position={[0, 1.8, -0.2]}>
      <mesh>
        <boxGeometry args={[0.5, 1.2, 0.04]} />
        <meshStandardMaterial color="#6a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Gold clasp */}
      <mesh position={[0, 0.55, 0.03]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

/* ====================================
   SCHOLAR PIECES
   ==================================== */

function ScholarRobes() {
  return (
    <group>
      {/* Long robe */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.7, 1.6, 0.35]} />
        <M type="robes" />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 2.25, 0.1]}>
        <boxGeometry args={[0.35, 0.15, 0.12]} />
        <meshStandardMaterial color="#2a1838" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Belt/sash */}
      <mesh position={[0, 1.45, 0.15]}>
        <boxGeometry args={[0.55, 0.06, 0.08]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function ScholarCap() {
  return (
    <group position={[0, 2.9, 0]}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.15, 0.1, 8]} />
        <M type="robes" />
      </mesh>
      {/* Tassel */}
      <mesh position={[0.15, 0.02, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.15, 4]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Book() {
  return (
    <group position={[-0.6, 1.4, 0.15]} rotation={[0.2, 0.4, 0]}>
      <mesh>
        <boxGeometry args={[0.25, 0.32, 0.06]} />
        <M type="leather" />
      </mesh>
      {/* Pages */}
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.22, 0.29, 0.04]} />
        <M type="paper" />
      </mesh>
      {/* Spine */}
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.02, 0.32, 0.06]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

function Compass() {
  return (
    <group position={[0.6, 1.3, 0.15]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.01, 8, 24]} />
        <M type="gold" />
      </mesh>
      {/* Needle */}
      <mesh>
        <boxGeometry args={[0.005, 0.005, 0.18]} />
        <M type="gold" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.005, 0.005, 0.18]} />
        <M type="gold" />
      </mesh>
    </group>
  )
}

/* ====================================
   ENGINEER PIECES
   ==================================== */

function LabCoat() {
  return (
    <group>
      {/* Coat body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.68, 1.4, 0.34]} />
        <M type="labCoat" />
      </mesh>
      {/* Lapels */}
      <mesh position={[-0.12, 2.1, 0.14]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.12, 0.25, 0.02]} />
        <M type="labCoat" />
      </mesh>
      <mesh position={[0.12, 2.1, 0.14]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.12, 0.25, 0.02]} />
        <M type="labCoat" />
      </mesh>
      {/* Pocket */}
      <mesh position={[-0.18, 1.7, 0.18]}>
        <boxGeometry args={[0.12, 0.08, 0.01]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Glasses() {
  return (
    <group position={[0, 2.68, 0.2]}>
      {/* Left lens */}
      <mesh position={[-0.07, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.04, 0.005, 6, 12]} />
        <M type="medical" />
      </mesh>
      {/* Right lens */}
      <mesh position={[0.07, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.04, 0.005, 6, 12]} />
        <M type="medical" />
      </mesh>
      {/* Bridge */}
      <mesh>
        <boxGeometry args={[0.06, 0.005, 0.005]} />
        <M type="medical" />
      </mesh>
    </group>
  )
}

function Stethoscope() {
  return (
    <group>
      {/* Tubes around neck */}
      <mesh position={[-0.15, 2.15, 0.18]} rotation={[0.3, 0, 0.3]}>
        <torusGeometry args={[0.15, 0.012, 8, 16, Math.PI]} />
        <M type="medical" />
      </mesh>
      {/* Chest piece */}
      <mesh position={[-0.25, 1.8, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
        <M type="medical" />
      </mesh>
    </group>
  )
}

function DataTablet() {
  return (
    <group position={[0.6, 1.5, 0.1]} rotation={[0, -0.3, 0]}>
      <mesh>
        <boxGeometry args={[0.22, 0.3, 0.02]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Screen glow */}
      <mesh position={[0, 0, 0.011]}>
        <boxGeometry args={[0.18, 0.26, 0.001]} />
        <meshStandardMaterial
          color="#4fc3f7"
          emissive="#4fc3f7"
          emissiveIntensity={0.5}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

/* ====================================
   ASTRONAUT PIECES
   ==================================== */

function SpaceSuitBase() {
  return (
    <group>
      {/* Suit torso */}
      <mesh position={[0, 1.85, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.38]} />
        <M type="spaceSuit" />
      </mesh>
      {/* Suit lower */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.6, 0.7, 0.32]} />
        <M type="spaceSuit" />
      </mesh>
      {/* Neck ring */}
      <mesh position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.06, 16]} />
        <M type="spaceAccent" />
      </mesh>
      {/* Belt */}
      <mesh position={[0, 1.35, 0.16]}>
        <boxGeometry args={[0.55, 0.08, 0.1]} />
        <M type="spaceAccent" />
      </mesh>
      {/* Suit legs */}
      <mesh position={[-0.15, 0.65, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.7, 8]} />
        <M type="spaceSuit" />
      </mesh>
      <mesh position={[0.15, 0.65, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.7, 8]} />
        <M type="spaceSuit" />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.15, 0.22, 0.02]}>
        <boxGeometry args={[0.14, 0.12, 0.22]} />
        <M type="spaceAccent" />
      </mesh>
      <mesh position={[0.15, 0.22, 0.02]}>
        <boxGeometry args={[0.14, 0.12, 0.22]} />
        <M type="spaceAccent" />
      </mesh>
    </group>
  )
}

function ChestModule() {
  return (
    <group position={[0, 1.9, 0.2]}>
      <mesh>
        <boxGeometry args={[0.3, 0.25, 0.06]} />
        <M type="spaceAccent" />
      </mesh>
      {/* HUD indicators */}
      <mesh position={[-0.06, 0.04, 0.031]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <M type="energy" />
      </mesh>
      <mesh position={[0.06, 0.04, 0.031]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <M type="energy" />
      </mesh>
      {/* Data lines */}
      <mesh position={[0, -0.04, 0.031]}>
        <boxGeometry args={[0.2, 0.01, 0.001]} />
        <M type="energy" />
      </mesh>
      <mesh position={[0, -0.07, 0.031]}>
        <boxGeometry args={[0.15, 0.01, 0.001]} />
        <M type="energy" />
      </mesh>
    </group>
  )
}

function ArmModules() {
  return (
    <group>
      {/* Left arm module */}
      <mesh position={[-0.52, 1.65, 0]}>
        <boxGeometry args={[0.16, 0.2, 0.16]} />
        <M type="spaceAccent" />
      </mesh>
      {/* Right arm module */}
      <mesh position={[0.52, 1.65, 0]}>
        <boxGeometry args={[0.16, 0.2, 0.16]} />
        <M type="spaceAccent" />
      </mesh>
      {/* Suit arm covers */}
      <mesh position={[-0.45, 2.0, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
        <M type="spaceSuit" />
      </mesh>
      <mesh position={[0.45, 2.0, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
        <M type="spaceSuit" />
      </mesh>
    </group>
  )
}

function HelmetDome() {
  return (
    <group position={[0, 2.65, 0]}>
      {/* Outer dome */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#d0d0e0"
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Helmet rim */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.06, 16]} />
        <M type="spaceAccent" />
      </mesh>
    </group>
  )
}

function VisorGlow() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })
  return (
    <mesh ref={ref} position={[0, 2.63, 0.18]}>
      <sphereGeometry args={[0.2, 16, 12, 0, Math.PI, 0, Math.PI / 2]} />
      <meshStandardMaterial
        color="#4a3aaa"
        roughness={0.05}
        metalness={0.95}
        emissive="#7c4dff"
        emissiveIntensity={0.7}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function Backpack() {
  return (
    <group position={[0, 1.85, -0.25]}>
      <mesh>
        <boxGeometry args={[0.35, 0.55, 0.15]} />
        <M type="spaceSuit" />
      </mesh>
      {/* Vents */}
      <mesh position={[-0.1, 0.2, -0.08]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
        <M type="spaceAccent" />
      </mesh>
      <mesh position={[0.1, 0.2, -0.08]}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
        <M type="spaceAccent" />
      </mesh>
      {/* Connector tubes */}
      <mesh position={[-0.15, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 6]} />
        <M type="spaceAccent" />
      </mesh>
      <mesh position={[0.15, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 6]} />
        <M type="spaceAccent" />
      </mesh>
    </group>
  )
}

function EnergyAura({ progress }) {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5
      ref.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05
    }
  })
  return (
    <mesh ref={ref} position={[0, 1.5, 0]}>
      <sphereGeometry args={[1.2, 16, 16]} />
      <meshStandardMaterial
        color="#7c4dff"
        emissive="#7c4dff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.1}
        side={THREE.BackSide}
        wireframe
      />
    </mesh>
  )
}
