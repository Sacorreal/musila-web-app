"use client"

import { ArtistsCarousel } from "@/src/domains/artists/components/ArtistsCarousel"
import { FeaturedTracksCarousel } from "@/src/domains/tracks/components/FeaturedTracksCarousel"
import { GenreList } from "@/src/domains/musical-genre/components/GenreList"

export default function AppHomePage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <GenreList />
      <ArtistsCarousel />
      <FeaturedTracksCarousel />
    </main>
  )
}
