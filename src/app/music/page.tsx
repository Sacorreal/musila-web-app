"use client"

import { useAuthStore } from "@/src/domains/auth/store/use-auth-store"
import { UserPlanType } from "@/src/domains/users/types/user.types"
import { FeaturedComposersSection } from "@/src/domains/promotions/components/FeaturedComposersSection"
import { FeaturedTracksSection } from "@/src/domains/promotions/components/FeaturedTracksSection"
import { CampaignsSection } from "@/src/domains/campaigns/components/CampaignsSection"
import { GenreList } from "@/src/domains/musical-genre/components/GenreList"
import { MyTracksList } from "@/src/domains/tracks/components/MyTracksList"

export default function AppHomePage() {
  const { user } = useAuthStore();

  // Si el usuario es Plan Autor, solo mostramos sus canciones
  if (user?.planType === UserPlanType.PLAN_AUTOR) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <MyTracksList />
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8 space-y-8">
      {(user?.planType === UserPlanType.PLAN_360) && (
        <MyTracksList />
      )}
      <GenreList />
      <CampaignsSection />
      <FeaturedComposersSection />
      <FeaturedTracksSection />
    </main>
  );
}
