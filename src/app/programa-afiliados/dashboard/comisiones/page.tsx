'use client'

import { useState } from 'react'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAffiliateCommissions } from '@/src/domains/affiliates/hooks/use-affiliate-dashboard.hooks'
import { CommissionsTable } from '@/src/domains/affiliates/components/dashboard/CommissionsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { Button } from '@/src/shared/components/UI/button'
import type { CommissionStatus } from '@/src/domains/affiliates/types/affiliate-dashboard.types'

const LIMIT = 10

const STATUS_FILTERS: { label: string; value: CommissionStatus | undefined }[] = [
  { label: 'Todas', value: undefined },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Aprobadas', value: 'approved' },
  { label: 'Pagadas', value: 'paid' },
  { label: 'Rechazadas', value: 'rejected' },
]

export default function AffiliateCommissionsPage() {
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<CommissionStatus | undefined>(undefined)
  const { data, isLoading } = useAffiliateCommissions(LIMIT, page * LIMIT, status)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter.label}
            size="sm"
            variant={status === filter.value ? 'default' : 'outline'}
            onClick={() => {
              setStatus(filter.value)
              setPage(0)
            }}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de comisiones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CommissionsTable commissions={data?.data ?? []} />
              {data && data.total > LIMIT && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-xs text-muted-foreground">
                    Página {page + 1} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page + 1 >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
