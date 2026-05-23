// RightPanel — detailed artifact information panel (slides in when artifact is selected)
import { useStore } from '../../store/useStore'
import { CATEGORY_COLORS } from '../../data/artifacts'

const MODEL_ICONS: Record<string, string> = {
  sarcophagus: '⚱',
  canopicJar: '🏺',
  statue: '🗿',
  chest: '📦',
  amulet: '👁',
  scarab: '🪲',
  shabti: '🧿',
  scroll: '📜',
}

// Decorative Egyptian-style section header
function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-gold/70 text-sm">{icon}</span>
      <span className="text-[9px] text-gold/70 uppercase tracking-[0.2em] font-bold">{title}</span>
      <div className="flex-1 gold-divider" />
    </div>
  )
}

export default function RightPanel() {
  const { selectedArtifact, setSelectedArtifact, sidebarOpen } = useStore()

  if (!selectedArtifact) return null

  const cat = CATEGORY_COLORS[selectedArtifact.category]
  const icon = MODEL_ICONS[selectedArtifact.modelType] ?? '◆'

  return (
    <div
      className="panel-glass absolute top-14 bottom-10 z-20 w-80 flex flex-col animate-slide-in-right"
      style={{ right: 0 }}
    >
      {/* Header band */}
      <div
        className="p-4 border-b border-gold/10 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(20,14,5,0.9) 0%, rgba(40,28,5,0.7) 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: cat.bg,
              border: `1px solid ${cat.text}44`,
              boxShadow: `0 0 16px ${cat.text}22`,
            }}
          >
            {icon}
          </div>
          {/* Close button */}
          <button
            onClick={() => setSelectedArtifact(null)}
            className="text-tomb-muted hover:text-gold transition-colors text-sm mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gold/10"
            title="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Name */}
        <h2 className="text-gold font-serif text-base font-bold leading-snug text-gold-glow mb-1">
          {selectedArtifact.name}
        </h2>

        {/* Category + period row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="category-badge"
            style={{ background: cat.bg, color: cat.text }}
          >
            {cat.label}
          </span>
          <span className="text-tomb-muted text-[9px] tracking-wide">
            {selectedArtifact.period}
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* Short description */}
        <div>
          <p className="text-tomb-text text-xs leading-relaxed font-serif italic">
            "{selectedArtifact.shortDescription}"
          </p>
        </div>

        <div className="gold-divider" />

        {/* Material */}
        <div>
          <SectionHeader icon="⬡" title="Material & Composition" />
          <p className="text-tomb-text text-xs leading-relaxed pl-5">
            {selectedArtifact.material}
          </p>
        </div>

        {/* Historical context */}
        <div>
          <SectionHeader icon="𓂀" title="Historical Context" />
          <p className="text-tomb-muted text-[11px] leading-relaxed pl-5 font-serif">
            {selectedArtifact.historicalContext}
          </p>
        </div>

        {/* Fun fact */}
        <div
          className="rounded-sm p-3 border"
          style={{
            background: 'rgba(212,175,55,0.04)',
            borderColor: 'rgba(212,175,55,0.2)',
          }}
        >
          <SectionHeader icon="✦" title="Did You Know?" />
          <p className="text-[11px] leading-relaxed pl-5 font-serif" style={{ color: '#C8A86A' }}>
            {selectedArtifact.funFact}
          </p>
        </div>

        {/* Sketchfab placeholder */}
        <div
          className="rounded-sm p-3 border border-dashed"
          style={{ borderColor: 'rgba(212,175,55,0.15)' }}
        >
          <p className="text-tomb-muted text-[9px] uppercase tracking-widest mb-1.5">3D Model</p>
          <p className="text-[10px]" style={{ color: 'rgba(212,175,55,0.4)' }}>
            Replace procedural geometry with a real GLTF from Sketchfab — search "{selectedArtifact.name}" at sketchfab.com and pass the .glb URL to{' '}
            <code className="font-mono">useGLTF()</code> in Artifact3D.tsx
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gold/10 flex-shrink-0">
        <p className="text-[9px] text-tomb-muted text-center tracking-wide">
          𓂀 &nbsp;Chamber {selectedArtifact.chamber} — New Kingdom Egypt
        </p>
      </div>
    </div>
  )
}
