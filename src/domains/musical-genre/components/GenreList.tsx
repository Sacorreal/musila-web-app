"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { useGenres } from '../hooks/use-genres.hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function GenreList() {
  const { data: genres, isLoading, isError } = useGenres();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 w-full">
        <h2 className="text-2xl font-bold text-foreground mb-6 px-4">Explorar por género</h2>
        <div className="flex gap-2 sm:gap-3 overflow-x-auto px-2 sm:px-4 pb-4 animate-in fade-in duration-500 [&::-webkit-scrollbar]:hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !genres || genres.length === 0) {
    return null;
  }

  return (
    <div className="py-8 w-full group/genres relative">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Explorar por género</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800/50 border border-slate-300 dark:border-white/5 text-foreground flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-800/50 border border-slate-300 dark:border-white/5 text-foreground flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 px-2 sm:px-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {genres.map((genre) => (
            <Link 
              key={genre.id} 
              href={`/music/genre/${genre.slug || genre.id}`} 
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-100 dark:bg-slate-800/40 border border-slate-300 dark:border-white/5 text-foreground text-xs sm:text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 whitespace-nowrap"
            >
              {genre.genre}
            </Link>
          ))}
          <div className="w-4 shrink-0" />
        </div>
      </div>
    </div>
  );
}
