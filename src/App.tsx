// App.tsx — Root component
// Composes: 3D Canvas scene + all UI panels
// The Canvas is full-screen behind; UI panels are absolutely positioned overlays

import { Suspense } from 'react'
import { Leva } from 'leva'
import Scene from './components/3d/Scene'
import TopBar from './components/ui/TopBar'
import LeftSidebar from './components/ui/LeftSidebar'
import RightPanel from './components/ui/RightPanel'
import BottomBar from './components/ui/BottomBar'
import { useStore } from './store/useStore'

// Loading screen while R3F sets up
function LoadingScreen() {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-tomb-bg">
      <div className="text-center">
        <div className="text-5xl mb-6 animate-pulse">𓂀</div>
        <h2 className="text-gold font-serif text-xl mb-3 text-gold-glow">
          Entering the Burial Chamber
        </h2>
        <p className="text-tomb-muted text-xs tracking-widest uppercase mb-6">
          Preparing the sacred space...
        </p>
        {/* Animated progress bar */}
        <div
          className="w-48 h-0.5 mx-auto overflow-hidden"
          style={{ background: 'rgba(61,46,10,0.8)' }}
        >
          <div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              animation: 'loading-sweep 1.4s ease-in-out infinite',
              width: '60%',
            }}
          />
        </div>
        <style>{`
          @keyframes loading-sweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    </div>
  )
}

// Sound placeholder component
// Uncomment and install @react-three/drei's PositionalAudio or use Howler.js for real audio:
// import { Audio } from '@react-three/drei'
function SoundController() {
  const soundEnabled = useStore((s) => s.soundEnabled)
  // TODO: implement ambient tomb audio here
  // Suggested sounds: echoing drips, distant chants, torch crackle
  // Free sources: freesound.org search "egyptian tomb ambient"
  return null
}

export default function App() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-tomb-bg">
      {/* Leva dev panel — collapsed by default, drag to reposition */}
      <Leva collapsed titleBar={{ title: '⚙ Tomb Settings' }} />

      {/* Full-screen 3D scene */}
      <div className="absolute inset-0">
        <Suspense fallback={<LoadingScreen />}>
          <Scene />
        </Suspense>
      </div>

      {/* UI overlays — pointer-events-none on wrappers so unhandled clicks pass to canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top navigation bar */}
        <div className="pointer-events-auto">
          <TopBar />
        </div>

        {/* Left artifact sidebar */}
        <div className="pointer-events-auto">
          <LeftSidebar />
        </div>

        {/* Right detail panel */}
        <div className="pointer-events-auto">
          <RightPanel />
        </div>

        {/* Bottom status bar */}
        <div className="pointer-events-auto">
          <BottomBar />
        </div>
      </div>

      {/* Sound controller (outside canvas but inside App) */}
      <SoundController />
    </div>
  )
}
