// Scene.tsx — Main 3D scene for Ancient Egyptian Tomb Explorer
// Uses React Three Fiber + Drei + post-processing
//
// To replace procedural geometry with real GLTF models:
//   import { useGLTF } from '@react-three/drei'
//   const { scene } = useGLTF('/models/tomb_chamber.glb')
//   return <primitive object={scene} />
//
// Free Egyptian 3D models: https://sketchfab.com/search?q=egyptian+tomb&type=models&features=downloadable

import { useRef, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  PointerLockControls,
  Stars,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'
import * as THREE from 'three'
import { useStore, TOUR_STOPS } from '../../store/useStore'
import { ARTIFACTS } from '../../data/artifacts'
import Artifact3D from './Artifact3D'
import TorchEffect from './TorchEffect'

// ─── Room Dimensions ──────────────────────────────────────────────────────────
const CHAMBER = { w: 16, h: 5, d: 16 }
const CORRIDOR = { w: 3, h: 3.2, d: 10 }
const DOOR = { w: 2.4, h: 2.8 }

// ─── Hieroglyph Panel ─────────────────────────────────────────────────────────
// Uses InstancedMesh so all glyphs on a wall = 1 draw call instead of ~175.
// Replace with a canvas-rendered texture for even higher fidelity.
interface HieroglyphPanelProps {
  width: number
  height: number
  isOriginal: boolean
  seed?: number
}

function HieroglyphPanel({ width, height, isOriginal, seed = 42 }: HieroglyphPanelProps) {
  const MAX = 32
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  // Deterministic glyph layout — stable across re-renders
  const glyphs = useMemo(() => {
    let s = seed
    const rng = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
    const cols = Math.min(Math.floor(width / 1.1), 8)
    const rows = Math.min(Math.floor(height / 1.0), 4)
    const colors = ['#C41E3A', '#D4AF37', '#1A3A8A', '#2E7D32', '#8B0000', '#B8860B']
    const items: { x: number; y: number; color: string; w: number; h: number }[] = []
    for (let c = 0; c < cols && items.length < MAX; c++) {
      for (let r = 0; r < rows && items.length < MAX; r++) {
        items.push({
          x: (c - (cols - 1) / 2) * 1.1,
          y: (r - (rows - 1) / 2) * 1.0,
          color: colors[Math.floor(rng() * colors.length)],
          w: 0.2 + rng() * 0.18,
          h: 0.2 + rng() * 0.38,
        })
      }
    }
    return items
  }, [width, height, seed])

  // Push transforms + per-instance color into the GPU buffer once
  useEffect(() => {
    if (!meshRef.current || glyphs.length === 0) return
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    glyphs.forEach((g, i) => {
      dummy.position.set(g.x, g.y, 0.005)
      dummy.scale.set(g.w, g.h, 1)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, color.set(g.color))
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [glyphs])

  if (!isOriginal || glyphs.length === 0) return null

  // All glyphs share one geometry + one material = 1 draw call
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, glyphs.length]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial roughness={0.7} emissive="#110800" emissiveIntensity={0.06} />
    </instancedMesh>
  )
}

// ─── Pillar ───────────────────────────────────────────────────────────────────
function Pillar({
  position,
  isOriginal,
}: {
  position: [number, number, number]
  isOriginal: boolean
}) {
  const stoneColor = isOriginal ? '#C4A35A' : '#5C4A32'
  const paintColor = isOriginal ? '#D4AF37' : '#3A2E1A'
  const accentBlue = isOriginal ? '#1A3A8A' : '#1A1810'

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.9, 0.3, 0.9]} />
        <meshStandardMaterial color={stoneColor} roughness={0.85} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 1.95, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.35, 0.38, 3.6, 18]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} metalness={0.0} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 3.85, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.5, 0.37, 0.5, 18]} />
        <meshStandardMaterial color={stoneColor} roughness={0.75} />
      </mesh>
      {/* Abacus (flat top slab) */}
      <mesh position={[0, 4.18, 0]} receiveShadow>
        <boxGeometry args={[1.1, 0.16, 1.1]} />
        <meshStandardMaterial color={stoneColor} roughness={0.7} />
      </mesh>
      {/* Gold band at capital */}
      <mesh position={[0, 3.62, 0]}>
        <torusGeometry args={[0.38, 0.03, 8, 24]} />
        <meshStandardMaterial color={paintColor} roughness={0.3} metalness={isOriginal ? 0.8 : 0.1} />
      </mesh>
      {/* Painted hieroglyph band on shaft */}
      {isOriginal && (
        <>
          <mesh position={[0, 1.95, 0.38]} rotation={[0, 0, 0]}>
            <planeGeometry args={[0.62, 3.2]} />
            <meshStandardMaterial color="#B89040" roughness={0.7} />
          </mesh>
          <mesh position={[0, 2.5, 0.385]}>
            <planeGeometry args={[0.2, 0.2]} />
            <meshStandardMaterial color={accentBlue} roughness={0.6} emissive={accentBlue} emissiveIntensity={0.05} />
          </mesh>
          <mesh position={[0, 1.8, 0.385]}>
            <planeGeometry args={[0.18, 0.28]} />
            <meshStandardMaterial color="#C41E3A" roughness={0.6} />
          </mesh>
        </>
      )}
    </group>
  )
}

