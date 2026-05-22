'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Inbox } from 'lucide-react'

export interface ColumnDef<TRow> {
  key: string
  header: string
  width?: string
  render: (row: TRow) => React.ReactNode
}

interface AdminDataTableProps<TRow> {
  columns: ColumnDef<TRow>[]
  data: TRow[]
  isLoading: boolean
  error?: string | null
  emptyMessage?: string
  keyExtractor: (row: TRow) => string
  skeletonRows?: number
}

export function AdminDataTable<TRow>({
  columns,
  data,
  isLoading,
  error,
  emptyMessage = 'No hay datos disponibles',
  keyExtractor,
  skeletonRows = 6,
}: AdminDataTableProps<TRow>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div
        className="grid border-b border-border bg-muted/30 px-4 py-3"
        style={{ gridTemplateColumns: columns.map((c) => c.width ?? '1fr').join(' ') }}
      >
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
            <div
              key={i}
              className="grid animate-pulse border-b border-border/50 px-4 py-4 last:border-0"
              style={{ gridTemplateColumns: columns.map((c) => c.width ?? '1fr').join(' ') }}
            >
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
          {data.map((row, index) => (
            <motion.div
              key={keyExtractor(row)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              className="grid border-b border-border/50 px-4 py-4 last:border-0 hover:bg-muted/40 transition-colors"
              style={{ gridTemplateColumns: columns.map((c) => c.width ?? '1fr').join(' ') }}
            >
              {columns.map((col) => (
                <div key={col.key} className="flex items-center">
                  {col.render(row)}
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}
