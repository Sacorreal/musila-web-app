import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AffiliateSidebar } from '@/src/domains/affiliates/components/dashboard/AffiliateSidebar'
import { AffiliateHeader } from '@/src/domains/affiliates/components/dashboard/AffiliateHeader'
import type { AffiliateTier } from '@/src/domains/affiliates/types/affiliate.types'

export default async function AffiliateDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('affiliate_access_token')?.value

  if (!token) redirect('/programa-afiliados/login')

  let affiliateName = ''
  let tier: AffiliateTier = 'standard'
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.type !== 'affiliate') redirect('/programa-afiliados/login')
    affiliateName = payload.name
    tier = payload.tier
  } catch {
    redirect('/programa-afiliados/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <AffiliateSidebar />

      <div className="flex min-h-screen flex-col md:ml-64">
        <AffiliateHeader affiliateName={affiliateName} tier={tier} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
