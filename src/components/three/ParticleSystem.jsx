import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import Particles from './Particles'

export default function ParticleSystem() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleScene />
      </Canvas>
    </div>
  )
}

function ParticleScene() {
  const progress = useScrollProgress()
  return (
    <>
      <ambientLight intensity={0.1} />
      <Particles progress={progress} />
    </>
  )
}