// ─── Sarcophagus Platform ─────────────────────────────────────────────────────
function SarcophagusPlatform({ isOriginal }: { isOriginal: boolean }) {
  const color = isOriginal ? '#A08040' : '#4A3820'
  return (
    <group position={[0, 0, -1.5]}>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.16, 3.8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.18, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.06, 3.4]} />
        <meshStandardMaterial
          color={isOriginal ? '#D4AF37' : '#6B5020'}
          roughness={0.4}
          metalness={isOriginal ? 0.7 : 0.1}
        />
      </mesh>
    </group>
  )
}

// ─── Main Chamber Geometry ────────────────────────────────────────────────────
function MainChamber({ isOriginal, crossSection }: { isOriginal: boolean; crossSection: boolean }) {
  const stoneColor = isOriginal ? '#C4A35A' : '#5C4A32'
  const ceilingColor = isOriginal ? '#0D1B3E' : '#3A3020'
  const floorColor = isOriginal ? '#A08040' : '#3A2E18'
  const trimColor = isOriginal ? '#D4AF37' : '#5A4220'
  const w = CHAMBER.w
  const h = CHAMBER.h
  const d = CHAMBER.d

  const mat = (color: string, rough = 0.85, metal = 0.0) =>
    ({ color, roughness: rough, metalness: metal }) as const

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial {...mat(floorColor, 0.9)} />
      </mesh>
      {/* Floor tile lines (original mode) */}
      {isOriginal && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[w, d]} />
          <meshStandardMaterial color="#A08040" roughness={0.9} wireframe />
        </mesh>
      )}

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          color={ceilingColor}
          roughness={0.95}
          emissive={isOriginal ? '#0A1428' : '#000'}
          emissiveIntensity={isOriginal ? 0.1 : 0}
        />
      </mesh>
      {/* Stars on ceiling for original mode */}
      {isOriginal && (
        <Stars radius={4} depth={0.2} count={400} factor={0.3} saturation={0} fade speed={0} />
      )}

      {/* Back wall (z = -d/2) */}
      <mesh position={[0, h / 2, -d / 2]} receiveShadow castShadow>
        <boxGeometry args={[w, h, 0.4]} />
        <meshStandardMaterial {...mat(stoneColor, 0.85)} />
      </mesh>
      {/* Back wall glyphs — MUST be inside a positioned group, not floating at origin */}
      <group position={[0, h / 2, -d / 2 + 0.22]}>
        <HieroglyphPanel width={w - 2} height={h - 1} isOriginal={isOriginal} seed={11} />
      </group>

      {/* Left wall (x = -w/2) */}
      <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[d, h, 0.4]} />
        <meshStandardMaterial {...mat(stoneColor, 0.85)} />
      </mesh>
      {/* Left wall alcoves — painted niches rather than a full panel to avoid corridor sightline */}
      {isOriginal && [-4, -6].map((z, i) => (
        <mesh key={i} position={[-w / 2 + 0.22, h / 2, z]}>
          <boxGeometry args={[0.04, 2.5, 1.8]} />
          <meshStandardMaterial color="#C41E3A" roughness={0.6} emissive="#440000" emissiveIntensity={0.08} />
        </mesh>
      ))}

      {/* Right wall (x = w/2) */}
      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[d, h, 0.4]} />
        <meshStandardMaterial {...mat(stoneColor, 0.85)} />
      </mesh>
      {/* Right wall alcoves — painted niches rather than a full panel to avoid corridor sightline */}
      {isOriginal && [-4, -6].map((z, i) => (
        <mesh key={i} position={[w / 2 - 0.22, h / 2, z]}>
          <boxGeometry args={[0.04, 2.5, 1.8]} />
          <meshStandardMaterial color="#1A3A8A" roughness={0.6} emissive="#000820" emissiveIntensity={0.08} />
        </mesh>
      ))}

      {/* Front wall — two sections flanking the doorway */}
      {/* Left section */}
      <mesh
        position={[-(w / 4 + DOOR.w / 4), h / 2, d / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[w / 2 - DOOR.w / 2, h, 0.4]} />
        <meshStandardMaterial {...mat(stoneColor, 0.85)} />
      </mesh>
      {/* Right section */}
      <mesh
        position={[w / 4 + DOOR.w / 4, h / 2, d / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[w / 2 - DOOR.w / 2, h, 0.4]} />
        <meshStandardMaterial {...mat(stoneColor, 0.85)} />
      </mesh>
      {/* Lintel above door */}
      <mesh
        position={[0, DOOR.h + (h - DOOR.h) / 2, d / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[DOOR.w, h - DOOR.h, 0.4]} />
        <meshStandardMaterial {...mat(stoneColor, 0.85)} />
      </mesh>

      {/* Gold frieze band at top of all walls (original mode) */}
      {isOriginal && (
        <>
          <mesh position={[0, h - 0.25, -d / 2 + 0.21]}>
            <boxGeometry args={[w, 0.25, 0.02]} />
            <meshStandardMaterial color={trimColor} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[-w / 2 + 0.21, h - 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[d, 0.25, 0.02]} />
            <meshStandardMaterial color={trimColor} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[w / 2 - 0.21, h - 0.25, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[d, 0.25, 0.02]} />
            <meshStandardMaterial color={trimColor} roughness={0.3} metalness={0.7} />
          </mesh>
        </>
      )}

      {/* Four pillars */}
      {(
        [
          [-3.8, 0, -3],
          [3.8, 0, -3],
          [-3.8, 0, 2.5],
          [3.8, 0, 2.5],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <Pillar key={i} position={pos} isOriginal={isOriginal} />
      ))}

      {/* Sarcophagus platform */}
      <SarcophagusPlatform isOriginal={isOriginal} />

      {/* God statue niches (shallow alcoves in back wall) */}
      {isOriginal && (
        <>
          <mesh position={[-5.5, 2, -d / 2 + 0.05]}>
            <boxGeometry args={[1.2, 2.5, 0.3]} />
            <meshStandardMaterial color="#1A1408" roughness={0.9} />
          </mesh>
          <mesh position={[5.5, 2, -d / 2 + 0.05]}>
            <boxGeometry args={[1.2, 2.5, 0.3]} />
            <meshStandardMaterial color="#1A1408" roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  )
}

// ─── Entrance Corridor ────────────────────────────────────────────────────────
function Corridor({ isOriginal }: { isOriginal: boolean }) {
  const stoneColor = isOriginal ? '#B89040' : '#4A3820'
  const w = CORRIDOR.w
  const h = CORRIDOR.h
  const d = CORRIDOR.d
  const midZ = CHAMBER.d / 2 + d / 2 // center of corridor along z

  const mat = (color: string) => ({ color, roughness: 0.9, metalness: 0.0 })

  return (
    <group position={[0, 0, midZ]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial {...mat(isOriginal ? '#9A7838' : '#3A2E18')} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial {...mat(stoneColor)} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[d, h, 0.3]} />
        <meshStandardMaterial {...mat(stoneColor)} />
      </mesh>
      {/* Right wall */}
      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[d, h, 0.3]} />
        <meshStandardMaterial {...mat(stoneColor)} />
      </mesh>
      {/* Entrance wall (end of corridor, z = d/2) — archway */}
      <mesh position={[-(w / 4 + 0.2), h / 2, d / 2]} receiveShadow castShadow>
        <boxGeometry args={[w / 2 - 0.6, h, 0.5]} />
        <meshStandardMaterial {...mat(stoneColor)} />
      </mesh>
      <mesh position={[w / 4 + 0.2, h / 2, d / 2]} receiveShadow castShadow>
        <boxGeometry args={[w / 2 - 0.6, h, 0.5]} />
        <meshStandardMaterial {...mat(stoneColor)} />
      </mesh>
      <mesh position={[0, h - 0.5, d / 2]} receiveShadow castShadow>
        <boxGeometry args={[w, 1.0, 0.5]} />
        <meshStandardMaterial {...mat(stoneColor)} />
      </mesh>

      {/* Carved relief blocks on corridor walls (original mode) */}
      {isOriginal &&
        [-3.5, -1.5, 0.5, 2.5].map((z, i) => (
          <group key={i}>
            <mesh position={[-w / 2 + 0.18, 1.2, z]}>
              <boxGeometry args={[0.06, 1.0, 0.55]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[w / 2 - 0.18, 1.2, z]}>
              <boxGeometry args={[0.06, 1.0, 0.55]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.4} metalness={0.6} />
            </mesh>
          </group>
        ))}
    </group>
  )
}

// ─── Cross-Section Controller ─────────────────────────────────────────────────
// Applies a global renderer clipping plane when cross-section mode is enabled
function CrossSectionController() {
  const { gl } = useThree()
  const crossSectionMode = useStore((s) => s.crossSectionMode)

  useEffect(() => {
    // Clip along z=2 plane — shows front half of tomb cut away
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 2)
    gl.clippingPlanes = crossSectionMode ? [plane] : []
    gl.localClippingEnabled = crossSectionMode
    return () => {
      gl.clippingPlanes = []
      gl.localClippingEnabled = false
    }
  }, [crossSectionMode, gl])

  return null
}

// ─── Guided Tour Camera Controller ───────────────────────────────────────────
function GuidedTourController() {
  const { guidedTourMode, currentTourStop, setCurrentChamber } = useStore()
  const { camera } = useThree()
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, 8))
  const arrived = useRef(false)

  useEffect(() => {
    arrived.current = false
  }, [currentTourStop])

  useFrame((_, delta) => {
    if (!guidedTourMode) return
    const stop = TOUR_STOPS[currentTourStop]

    const targetPos = new THREE.Vector3(...stop.position)
    const targetLook = new THREE.Vector3(...stop.target)

    camera.position.lerp(targetPos, delta * 1.4)
    currentLookAt.current.lerp(targetLook, delta * 1.4)
    camera.lookAt(currentLookAt.current)

    setCurrentChamber(stop.chamber)
  })

  return null
}

