'use client'

import { useMemo, useState } from 'react'
import { History, Pencil } from 'lucide-react'
import { adminTransactionFeesHooks } from '@/src/domains/admin/transaction-fees/transaction-fees.hooks'
import type { TransactionFeeView } from '@/src/domains/admin/transaction-fees/transaction-fees.types'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { TransactionFeeDialog } from './TransactionFeeDialog'
import { TransactionFeeHistoryDialog } from './TransactionFeeHistoryDialog'

const ORG_TYPE_VARIANT = {
  LABEL: 'default',
  MANAGEMENT: 'secondary',
} as const

export default function AdminTransactionFeesPage() {
  const { data: fees, isLoading, error } = adminTransactionFeesHooks.useTransactionFees()
  const [editTarget, setEditTarget] = useState<TransactionFeeView | null>(null)
  const [historyTarget, setHistoryTarget] = useState<TransactionFeeView | null>(null)

  // Agrupa por plan para una tabla plan × tipo × comisión (§6).
  const grouped = useMemo(() => {
    const map = new Map<string, { planName: string; planKey: string; rows: TransactionFeeView[] }>()
    for (const fee of fees ?? []) {
      const group = map.get(fee.planId) ?? { planName: fee.planName, planKey: fee.planKey, rows: [] }
      group.rows.push(fee)
      map.set(fee.planId, group)
    }
    return Array.from(map.values())
  }, [fees])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comisión del Marketplace"
        description="Porcentaje que el comprador paga sobre el valor de la licencia, según el plan de su organización (solo LABEL y MANAGEMENT). Configurable sin desplegar; cada cambio queda auditado y aplica solo a nuevas operaciones."
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Error al cargar la configuración de comisiones.
        </div>
      ) : grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No hay planes de organización configurados todavía.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Tipo de organización</th>
                <th className="px-4 py-3 text-right">Comisión</th>
                <th className="px-4 py-3">Última actualización</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((group) =>
                group.rows.map((fee, index) => (
                  <tr
                    key={`${fee.planId}-${fee.organizationType}`}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      {index === 0 ? (
                        <div>
                          <p className="font-semibold">{group.planName}</p>
                          <p className="font-mono text-xs text-muted-foreground">{group.planKey}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40">↳</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ORG_TYPE_VARIANT[fee.organizationType]}>
                        {fee.organizationType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {fee.rate !== null ? (
                        <span className="text-base font-black">{fee.rate}%</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin configurar</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {fee.updatedBy ?? 'Configuración inicial'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Ver historial de ${group.planName} ${fee.organizationType}`}
                          onClick={() => setHistoryTarget(fee)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Editar comisión de ${group.planName} ${fee.organizationType}`}
                          onClick={() => setEditTarget(fee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      )}

      <TransactionFeeDialog fee={editTarget} onClose={() => setEditTarget(null)} />
      <TransactionFeeHistoryDialog target={historyTarget} onClose={() => setHistoryTarget(null)} />
    </div>
  )
}
