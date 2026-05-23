// BottomBar — chamber progress, guided tour controls, mini-map, and FP instructions
import { useStore, TOUR_STOPS } from '../../store/useStore'

// SVG top-down mini-map of the tomb layout
function MiniMap() {
  const { currentChamber } = useStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-tomb-muted text-[9px] uppercase tracking-widest">Map</span>
      <svg width="120" height="42" viewBox="0 0 120 42" className="opacity-80">
        {/* Corridor */}
        <rect
          x="50" y="2" width="20" height="20"
          fill={currentChamber === 1 ? 'rgba(212,175,55,0.25)' : 'rgba(60,40,10,0.6)'}
          stroke={currentChamber === 1 ? '#D4AF37' : '#3D2E0A'}
          strokeWidth="1"
        />
        <text x="60" y="14" textAnchor="middle" fill={currentChamber === 1 ? '#D4AF37' : '#8A7355'} fontSize="6" fontFamily="Georgia">
          Corridor
        </text>

        {/* Connection line */}
        <line x1="60" y1="22" x2="60" y2="28" stroke="#3D2E0A" strokeWidth="1" />

        {/* Main chamber */}
        <rect
          x="20" y="28" width="80" height="12"
          fill={currentChamber === 3 ? 'rgba(212,175,55,0.25)' : 'rgba(60,40,10,0.6)'}
          stroke={currentChamber === 3 ? '#D4AF37' : '#3D2E0A'}
          strokeWidth="1"
        />
        <text x="60" y="36" textAnchor="middle" fill={currentChamber === 3 ? '#D4AF37' : '#8A7355'} fontSize="6" fontFamily="Georgia">
          Burial Chamber
        </text>

        {/* Camera dot */}
        <circle cx="60" cy={currentChamber === 1 ? 12 : 34} r="2.5" fill="#FFD700" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}

// Tour stop progress dots
function TourProgress() {
  const { currentTourStop, setCurrentTourStop } = useStore()

  return (
    <div className="flex items-center gap-1.5">
      {TOUR_STOPS.map((stop, i) => (
        <button
          key={i}
          onClick={() => setCurrentTourStop(i)}
          title={stop.title}
          className="transition-all duration-200"
        >
          <div
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentTourStop ? 20 : 6,
              height: 6,
              background: i === currentTourStop
                ? '#D4AF37'
                : i < currentTourStop
                ? 'rgba(212,175,55,0.5)'
                : 'rgba(61,46,10,0.8)',
            }}
          />
        </button>
      ))}
    </div>
  )
}

export default function BottomBar() {
  const {
    guidedTourMode,
    currentTourStop,
    nextTourStop,
    prevTourStop,
    setGuidedTourMode,
    currentChamber,
    cameraMode,
  } = useStore()

  const stop = TOUR_STOPS[currentTourStop]
  const chamberName = currentChamber === 1 ? 'Entrance Corridor' : 'Main Burial Chamber'

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 h-10 flex items-center px-4 gap-4"
      style={{
        background: 'linear-gradient(0deg, rgba(10,8,6,0.98) 0%, rgba(10,8,6,0.80) 100%)',
        borderTop: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      {/* Chamber indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-gold/50 text-xs">𓂀</span>
        <span className="text-tomb-muted text-[10px] uppercase tracking-widest">{chamberName}</span>
      </div>

      <div style={{ width: 1, height: 16, background: 'rgba(212,175,55,0.2)' }} />

      {/* Mini Map */}
      <MiniMap />

      <div className="flex-1" />

      {/* First-person instructions */}
      {cameraMode === 'firstperson' && !guidedTourMode && (
        <div className="flex items-center gap-3 text-[9px] text-tomb-muted">
          <span className="px-1.5 py-0.5 rounded border border-tomb-border bg-tomb-card">Click canvas to lock</span>
          <span className="px-1.5 py-0.5 rounded border border-tomb-border bg-tomb-card">WASD</span>
          <span>to move</span>
          <span className="px-1.5 py-0.5 rounded border border-tomb-border bg-tomb-card">ESC</span>
          <span>to release</span>
        </div>
      )}

      {/* Guided tour controls */}
      {guidedTourMode && (
        <div className="flex items-center gap-3">
          {/* Narration */}
          <div
            className="tour-narration rounded-sm px-3 py-1.5 max-w-xs"
            style={{ maxWidth: 320 }}
          >
            <p className="text-[9px] text-gold/80 uppercase tracking-widest mb-0.5">
              {stop.title}
            </p>
            <p className="text-[10px] text-tomb-text leading-snug font-serif line-clamp-2">
              {stop.narration}
            </p>
          </div>

          {/* Tour progress */}
          <TourProgress />

          {/* Prev / Next */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevTourStop}
              disabled={currentTourStop === 0}
              className="mode-btn inactive disabled:opacity-30 text-[10px] px-2 py-1"
            >
              ‹ Prev
            </button>
            <button
              onClick={nextTourStop}
              className="mode-btn active text-[10px] px-2 py-1"
            >
              {currentTourStop === TOUR_STOPS.length - 1 ? 'End Tour' : 'Next ›'}
            </button>
          </div>

          {/* Stop tour */}
          <button
            onClick={() => setGuidedTourMode(false)}
            className="mode-btn inactive text-[10px] px-2 py-1"
          >
            ✕ Exit
          </button>
        </div>
      )}

      {/* Stop counter */}
      {!guidedTourMode && (
        <div className="flex-shrink-0">
          <span className="text-[9px] text-tomb-muted">
            {TOUR_STOPS.length} points of interest
          </span>
        </div>
      )}
    </div>
  )
}