// ─── First-Person Movement ────────────────────────────────────────────────────
function FirstPersonMovement() {
  const { cameraMode } = useStore()
  const { camera } = useThree()
  const keys = useRef(new Set<string>())

  useEffect(() => {
    if (cameraMode !== 'firstperson') return
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase())
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase())
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [cameraMode])

  useFrame((_, delta) => {
    if (cameraMode !== 'firstperson') return
    const speed = 4 * delta
    const dir = new THREE.Vector3()
    if (keys.current.has('w') || keys.current.has('arrowup')) dir.z -= speed
    if (keys.current.has('s') || keys.current.has('arrowdown')) dir.z += speed
    if (keys.current.has('a') || keys.current.has('arrowleft')) dir.x -= speed
    if (keys.current.has('d') || keys.current.has('arrowright')) dir.x += speed

    dir.applyEuler(new THREE.Euler(0, camera.rotation.y, 0))
    dir.y = 0

    camera.position.add(dir)
    // Clamp camera to tomb bounds
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -7.5, 7.5)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -7.5, 17)
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1.2, 4.5)
  })

  return null
}

// ─── Orbit Controls with Reset ────────────────────────────────────────────────
function OrbitControlsWithReset() {
  const controlsRef = useRef<any>(null)
  const { cameraResetTick, guidedTourMode, cameraMode } = useStore()
  const { camera } = useThree()

  useEffect(() => {
    if (!controlsRef.current) return
    camera.position.set(0, 3, 14)
    controlsRef.current.target.set(0, 1.5, 0)
    controlsRef.current.update()
  }, [cameraResetTick, camera])

  if (cameraMode !== 'orbit') return null

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!guidedTourMode}
      makeDefault
      minDistance={2}
      maxDistance={20}
      maxPolarAngle={Math.PI * 0.88}
      target={[0, 1.5, 0]}
    />
  )
}

