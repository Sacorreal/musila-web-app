'use client'

import { useState } from 'react'
import { useAffiliateCommissions } from '@/src/domains/affiliates/hooks/use-affiliate-dashboard.hooks'
import { CommissionsTable } from '@/src/domains/affiliates/components/dashboard/CommissionsTable'
import { CommissionStatusFilterBar } from '@/src/domains/affiliates/components/dashboard/CommissionStatusFilterBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { PaginationControls } from '@/src/shared/components/UI/PaginationControls'
import type { CommissionStatus } from '@/src/domains/affiliates/types/affiliate-dashboard.types'

const LIMIT = 10

export default function AffiliateCommissionsPage() {
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState<CommissionStatus | undefined>(undefined)
  const { data, isLoading } = useAffiliateCommissions(LIMIT, page * LIMIT, status)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  return (
    <div className="max-w-4xl space-y-4">
      <CommissionStatusFilterBar
        status={status}
        onChange={(value) => {
          setStatus(value)
          setPage(0)
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de comisiones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState className="py-16" iconClassName="w-6 h-6 text-muted-foreground" />
          ) : (
            <>
              <CommissionsTable commissions={data?.data ?? []} />
              {data && data.total > LIMIT && (
                <PaginationControls
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  className="mt-6"
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
