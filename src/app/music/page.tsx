"use client"

import { useAuthStore } from "@/src/domains/auth/store/use-auth-store"
import { UserPlanType } from "@/src/domains/users/types/user.types"
import { ArtistsCarousel } from "@/src/domains/artists/components/ArtistsCarousel"
import { FeaturedTracksCarousel } from "@/src/domains/tracks/components/FeaturedTracksCarousel"
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
      <ArtistsCarousel />
      <FeaturedTracksCarousel />
    </main>
  );
}
