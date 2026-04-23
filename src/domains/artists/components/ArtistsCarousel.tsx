import React, { useRef } from 'react';
import Link from 'next/link';
import { useFeaturedArtists } from '../hooks/use-artists.hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/shared/components/UI/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ArtistsCarousel() {
  const { data: artists, isLoading, isError } = useFeaturedArtists();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 w-full">
        <h2 className="text-2xl font-bold text-foreground mb-6 px-4">Autores Destacados</h2>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto px-4 pb-4 animate-in fade-in duration-500 [&::-webkit-scrollbar]:hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4 shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse border-2 border-slate-300 dark:border-slate-700/50" />
              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !artists || !artists.data || artists.data.length === 0) {
    return null;
  }

  // Show exactly 10 artists total as requested (6 main + 4 scrollable)
  const featuredArtists = artists.data.slice(0, 10);

  return (
    <div className="py-8 w-full group/carousel relative">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Autores Destacados</h2>
          <span className="text-xs text-muted-foreground font-medium">10 Autores destacados esta semana</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent ml-6 hidden md:block" />
      </div>

      <div className="relative overflow-hidden">
        {/* Navigation Buttons - Hidden on touch, visible on hover in web */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-12 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-foreground items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-black/60 hidden md:flex"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-12 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-foreground items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-black/60 hidden md:flex"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Container with overflow-x-auto. The widths are calculated so that ~6 fit on md screens */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 px-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {featuredArtists.map((artist) => (
            <Link 
              key={artist.id} 
              href={`/music/artista/${artist.id}`} 
              className="flex flex-col items-center gap-4 shrink-0 snap-start group/artist w-[130px] sm:w-[150px] md:w-[170px] lg:w-[180px]"
            >
              <div className="relative p-1 rounded-full transition-all duration-300 group-hover/artist:scale-105 group-active/artist:scale-95">
                {/* Visual ring/glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-primary/15 opacity-0 group-hover/artist:opacity-100 blur-lg transition-opacity" />
                
                <div className="relative p-1 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 group-hover/artist:border-primary/40 transition-all duration-300 shadow-xl">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shadow-inner">
                    <AvatarImage 
                      src={artist.avatar} 
                      alt={`${artist.name || ''} ${artist.lastName || ''}`} 
                      className="object-cover" 
                    />
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-muted-foreground font-semibold text-xl">
                      {(artist.name?.charAt(0) || '') + (artist.lastName?.charAt(0) || '')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="flex flex-col items-center text-center px-1">
                <span className="text-sm sm:text-[15px] font-bold text-foreground group-hover/artist:text-primary transition-colors line-clamp-1 w-full">
                  {artist.name} {artist.lastName}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Artista
                  </span>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Spacer to allow scrolling past the last item comfortably */}
          <div className="w-4 shrink-0" />
        </div>
      </div>
    </div>
  );
}
