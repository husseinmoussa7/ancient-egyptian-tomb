import { create } from 'zustand'
import type { ArtifactData } from '../data/artifacts'

export type CameraMode = 'orbit' | 'firstperson'
export type ReconstructionMode = 'discovered' | 'original'

export interface TourStop {
  position: [number, number, number]
  target: [number, number, number]
  narration: string
  chamber: number
  title: string
}

export const TOUR_STOPS: TourStop[] = [
  {
    position: [0, 2.2, 15],
    target: [0, 1.5, 8],
    narration:
      'Welcome to the Royal Tomb of Pharaoh Amenhotep III. You stand at the entrance corridor, sealed for over 3,300 years. The air is thick with the weight of eternity...',
    chamber: 1,
    title: 'The Entrance',
  },
  {
    position: [0, 2, 10],
    target: [0, 1, 0],
    narration:
      'This narrow corridor was deliberately built to confuse grave robbers. Ancient builders incorporated false passages and hidden shafts. Torch-lit walls were once covered in brilliant painted reliefs...',
    chamber: 1,
    title: 'The Corridor',
  },
  {
    position: [-4, 3, 4],
    target: [0, 1.5, 0],
    narration:
      "The main burial chamber stretches before you — 16 meters across. Four massive sandstone pillars support a ceiling painted with the night sky. The air shimmers with the memory of incense...",
    chamber: 3,
    title: 'The Burial Chamber',
  },
  {
    position: [0, 2.5, 1],
    target: [0, 0.5, -1.5],
    narration:
      "At the center rests the royal sarcophagus — layers of gilded wood and stone encasing the pharaoh within. 87 kilograms of gold leaf cover its surface, carved with the face of the divine king...",
    chamber: 3,
    title: 'The Sarcophagus',
  },
  {
    position: [4, 2, 0],
    target: [2.4, 0.5, -0.5],
    narration:
      "These four alabaster canopic jars stand guard near the sarcophagus. Each holds a different organ of the pharaoh, protected by a son of Horus. The liver, lungs, stomach, and intestines await resurrection...",
    chamber: 3,
    title: 'The Canopic Jars',
  },
  {
    position: [-2, 3, -4],
    target: [0, 1.5, -7.2],
    narration:
      "The great statue of Anubis, god of embalming, watches eternally over this sacred space. His black obsidian eyes have seen three thousand years pass. He weighs all souls against the feather of Ma'at...",
    chamber: 3,
    title: 'Anubis, Lord of the Dead',
  },
  {
    position: [5, 2.5, -3],
    target: [6.5, 0.5, -5],
    narration:
      "This royal treasure chest once held the pharaoh's most prized possessions — jewelry, amulets, and ritual objects. Everything the king would need to live in comfort through eternity...",
    chamber: 3,
    title: 'The Royal Treasures',
  },
]

interface StoreState {
  // Artifact interaction
  selectedArtifact: ArtifactData | null
  hoveredArtifactId: string | null
  setSelectedArtifact: (artifact: ArtifactData | null) => void
  setHoveredArtifactId: (id: string | null) => void

  // Mode toggles
  reconstructionMode: ReconstructionMode
  crossSectionMode: boolean
  guidedTourMode: boolean
  cameraMode: CameraMode
  soundEnabled: boolean

  setReconstructionMode: (mode: ReconstructionMode) => void
  setCrossSectionMode: (enabled: boolean) => void
  setGuidedTourMode: (enabled: boolean) => void
  setCameraMode: (mode: CameraMode) => void
  setSoundEnabled: (enabled: boolean) => void

  // Guided tour state
  currentTourStop: number
  setCurrentTourStop: (stop: number) => void
  nextTourStop: () => void
  prevTourStop: () => void

  // Chamber tracking
  currentChamber: number
  setCurrentChamber: (chamber: number) => void

  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Camera reset trigger
  cameraResetTick: number
  triggerCameraReset: () => void
}

export const useStore = create<StoreState>((set, get) => ({
  selectedArtifact: null,
  hoveredArtifactId: null,
  setSelectedArtifact: (artifact) => set({ selectedArtifact: artifact }),
  setHoveredArtifactId: (id) => set({ hoveredArtifactId: id }),

  reconstructionMode: 'original',
  crossSectionMode: false,
  guidedTourMode: false,
  cameraMode: 'orbit',
  soundEnabled: false,

  setReconstructionMode: (mode) => set({ reconstructionMode: mode }),
  setCrossSectionMode: (enabled) => set({ crossSectionMode: enabled }),
  setGuidedTourMode: (enabled) => {
    set({ guidedTourMode: enabled, currentTourStop: 0 })
  },
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  currentTourStop: 0,
  setCurrentTourStop: (stop) => set({ currentTourStop: stop }),
  nextTourStop: () => {
    const { currentTourStop } = get()
    if (currentTourStop < TOUR_STOPS.length - 1) {
      set({ currentTourStop: currentTourStop + 1 })
    } else {
      set({ guidedTourMode: false, currentTourStop: 0 })
    }
  },
  prevTourStop: () => {
    const { currentTourStop } = get()
    if (currentTourStop > 0) {
      set({ currentTourStop: currentTourStop - 1 })
    }
  },

  currentChamber: 1,
  setCurrentChamber: (chamber) => set({ currentChamber: chamber }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  cameraResetTick: 0,
  triggerCameraReset: () => set((s) => ({ cameraResetTick: s.cameraResetTick + 1 })),
}))
