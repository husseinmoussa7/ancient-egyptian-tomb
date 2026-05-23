// TorchEffect — flickering PointLight + sconce geometry + fire particle system
// Replace torch geometry with a real GLTF sconce model from Sketchfab if desired

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TorchEffectProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  intensity?: number
  flickerSpeed?: number
  color?: string
}

// Fire particle system
function FireParticles({ position }: { position: [number, number, number] }) {
  const COUNT = 40
  const pointsRef = useRef<THREE.Points>(null!)
  const ages = useRef<Float32Array>(new Float32Array(COUNT).map(() => Math.random()))

  const initialPositions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 0.12
      arr[i * 3 + 1] = Math.random() * 0.3
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.12
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      ages.current[i] += delta * 1.8
      if (ages.current[i] > 1) {
        // Reset particle to base
        ages.current[i] = 0
        pos[i * 3 + 0] = (Math.random() - 0.5) * 0.1
        pos[i * 3 + 1] = 0
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1
      } else {
        // Rise and drift
        pos[i * 3 + 1] += delta * (0.25 + Math.random() * 0.15)
        pos[i * 3 + 0] += (Math.random() - 0.5) * delta * 0.04
        pos[i * 3 + 2] += (Math.random() - 0.5) * delta * 0.04
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <group position={position}>
      {/* Ember/fire particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={COUNT}
            array={initialPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#FF7722"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export default function TorchEffect({
  position,
  rotation = [0, 0, 0],
  intensity = 2.5,
  flickerSpeed = 3,
  color = '#FF6622',
}: TorchEffectProps) {
  const lightRef = useRef<THREE.PointLight>(null!)
  const light2Ref = useRef<THREE.PointLight>(null!)

  // Animate flicker
  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.elapsedTime
    // Layered sine waves for organic flicker
    const flicker =
      1 +
      Math.sin(t * flickerSpeed * 2.1) * 0.15 +
      Math.sin(t * flickerSpeed * 3.7) * 0.08 +
      Math.sin(t * flickerSpeed * 5.3) * 0.05
    lightRef.current.intensity = intensity * flicker
    if (light2Ref.current) {
      light2Ref.current.intensity = intensity * 0.3 * (1 + Math.sin(t * flickerSpeed * 1.5) * 0.2)
    }
  })

  const [px, py, pz] = position

  return (
    <group position={position} rotation={rotation}>
      {/* Wall sconce mount */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#4A3010" roughness={0.8} metalness={0.4} />
      </mesh>
      {/* Torch bowl */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.05, 0.1, 12, 1, true]} />
        <meshStandardMaterial color="#6B4420" roughness={0.7} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Glowing center (flame core) */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color="#FFCC00"
          emissive="#FF8800"
          emissiveIntensity={3}
          roughness={0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Fire particles */}
      <FireParticles position={[0, 0.16, 0]} />

      {/* Primary flickering torch light */}
      <pointLight
        ref={lightRef}
        color={color}
        intensity={intensity}
        distance={12}
        decay={2}
        castShadow
        shadow-mapSize={[256, 256]}
        shadow-bias={-0.001}
        position={[0, 0.2, 0]}
      />
      {/* Secondary fill light — slightly different color temperature */}
      <pointLight
        ref={light2Ref}
        color="#FF9944"
        intensity={intensity * 0.3}
        distance={6}
        decay={2}
        position={[0, 0.3, 0]}
      />
    </group>
  )
}
