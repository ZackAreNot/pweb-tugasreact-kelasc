import {
  BookOpen,
  Box,
  Eraser,
  Highlighter,
  PenLine,
  Ruler,
} from 'lucide-react'

const illustrations = new Map([
  ['pulpen', [PenLine, 'bg-orange-50 text-orange-800']],
  ['buku', [BookOpen, 'bg-emerald-50 text-emerald-800']],
  ['buku tulis', [BookOpen, 'bg-emerald-50 text-emerald-800']],
  ['spidol', [Highlighter, 'bg-violet-50 text-violet-800']],
  ['penggaris', [Ruler, 'bg-amber-50 text-amber-800']],
  ['penghapus', [Eraser, 'bg-rose-50 text-rose-800']],
])

export default function ProductArt({ product, large = false }) {
  const [Icon, colors] = illustrations.get(product.name.toLowerCase()) ?? [
    Box,
    'bg-orange-50 text-orange-800',
  ]
  return (
    <div
      aria-hidden="true"
      className={`relative grid place-items-center ${large ? 'min-h-64 rounded-xl' : 'h-36'} ${colors}`}
    >
      <span className="absolute top-3 left-3 rounded bg-white/80 px-2 py-1 text-xs font-semibold">
        #{product.id}
      </span>
      <Icon size={large ? 100 : 56} strokeWidth={1.4} className="-rotate-12" />
    </div>
  )
}
