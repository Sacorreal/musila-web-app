import React from 'react';
import { ReferralsTable } from '@/src/domains/affiliates/components/dashboard/ReferralsTable';
import { CommissionsTable } from '@/src/domains/affiliates/components/dashboard/CommissionsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card';
import type {
  AffiliateReferralSummary,
  AffiliateCommissionSummary,
} from '@/src/domains/affiliates/types/affiliate-dashboard.types';

interface DashboardTablesGridProps {
  recentReferrals: AffiliateReferralSummary[];
  recentCommissions: AffiliateCommissionSummary[];
}

export function DashboardTablesGrid({ recentReferrals, recentCommissions }: DashboardTablesGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referidos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferralsTable referrals={recentReferrals} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comisiones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <CommissionsTable commissions={recentCommissions} />
        </CardContent>
      </Card>
    </div>
  );
}
