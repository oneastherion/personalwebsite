import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 300

export default function Particles({ progress }) {
  const meshRef = useRef()
  const timeRef = useRef(0)

  // Create initial positions and velocities
  const { positions, velocities, sizes, basePositions } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const basePositions = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 12
      positions[i3 + 1] = (Math.random() - 0.5) * 12
      positions[i3 + 2] = (Math.random() - 0.5) * 6

      basePositions[i3] = positions[i3]
      basePositions[i3 + 1] = positions[i3 + 1]
      basePositions[i3 + 2] = positions[i3 + 2]

      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = Math.random() * 0.02 + 0.005
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005

      sizes[i] = Math.random() * 3 + 1
    }

    return { positions, velocities, sizes, basePositions }
  }, [])

  // Color based on era
  const color = useMemo(() => {
    if (progress < 0.2) return new THREE.Color('#c9a84c')     // Gold embers
    if (progress < 0.4) return new THREE.Color('#b8860b')     // Dark gold / sepia
    if (progress < 0.65) return new THREE.Color('#4fc3f7')    // Clinical blue
    if (progress < 0.8) return new THREE.Color('#7c4dff')     // Ultraviolet
    return new THREE.Color('#a0a0ff')                          // Starlight
  }, [Math.floor(progress * 5)])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta

    const geo = meshRef.current.geometry
    const pos = geo.attributes.position.array
    const time = timeRef.current

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      if (progress < 0.25) {
        // EMBER MODE: drift upward, flicker
        pos[i3] = basePositions[i3] + Math.sin(time * 0.5 + i) * 0.3
        pos[i3 + 1] += velocities[i3 + 1] * 0.8
        pos[i3 + 2] = basePositions[i3 + 2] + Math.cos(time * 0.3 + i) * 0.2

        if (pos[i3 + 1] > 6) {
          pos[i3 + 1] = -6
          pos[i3] = (Math.random() - 0.5) * 12
        }
      } else if (progress < 0.5) {
        // INK/DUST MODE: slow drift, gentle floating
        pos[i3] = basePositions[i3] + Math.sin(time * 0.2 + i * 0.5) * 0.5
        pos[i3 + 1] = basePositions[i3 + 1] + Math.cos(time * 0.15 + i * 0.3) * 0.3
        pos[i3 + 2] = basePositions[i3 + 2] + Math.sin(time * 0.1 + i) * 0.2
      } else if (progress < 0.75) {
        // CIRCUIT MODE: snap towards grid, form connections
        const gridX = Math.round(basePositions[i3] * 2) / 2
        const gridY = Math.round(basePositions[i3 + 1] * 2) / 2
        const snap = Math.min((progress - 0.5) * 4, 1)

        pos[i3] = basePositions[i3] + (gridX - basePositions[i3]) * snap
        pos[i3 + 1] = basePositions[i3 + 1] + (gridY - basePositions[i3 + 1]) * snap
        pos[i3 + 2] = basePositions[i3 + 2] * (1 - snap * 0.5)

        // Subtle pulse
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.05 * snap
        pos[i3] += pulse
        pos[i3 + 1] += pulse
      } else {
        // STARFIELD MODE: spread out, gentle drift
        const spread = 1 + (progress - 0.75) * 3
        pos[i3] = basePositions[i3] * spread + Math.sin(time * 0.05 + i) * 0.1
        pos[i3 + 1] = basePositions[i3 + 1] * spread + Math.cos(time * 0.03 + i) * 0.1
        pos[i3 + 2] = basePositions[i3 + 2] * spread - 2
      }
    }

    geo.attributes.position.needsUpdate = true

    // Update color smoothly
    meshRef.current.material.color.lerp(color, delta * 2)

    // Adjust opacity by era
    const targetOpacity = progress < 0.2 ? 0.7 : progress < 0.5 ? 0.4 : progress < 0.75 ? 0.5 : 0.6
    meshRef.current.material.opacity += (targetOpacity - meshRef.current.material.opacity) * delta * 2
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
