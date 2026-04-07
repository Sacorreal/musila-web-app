"use client"

import { ArtistsCarousel } from "@/src/domains/artists/components/ArtistsCarousel"
import { FeaturedTracksCarousel } from "@/src/domains/tracks/components/FeaturedTracksCarousel"

export default function AppHomePage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <ArtistsCarousel />
      <FeaturedTracksCarousel />
    </main>
  )
}