// ─── Tomb Lighting Setup ──────────────────────────────────────────────────────
function TombLighting({
  torchIntensity,
  ambientIntensity,
}: {
  torchIntensity: number
  ambientIntensity: number
}) {
  const isOriginal = useStore((s) => s.reconstructionMode === 'original')

  return (
    <>
      {/* Global ambient — very dim for atmosphere */}
      <ambientLight intensity={ambientIntensity} color="#301A05" />

      {/* Chamber torches — 4 wall positions */}
      <TorchEffect position={[-7.6, 2.2, -3]} rotation={[0, Math.PI / 2, 0]} intensity={torchIntensity} />
      <TorchEffect position={[7.6, 2.2, -3]} rotation={[0, -Math.PI / 2, 0]} intensity={torchIntensity} />
      <TorchEffect position={[-7.6, 2.2, 3]} rotation={[0, Math.PI / 2, 0]} intensity={torchIntensity} />
      <TorchEffect position={[7.6, 2.2, 3]} rotation={[0, -Math.PI / 2, 0]} intensity={torchIntensity} />

      {/* Corridor torches */}
      <TorchEffect position={[-1.3, 2.0, 11]} rotation={[0, Math.PI / 2, 0]} intensity={torchIntensity * 0.7} />
      <TorchEffect position={[1.3, 2.0, 11]} rotation={[0, -Math.PI / 2, 0]} intensity={torchIntensity * 0.7} />
      <TorchEffect position={[-1.3, 2.0, 16]} rotation={[0, Math.PI / 2, 0]} intensity={torchIntensity * 0.7} />
      <TorchEffect position={[1.3, 2.0, 16]} rotation={[0, -Math.PI / 2, 0]} intensity={torchIntensity * 0.7} />

      {/* Sarcophagus accent light (original mode — divine golden glow) */}
      {isOriginal && (
        <pointLight color="#D4AF37" intensity={1.2} distance={5} decay={2} position={[0, 3.5, -1.5]} />
      )}

      {/* Deep chamber atmosphere light */}
      <pointLight color="#200D03" intensity={0.3} distance={20} position={[0, 4, -7]} />
    </>
  )
}

