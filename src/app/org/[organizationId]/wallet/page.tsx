'use client';

import { use, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/src/shared/components/UI/PageHeader';
import { Button } from '@/src/shared/components/UI/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs';
import { WalletBalanceCard } from '@/src/domains/wallet/components/WalletBalanceCard';
import { WithdrawalStatusBadge } from '@/src/domains/wallet/components/WithdrawalStatusBadge';
import { WalletWithdrawNoticeBanner } from '@/src/domains/wallet/components/WalletWithdrawNoticeBanner';
import { PublisherBankAccountForm } from '@/src/domains/wallet/components/PublisherBankAccountForm';
import {
  usePublisherWalletBalance,
  usePublisherWalletEarnings,
  usePublisherWalletWithdrawals,
} from '@/src/domains/wallet/hooks/publisher-wallet.hooks';
import { formatCOP } from '@/src/domains/wallet/utils/format-currency';

const LIMIT = 8;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Pagination({
  offset,
  total,
  onPrev,
  onNext,
}: {
  offset: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const page = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Página {page} de {totalPages}
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={offset === 0} onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function EarningsTable({ organizationId }: { organizationId: string }) {
  const [offset, setOffset] = useState(0);
  const { data, isLoading } = usePublisherWalletEarnings(organizationId, LIMIT, offset);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/40" />
        ))}
      </div>
    );
  }

  const earnings = data?.data ?? [];

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border bg-card">
        {earnings.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Aún no hay comisiones acreditadas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Track</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Comisión</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {earnings.map((earning) => (
                  <tr key={earning.id} className="transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(earning.occurredAt)}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium">{earning.trackTitle}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{earning.percentage}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      +{formatCOP(earning.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <Pagination
        offset={offset}
        total={data?.total ?? 0}
        onPrev={() => setOffset(Math.max(0, offset - LIMIT))}
        onNext={() => setOffset(offset + LIMIT)}
      />
    </div>
  );
}

function WithdrawalsTable({ organizationId }: { organizationId: string }) {
  const [offset, setOffset] = useState(0);
  const { data, isLoading } = usePublisherWalletWithdrawals(organizationId, LIMIT, offset);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/40" />
        ))}
      </div>
    );
  }

  const withdrawals = data?.data ?? [];

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border bg-card">
        {withdrawals.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            La organización aún no ha solicitado ningún retiro.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Monto</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(withdrawal.createdAt)}</td>
                    <td className="px-4 py-3 font-semibold">{formatCOP(withdrawal.amount)}</td>
                    <td className="px-4 py-3">
                      <WithdrawalStatusBadge status={withdrawal.status} />
                    </td>
                    <td className="max-w-[240px] truncate px-4 py-3 text-xs text-muted-foreground">
                      {withdrawal.rejectionReason ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <Pagination
        offset={offset}
        total={data?.total ?? 0}
        onPrev={() => setOffset(Math.max(0, offset - LIMIT))}
        onNext={() => setOffset(offset + LIMIT)}
      />
    </div>
  );
}

/** Wallet a nivel organización (publisher): balance, comisiones y retiros. */
export default function PublisherWalletPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = use(params);
  const { data: balance, isLoading } = usePublisherWalletBalance(organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet de la organización"
        description="Consulta las comisiones acreditadas por las licencias de tu roster y el estado de los pagos."
      />

      <WalletBalanceCard balance={balance} isLoading={isLoading} />
      <WalletWithdrawNoticeBanner />

      <Tabs defaultValue="movimientos">
        <TabsList>
          <TabsTrigger value="movimientos">Comisiones</TabsTrigger>
          <TabsTrigger value="retiros">Retiros</TabsTrigger>
          <TabsTrigger value="banco">Datos bancarios</TabsTrigger>
        </TabsList>
        <TabsContent value="movimientos" className="mt-4">
          <EarningsTable organizationId={organizationId} />
        </TabsContent>
        <TabsContent value="retiros" className="mt-4">
          <WithdrawalsTable organizationId={organizationId} />
        </TabsContent>
        <TabsContent value="banco" className="mt-4">
          <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
            <PublisherBankAccountForm organizationId={organizationId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
