import { getMyAffiliateProfileAction } from '@/src/domains/affiliates/services/affiliate-dashboard.actions'
import { AffiliateProfileForm } from '@/src/domains/affiliates/components/dashboard/AffiliateProfileForm'

export default async function AffiliateProfilePage() {
  const profile = await getMyAffiliateProfileAction()

  return (
    <div className="max-w-2xl">
      <AffiliateProfileForm profile={profile} />
    </div>
  )
}
