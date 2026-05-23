// LeftSidebar — artifact list with 3D-card styled entries
import { useStore } from '../../store/useStore'
import { ARTIFACTS, CATEGORY_COLORS } from '../../data/artifacts'
import type { ArtifactData } from '../../data/artifacts'

// Emoji icon per model type for visual variety without images
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

function ArtifactCard({
  artifact,
  isSelected,
  isHovered,
}: {
  artifact: ArtifactData
  isSelected: boolean
  isHovered: boolean
}) {
  const { setSelectedArtifact, setHoveredArtifactId } = useStore()
  const cat = CATEGORY_COLORS[artifact.category]
  const icon = MODEL_ICONS[artifact.modelType] ?? '◆'

  return (
    <button
      className={`artifact-card w-full text-left p-3 rounded-sm cursor-pointer transition-all duration-200 ${
        isSelected ? 'selected' : ''
      } ${isHovered ? 'border-gold/30 bg-tomb-surface' : ''}`}
      style={{ background: isSelected ? 'rgba(212,175,55,0.06)' : undefined }}
      onClick={() => setSelectedArtifact(isSelected ? null : artifact)}
      onMouseEnter={() => setHoveredArtifactId(artifact.id)}
      onMouseLeave={() => setHoveredArtifactId(null)}
    >
      <div className="flex items-start gap-2.5">
        {/* Icon bubble */}
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center text-lg flex-shrink-0 mt-0.5"
          style={{ background: cat.bg, border: `1px solid ${cat.text}33` }}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name */}
          <p
            className="text-xs font-semibold truncate leading-snug"
            style={{ color: isSelected ? '#D4AF37' : '#E8D5A3' }}
          >
            {artifact.name}
          </p>

          {/* Category badge + period */}
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span
              className="category-badge"
              style={{ background: cat.bg, color: cat.text }}
            >
              {cat.label}
            </span>
          </div>

          {/* Short description preview */}
          <p className="text-[10px] text-tomb-muted mt-1 line-clamp-2 leading-relaxed">
            {artifact.shortDescription}
          </p>
        </div>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="gold-divider flex-1" />
          <span className="text-gold text-[9px] uppercase tracking-widest">Viewing Details →</span>
        </div>
      )}
    </button>
  )
}

export default function LeftSidebar() {
  const { selectedArtifact, hoveredArtifactId, sidebarOpen } = useStore()

  if (!sidebarOpen) return null

  // Group by category for better organization
  const categories = ['funerary', 'statue', 'amulet', 'religious', 'treasure'] as const

  return (
    <div className="panel-glass absolute left-0 top-14 bottom-10 z-20 w-64 flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="p-3 border-b border-gold/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gold text-sm">𓂀</span>
          <h2 className="text-gold text-xs font-bold uppercase tracking-widest">
            Chamber Artifacts
          </h2>
        </div>
        <p className="text-tomb-muted text-[10px]">
          {ARTIFACTS.length} objects catalogued — Main Burial Chamber
        </p>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {ARTIFACTS.map((artifact) => (
          <ArtifactCard
            key={artifact.id}
            artifact={artifact}
            isSelected={selectedArtifact?.id === artifact.id}
            isHovered={hoveredArtifactId === artifact.id}
          />
        ))}
      </div>

      {/* Footer hint */}
      <div className="p-2.5 border-t border-gold/10">
        <p className="text-[9px] text-tomb-muted text-center tracking-wide">
          Click artifact in list or 3D scene to inspect
        </p>
      </div>
    </div>
  )
}