// ─── Scene Interior ───────────────────────────────────────────────────────────
// Everything that needs access to the R3F context
function SceneInterior() {
  const { cameraMode, guidedTourMode, reconstructionMode, crossSectionMode } = useStore()
  const isOriginal = reconstructionMode === 'original'

  const { torchIntensity, ambientIntensity, fogDensity, bloomIntensity, bloomThreshold } =
    useControls('Tomb Settings', {
      torchIntensity: { value: 2.8, min: 0, max: 6, label: 'Torch Intensity' },
      ambientIntensity: { value: 0.06, min: 0, max: 0.5, label: 'Ambient Light' },
      fogDensity: { value: 0.04, min: 0.01, max: 0.15, label: 'Fog Density' },
      bloomIntensity: { value: 1.4, min: 0, max: 3, label: 'Bloom Intensity' },
      bloomThreshold: { value: 0.8, min: 0, max: 1, label: 'Bloom Threshold' },
    })

  return (
    <>
      {/* Atmospheric fog */}
      <fogExp2 attach="fog" color="#120800" density={fogDensity} />

      {/* Cross-section clipping */}
      <CrossSectionController />

      {/* Tour camera controller */}
      <GuidedTourController />

      {/* FP movement handler */}
      <FirstPersonMovement />

      {/* Camera controls */}
      <OrbitControlsWithReset />

      {cameraMode === 'firstperson' && (
        <PointerLockControls />
      )}

      {/* Lighting */}
      <TombLighting torchIntensity={torchIntensity} ambientIntensity={ambientIntensity} />

      {/* Room geometry */}
      <MainChamber isOriginal={isOriginal} crossSection={crossSectionMode} />
      <Corridor isOriginal={isOriginal} />

      {/* All interactive artifacts */}
      {ARTIFACTS.map((artifact) => (
        <Artifact3D key={artifact.id} artifact={artifact} />
      ))}

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>
    </>
  )
}

// ─── Main Scene Export ────────────────────────────────────────────────────────
export default function Scene() {
  const { setSelectedArtifact } = useStore()

  const handleCanvasClick = useCallback(() => {
    // Deselect when clicking on empty space (caught by mesh handlers via stopPropagation)
    setSelectedArtifact(null)
  }, [setSelectedArtifact])

  return (
    <Canvas
      shadows
      camera={{ position: [0, 3, 14], fov: 65, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
        shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } as any,
      }}
      className="w-full h-full"
      onClick={handleCanvasClick}
    >
      <SceneInterior />
    </Canvas>
  )
}
