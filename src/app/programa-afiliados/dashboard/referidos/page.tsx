'use client'

import { useState } from 'react'
import { useAffiliateReferrals } from '@/src/domains/affiliates/hooks/use-affiliate-dashboard.hooks'
import { ReferralsTable } from '@/src/domains/affiliates/components/dashboard/ReferralsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { PaginationControls } from '@/src/shared/components/UI/PaginationControls'

const LIMIT = 10

export default function AffiliateReferralsPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useAffiliateReferrals(LIMIT, page * LIMIT)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1

  return (
    <div className="max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Todos tus referidos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState className="py-16" iconClassName="w-6 h-6 text-muted-foreground" />
          ) : (
            <>
              <ReferralsTable referrals={data?.data ?? []} />
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
