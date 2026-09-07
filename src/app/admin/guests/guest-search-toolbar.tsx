import { Search, X } from 'lucide-react'

interface GuestSearchToolbarProps {
  value: string
  onChange: (value: string) => void
}

export function GuestSearchToolbar({ value, onChange }: GuestSearchToolbarProps) {
  return (
    <div className="relative max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o email…"
        className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
