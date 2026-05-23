// Artifact3D — reusable interactive artifact component
// Each artifact has hover glow, click selection, floating label, and pulse animation
//
// ─── HOW TO SWAP IN A REAL GLTF MODEL ────────────────────────────────────────
//
//  1. Download a .glb from Sketchfab (free Egyptian models work great).
//     Put it in /public/models/my_artifact.glb
//
//  2. Add this import at the top of this file:
//       import { useGLTF } from '@react-three/drei'
//
//  3. Find the model function you want to replace below (e.g. CanopicJarModel)
//     and swap its body with:
//
//       function CanopicJarModel({ emissive, emissiveIntensity }: ModelProps) {
//         const { scene } = useGLTF('/models/canopic_jar.glb')
//         const clone = useMemo(() => scene.clone(true), [scene])
//         // Apply hover/selection glow to every mesh in the model
//         useMemo(() => {
//           clone.traverse((obj) => {
//             if ((obj as THREE.Mesh).isMesh) {
//               const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial
//               mat.emissive = new THREE.Color(emissive)
//               mat.emissiveIntensity = emissiveIntensity
//             }
//           })
//         }, [clone, emissive, emissiveIntensity])
//         return <primitive object={clone} />
//       }
//       // Preload so the model is ready before the user clicks:
//       useGLTF.preload('/models/canopic_jar.glb')
//
//  4. Repeat for each model type: SarcophagusModel, AnubisStatueModel,
//     TreasureChestModel, AmuletModel, ScarabModel, ShabtiModel, ScrollModel.
//
//  The MODEL_COMPONENTS registry at the bottom of this file maps artifact.modelType
//  → component, so a swap there is the only other change needed.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useMemo } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { ArtifactData } from '../../data/artifacts'

// ─── Individual Model Components ─────────────────────────────────────────────

interface ModelProps {
  color: string
  emissive: string
  emissiveIntensity: number
  isOriginal: boolean
  roughness?: number
  metalness?: number
}

function CanopicJarModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const mat = { color, emissive, emissiveIntensity, roughness: 0.35, metalness: 0.1 }
  const goldMat = { color: '#D4AF37', roughness: 0.25, metalness: 0.9 }

  return (
    <group>
      {/* Jar body — slightly wider at base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.38, 14]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.1, 12]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Lid (human/animal head) */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial
          color={isOriginal ? '#D4C090' : '#9A8C70'}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity * 0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Gold band ring */}
      {isOriginal && (
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.11, 0.015, 8, 24]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>
      )}
      {/* Hieroglyph column (simplified as thin strip) */}
      {isOriginal && (
        <mesh position={[0, 0, 0.11]}>
          <boxGeometry args={[0.04, 0.3, 0.01]} />
          <meshStandardMaterial color="#CC2200" roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

function SarcophagusModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const mat = { color, emissive, emissiveIntensity, roughness: isOriginal ? 0.25 : 0.75, metalness: isOriginal ? 0.8 : 0.2 }
  const goldMat = { color: '#D4AF37', roughness: 0.2, metalness: 0.95, emissive, emissiveIntensity: emissiveIntensity * 0.5 }

  return (
    <group>
      {/* Stone/gold base platform */}
      <mesh position={[0, -0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.05, 0.12, 2.5]} />
        <meshStandardMaterial
          color={isOriginal ? '#C4A35A' : '#5C4A32'}
          roughness={0.7}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity * 0.3}
        />
      </mesh>
      {/* Main coffin body */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.22, 2.3]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Coffin lid — slightly raised and narrower at foot */}
      <mesh position={[0, 0.33, 0]} castShadow>
        <boxGeometry args={[0.85, 0.28, 2.2]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Pharaoh face mask */}
      <mesh position={[0, 0.52, 0.88]} castShadow>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={isOriginal ? '#FFE060' : '#A88040'}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={isOriginal ? 0.7 : 0.1}
        />
      </mesh>
      {/* Nemes headdress stripes — lapis blue */}
      {isOriginal && (
        <>
          <mesh position={[-0.22, 0.5, 0.65]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.08, 0.3, 0.7]} />
            <meshStandardMaterial color="#1E3A8A" roughness={0.5} />
          </mesh>
          <mesh position={[0.22, 0.5, 0.65]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.08, 0.3, 0.7]} />
            <meshStandardMaterial color="#1E3A8A" roughness={0.5} />
          </mesh>
        </>
      )}
      {/* Gold cross-bands decoration */}
      {isOriginal && (
        <>
          <mesh position={[0, 0.47, 0]}>
            <boxGeometry args={[0.88, 0.03, 0.03]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
          <mesh position={[0, 0.47, 0.5]}>
            <boxGeometry args={[0.88, 0.03, 0.03]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
          <mesh position={[0, 0.47, -0.5]}>
            <boxGeometry args={[0.88, 0.03, 0.03]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
          {/* Collar pectoral */}
          <mesh position={[0, 0.5, 0.7]}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
          </mesh>
        </>
      )}
    </group>
  )
}

function AnubisStatueModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const darkMat = {
    color,
    roughness: 0.5,
    metalness: 0.4,
    emissive,
    emissiveIntensity,
  }
  const goldMat = { color: '#D4AF37', roughness: 0.2, metalness: 0.9 }

  return (
    <group>
      {/* Base plinth */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.1, 0.9]} />
        <meshStandardMaterial color="#2A1F0F" roughness={0.8} />
      </mesh>
      {/* Body — rectangular torso */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.5, 1.3, 0.28]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      {/* Legs (simplified block) */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.35]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.38, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.22, 10]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      {/* Head (jackal — elongated) */}
      <mesh position={[0, 1.62, 0.04]} castShadow>
        <boxGeometry args={[0.32, 0.44, 0.38]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 1.5, 0.32]} castShadow>
        <boxGeometry args={[0.16, 0.13, 0.38]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      {/* Pointed ears */}
      <mesh position={[-0.16, 1.94, -0.04]} rotation={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[0.09, 0.38, 0.08]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      <mesh position={[0.16, 1.94, -0.04]} rotation={[0, 0, 0.18]} castShadow>
        <boxGeometry args={[0.09, 0.38, 0.08]} />
        <meshStandardMaterial {...darkMat} />
      </mesh>
      {/* Obsidian eye detail */}
      <mesh position={[-0.1, 1.65, 0.2]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[0.1, 1.65, 0.2]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Gold collar */}
      {isOriginal && (
        <>
          <mesh position={[0, 1.2, 0.16]}>
            <torusGeometry args={[0.23, 0.04, 8, 24, Math.PI * 0.8]} rotation={[Math.PI * 0.5, 0, 0]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
          {/* Flail/crook */}
          <mesh position={[0.28, 0.9, 0.16]} rotation={[0.4, 0, 0.5]}>
            <cylinderGeometry args={[0.018, 0.018, 0.55, 8]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
        </>
      )}
      {/* Rim light for statue — placed inside model so it lights from behind */}
      <pointLight color="#4444AA" intensity={0.8} distance={4} decay={2} position={[0, 1, -0.5]} />
    </group>
  )
}

function TreasureChestModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const woodMat = { color, roughness: 0.8, metalness: 0.0, emissive, emissiveIntensity }
  const goldMat = { color: '#D4AF37', roughness: 0.2, metalness: 0.9 }
  const gemMat = { color: '#CC2244', roughness: 0.1, metalness: 0.0, emissive: '#440011', emissiveIntensity: 0.3 }

  return (
    <group>
      {/* Chest base */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.44, 0.6]} />
        <meshStandardMaterial {...woodMat} />
      </mesh>
      {/* Lid — slightly open */}
      <mesh position={[0, 0.53, -0.2]} rotation={[-0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.1, 0.62]} />
        <meshStandardMaterial {...woodMat} />
      </mesh>
      {/* Gold corner reinforcements */}
      {isOriginal && (
        <>
          {[[-0.42, 0, 0.28], [0.42, 0, 0.28], [-0.42, 0, -0.28], [0.42, 0, -0.28]].map(
            ([x, _, z], i) => (
              <mesh key={i} position={[x, 0.22, z]} castShadow>
                <boxGeometry args={[0.06, 0.48, 0.06]} />
                <meshStandardMaterial {...goldMat} />
              </mesh>
            )
          )}
          {/* Gold trim band */}
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.92, 0.06, 0.62]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
          {/* Lock clasp */}
          <mesh position={[0, 0.47, 0.32]}>
            <boxGeometry args={[0.1, 0.08, 0.04]} />
            <meshStandardMaterial {...goldMat} />
          </mesh>
          {/* Gem on lid */}
          <mesh position={[0, 0.6, 0.08]}>
            <octahedronGeometry args={[0.04]} />
            <meshStandardMaterial {...gemMat} />
          </mesh>
        </>
      )}
    </group>
  )
}

function AmuletModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const mat = {
    color,
    roughness: 0.3,
    metalness: 0.2,
    emissive: isOriginal ? color : emissive,
    emissiveIntensity: isOriginal ? 0.3 + emissiveIntensity : emissiveIntensity,
  }
  const goldMat = { color: '#D4AF37', roughness: 0.2, metalness: 0.9 }

  return (
    <group>
      {/* Stone display plinth */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
        <meshStandardMaterial color="#3C3020" roughness={0.9} />
      </mesh>
      {/* Eye shape — central oval */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Eye center (pupil) */}
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.1} metalness={0.5} />
      </mesh>
      {/* Decorative upper extension (eyebrow) */}
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.22, 0.04, 0.03]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Lower tear drop extension */}
      <mesh position={[0.08, -0.1, 0]} rotation={[0, 0, 0.6]} castShadow>
        <boxGeometry args={[0.14, 0.04, 0.03]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Gold mount/frame */}
      {isOriginal && (
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.16, 0.025, 8, 24]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>
      )}
    </group>
  )
}

function ScarabModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const mat = {
    color,
    roughness: 0.35,
    metalness: 0.1,
    emissive,
    emissiveIntensity,
  }
  const goldMat = { color: '#D4AF37', roughness: 0.2, metalness: 0.9 }

  return (
    <group>
      {/* Display plinth */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
        <meshStandardMaterial color="#3C3020" roughness={0.9} />
      </mesh>
      {/* Scarab body (oval) */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 12]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Wing cases (elytra) */}
      <mesh position={[-0.08, 0.04, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh position={[0.08, 0.04, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.1, 0.06, 0.24]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Head pronotum */}
      <mesh position={[0, 0.06, 0.12]} castShadow>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Legs (simplified) */}
      {[-0.1, 0, 0.1].map((z, i) => (
        <mesh key={i} position={[-0.18, 0, z]} rotation={[0, 0, 0.8]}>
          <cylinderGeometry args={[0.01, 0.01, 0.16, 6]} />
          <meshStandardMaterial color="#1A4A10" roughness={0.7} />
        </mesh>
      ))}
      {[-0.1, 0, 0.1].map((z, i) => (
        <mesh key={`r${i}`} position={[0.18, 0, z]} rotation={[0, 0, -0.8]}>
          <cylinderGeometry args={[0.01, 0.01, 0.16, 6]} />
          <meshStandardMaterial color="#1A4A10" roughness={0.7} />
        </mesh>
      ))}
      {/* Gold mount */}
      {isOriginal && (
        <mesh position={[0, 0.04, 0]}>
          <torusGeometry args={[0.17, 0.025, 8, 24]} />
          <meshStandardMaterial {...goldMat} />
        </mesh>
      )}
    </group>
  )
}

function ShabtiModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const mat = { color, roughness: 0.5, metalness: 0.05, emissive, emissiveIntensity }

  // Render a cluster of 5 shabti figures
  const positions: [number, number, number][] = [
    [0, 0, 0],
    [-0.2, 0, 0.1],
    [0.2, 0, 0.1],
    [-0.1, 0, -0.2],
    [0.1, 0, -0.18],
  ]

  return (
    <group>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]} rotation={[0, (i * Math.PI) / 3, 0]}>
          {/* Mummy body */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.055, 0.065, 0.36, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshStandardMaterial {...mat} />
          </mesh>
          {/* Crossed arms (thin strip) */}
          {isOriginal && (
            <mesh position={[0, 0.28, 0.045]}>
              <boxGeometry args={[0.1, 0.03, 0.02]} />
              <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.7} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function ScrollModel({ color, emissive, emissiveIntensity, isOriginal }: ModelProps) {
  const mat = { color, roughness: 0.8, metalness: 0.0, emissive, emissiveIntensity }
  const redMat = { color: '#AA2200', roughness: 0.6 }
  const blueMat = { color: '#1E3A8A', roughness: 0.5 }

  return (
    <group>
      {/* Scroll body (papyrus roll) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.6, 16]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* End caps (wooden rollers) */}
      <mesh position={[-0.32, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 10]} />
        <meshStandardMaterial color="#6B4220" roughness={0.7} />
      </mesh>
      <mesh position={[0.32, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 10]} />
        <meshStandardMaterial color="#6B4220" roughness={0.7} />
      </mesh>
      {/* Partially unrolled section */}
      {isOriginal && (
        <>
          <mesh position={[0.2, -0.1, 0.12]} rotation={[-0.6, 0.2, 0]}>
            <planeGeometry args={[0.25, 0.22]} />
            <meshStandardMaterial {...mat} side={THREE.DoubleSide} />
          </mesh>
          {/* Painted vignettes (red + blue symbols) */}
          <mesh position={[0.2, -0.1, 0.135]} rotation={[-0.6, 0.2, 0]}>
            <planeGeometry args={[0.06, 0.06]} />
            <meshStandardMaterial {...redMat} />
          </mesh>
          <mesh position={[0.26, -0.14, 0.14]} rotation={[-0.6, 0.2, 0]}>
            <planeGeometry args={[0.05, 0.05]} />
            <meshStandardMaterial {...blueMat} />
          </mesh>
        </>
      )}
    </group>
  )
}

// ─── Model registry ───────────────────────────────────────────────────────────

const MODEL_COMPONENTS: Record<string, React.FC<ModelProps>> = {
  canopicJar: CanopicJarModel,
  sarcophagus: SarcophagusModel,
  statue: AnubisStatueModel,
  chest: TreasureChestModel,
  amulet: AmuletModel,
  shabti: ShabtiModel,
  scroll: ScrollModel,
  scarab: ScarabModel,
}

// ─── Main Artifact3D Component ────────────────────────────────────────────────

interface Artifact3DProps {
  artifact: ArtifactData
}

export default function Artifact3D({ artifact }: Artifact3DProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const {
    selectedArtifact,
    hoveredArtifactId,
    setSelectedArtifact,
    setHoveredArtifactId,
    reconstructionMode,
  } = useStore()

  const isSelected = selectedArtifact?.id === artifact.id
  const isHovered = hoveredArtifactId === artifact.id
  const isOriginal = reconstructionMode === 'original'

  // Pulse scale animation on hover/selection
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    if (isHovered || isSelected) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 3.5) * 0.025
      groupRef.current.scale.setScalar(pulse)
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedArtifact(isSelected ? null : artifact)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHoveredArtifactId(artifact.id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHoveredArtifactId(null)
    document.body.style.cursor = 'auto'
  }

  const color = isOriginal ? artifact.color : artifact.discoveredColor
  const emissive = isSelected ? artifact.glowColor : isHovered ? artifact.glowColor : '#000000'
  const emissiveIntensity = isSelected ? 0.7 : isHovered ? 0.35 : 0

  const ModelComponent = MODEL_COMPONENTS[artifact.modelType]

  return (
    <group
      ref={groupRef}
      position={artifact.position}
      rotation={artifact.rotation ?? [0, 0, 0]}
      scale={artifact.scale ?? 1}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 3D model geometry */}
      {ModelComponent && (
        <ModelComponent
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          isOriginal={isOriginal}
        />
      )}

      {/* Golden point light when hovered/selected */}
      {(isHovered || isSelected) && (
        <pointLight
          color={artifact.glowColor}
          intensity={isSelected ? 2.0 : 1.0}
          distance={3.5}
          decay={2}
        />
      )}

      {/* Hover label — always faces camera via Html component */}
      {isHovered && !isSelected && (
        <Html
          center
          distanceFactor={12}
          position={[0, 0.8, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="hover-label-3d">{artifact.name}</div>
        </Html>
      )}

      {/* Selection ring indicator on ground */}
      {isSelected && (
        <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.56, 32]} />
          <meshBasicMaterial color={artifact.glowColor} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
