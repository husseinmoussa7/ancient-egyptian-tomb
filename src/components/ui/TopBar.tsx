// TopBar — navigation, mode toggles, and camera controls
import { useStore } from '../../store/useStore'

// Hieroglyph-style decorative separator
function Ankh() {
  return <span className="text-gold/40 mx-2 font-serif">𓂀</span>
}

export default function TopBar() {
  const {
    reconstructionMode,
    crossSectionMode,
    guidedTourMode,
    cameraMode,
    soundEnabled,
    setReconstructionMode,
    setCrossSectionMode,
    setGuidedTourMode,
    setCameraMode,
    setSoundEnabled,
    triggerCameraReset,
    sidebarOpen,
    setSidebarOpen,
  } = useStore()

  return (
    <div className="top-nav absolute top-0 left-0 right-0 z-30 flex items-center h-14 px-4 gap-3">
      {/* Logo / Title */}
      <div className="flex items-center gap-2 mr-4 flex-shrink-0">
        <span className="text-gold text-xl">𓂀</span>
        <div>
          <h1 className="text-gold font-serif text-sm font-bold leading-none tracking-wide text-gold-glow">
            ANCIENT EGYPTIAN TOMB
          </h1>
          <p className="text-tomb-muted text-[10px] tracking-widest uppercase leading-none mt-0.5">
            Explorer — 1320 BCE
          </p>
        </div>
      </div>

      <div className="gold-divider w-px h-8 bg-gold/20 flex-shrink-0" style={{ width: 1, background: 'rgba(212,175,55,0.25)' }} />

      {/* Reconstruction Mode toggle */}
      <div className="flex items-center gap-1.5">
        <span className="text-tomb-muted text-[10px] uppercase tracking-wider mr-1">Mode</span>
        <button
          className={`mode-btn ${reconstructionMode === 'original' ? 'active' : 'inactive'}`}
          onClick={() => setReconstructionMode('original')}
          title="Original 1320 BCE — vibrant colors and polished gold"
        >
          ✦ 1320 BCE Original
        </button>
        <button
          className={`mode-btn ${reconstructionMode === 'discovered' ? 'active' : 'inactive'}`}
          onClick={() => setReconstructionMode('discovered')}
          title="As discovered — weathered stone and faded paint"
        >
          ⊕ As Discovered
        </button>
      </div>

      <Ankh />

      {/* Cross Section Mode */}
      <button
        className={`mode-btn ${crossSectionMode ? 'active' : 'inactive'}`}
        onClick={() => setCrossSectionMode(!crossSectionMode)}
        title="Slice through the tomb to reveal interior construction"
      >
        ⊟ Cross Section
      </button>

      <Ankh />

      {/* Guided Tour */}
      <button
        className={`mode-btn ${guidedTourMode ? 'active' : 'inactive'}`}
        onClick={() => setGuidedTourMode(!guidedTourMode)}
        title="Guided tour with narration through key areas"
      >
        ▶ Guided Tour
      </button>

      <div className="flex-1" />

      {/* Camera mode */}
      <div className="flex items-center gap-1">
        <button
          className={`mode-btn ${cameraMode === 'orbit' ? 'active' : 'inactive'}`}
          onClick={() => setCameraMode('orbit')}
          title="Orbit camera — drag to rotate"
        >
          ↻ Orbit
        </button>
        <button
          className={`mode-btn ${cameraMode === 'firstperson' ? 'active' : 'inactive'}`}
          onClick={() => setCameraMode('firstperson')}
          title="First-person — click canvas to lock pointer, WASD to move"
        >
          👁 Walk
        </button>
      </div>

      {/* Reset Camera */}
      <button
        className="mode-btn inactive"
        onClick={triggerCameraReset}
        title="Reset camera to entrance view"
      >
        ⌂ Reset
      </button>

      {/* Sound toggle */}
      <button
        className={`mode-btn ${soundEnabled ? 'active' : 'inactive'}`}
        onClick={() => setSoundEnabled(!soundEnabled)}
        title={soundEnabled ? 'Mute ambient sounds' : 'Enable ambient echo and torch crackle'}
      >
        {soundEnabled ? '♫ Sound On' : '♪ Sound Off'}
      </button>

      {/* Sidebar toggle */}
      <button
        className="mode-btn inactive flex-shrink-0"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title="Toggle artifact list"
      >
        ☰
      </button>
    </div>
  )
}
