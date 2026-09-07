'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Inbox } from 'lucide-react'

export interface ColumnDef<TRow> {
  key: string
  header: string
  width?: string
  render: (row: TRow) => React.ReactNode
}

/** Habilita una columna de checkboxes para selección múltiple (p. ej. acciones en lote). */
export interface RowSelection<TRow> {
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: (rows: TRow[]) => void
  /** Filas sin checkbox (p. ej. ya en un estado final que no admite la acción en lote). */
  isRowSelectable?: (row: TRow) => boolean
}

interface AdminDataTableProps<TRow> {
  columns: ColumnDef<TRow>[]
  data: TRow[]
  isLoading: boolean
  error?: string | null
  emptyMessage?: string
  keyExtractor: (row: TRow) => string
  skeletonRows?: number
  selection?: RowSelection<TRow>
}

const SELECTION_COLUMN_WIDTH = '36px'

export function AdminDataTable<TRow>({
  columns,
  data,
  isLoading,
  error,
  emptyMessage = 'No hay datos disponibles',
  keyExtractor,
  skeletonRows = 6,
  selection,
}: AdminDataTableProps<TRow>) {
  const gridTemplateColumns = [
    ...(selection ? [SELECTION_COLUMN_WIDTH] : []),
    ...columns.map((c) => c.width ?? '1fr'),
  ].join(' ')

  const selectableRows = selection ? data.filter((row) => selection.isRowSelectable?.(row) ?? true) : []
  const allSelected = selectableRows.length > 0 && selectableRows.every((row) => selection!.selectedIds.has(keyExtractor(row)))

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="grid border-b border-border bg-muted/30 px-4 py-3" style={{ gridTemplateColumns }}>
        {selection && (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border accent-primary"
            checked={allSelected}
            disabled={selectableRows.length === 0}
            onChange={() => selection.onToggleAll(selectableRows)}
            aria-label="Seleccionar todas las filas"
          />
        )}
        {columns.map((col) => (
          <span
            key={col.key}
            className="text-[11px] font-black uppercase tracking-widest text-muted-foreground"
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* Body */}
      {isLoading ? (
        <div>
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div key={i} className="grid animate-pulse border-b border-border/50 px-4 py-4 last:border-0" style={{ gridTemplateColumns }}>
              {selection && <div className="h-4 w-4 rounded bg-muted" />}
              {columns.map((col) => (
                <div key={col.key} className="h-4 w-3/4 rounded-md bg-muted" />
              ))}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive/60" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {data.map((row, index) => {
            const id = keyExtractor(row)
            const isSelectable = selection ? (selection.isRowSelectable?.(row) ?? true) : false
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                className="grid border-b border-border/50 px-4 py-4 last:border-0 hover:bg-muted/40 transition-colors"
                style={{ gridTemplateColumns }}
              >
                {selection && (
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-primary disabled:opacity-30"
                    checked={selection.selectedIds.has(id)}
                    disabled={!isSelectable}
                    onChange={() => selection.onToggleRow(id)}
                    aria-label="Seleccionar fila"
                  />
                )}
                {columns.map((col) => (
                  <div key={col.key} className="flex items-center">
                    {col.render(row)}
                  </div>
                ))}
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
    </div>
  )
}
