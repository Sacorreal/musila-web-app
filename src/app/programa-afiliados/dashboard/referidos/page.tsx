'use client'

import { useState } from 'react'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAffiliateReferrals } from '@/src/domains/affiliates/hooks/use-affiliate-dashboard.hooks'
import { ReferralsTable } from '@/src/domains/affiliates/components/dashboard/ReferralsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { Button } from '@/src/shared/components/UI/button'

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
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <ReferralsTable referrals={data?.data ?? []} />
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
