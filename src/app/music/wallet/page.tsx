'use client'

import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import { WalletBalanceCard } from '@/src/domains/wallet/components/WalletBalanceCard'
import { WalletWithdrawNoticeBanner } from '@/src/domains/wallet/components/WalletWithdrawNoticeBanner'
import { CreateWithdrawalDialog } from '@/src/domains/wallet/components/CreateWithdrawalDialog'
import { WalletEarningsHistoryTable } from '@/src/domains/wallet/components/WalletEarningsHistoryTable'
import { WalletWithdrawalsHistoryTable } from '@/src/domains/wallet/components/WalletWithdrawalsHistoryTable'
import { useWalletBalance } from '@/src/domains/wallet/hooks/wallet.hooks'

export default function WalletPage() {
  const { data: balance, isLoading } = useWalletBalance()

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <PageHeader
        title="Wallet"
        description="Consulta tus ingresos por venta de licencias y gestiona tus retiros"
        actions={<CreateWithdrawalDialog />}
      />

      <WalletBalanceCard balance={balance} isLoading={isLoading} />
      <WalletWithdrawNoticeBanner />

      <Tabs defaultValue="movimientos">
        <TabsList>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="retiros">Retiros</TabsTrigger>
        </TabsList>
        <TabsContent value="movimientos" className="mt-4">
          <WalletEarningsHistoryTable />
        </TabsContent>
        <TabsContent value="retiros" className="mt-4">
          <WalletWithdrawalsHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
