'use client'

import React from 'react';
import { TrackSummary } from '@/src/domains/tracks/types/track.type';
import { ArtistNoTracks } from './ArtistNoTracks';
import { Button } from '@/src/shared/components/UI/button';
import { Play, MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select';
import { useArtistTracksFilter } from '../hooks/use-artist-tracks-filter.hook';

interface ArtistTracksListProps {
  tracks: TrackSummary[] | string[];
}

export function ArtistTracksList({ tracks }: ArtistTracksListProps) {
  // The artist-by-id endpoint populates the tracks relation as TrackSummary objects.
  // Filter out any plain string IDs that may come from list endpoints.
  const populatedTracks = (tracks as Array<TrackSummary | string>).filter(
    (t): t is TrackSummary => typeof t === 'object' && t !== null,
  );

  const {
    filteredTracks,
    genreOptions,
    subGenres,
    selectedGenre,
    selectedSubGenre,
    genreIdToName,
    handleGenreChange,
    handleSubGenreChange,
  } = useArtistTracksFilter(populatedTracks);

  // Helper to resolve genre name
  const resolveGenreName = (track: TrackSummary) => {
    // Try to find the genre identifier in various common fields
    const genreCandidate = (track as any).genreId || (track as any).genre || (track as any).musicalGenre || (track as any).musicalGenreId;
    
    if (!genreCandidate) return 'Sin género';

    // 1. If it's already a populated object, extract the name 
    // Usually MusicalGenre { id: string, genre: string } or { id, name }
    if (typeof genreCandidate === 'object') {
      return genreCandidate.genre || genreCandidate.name || 'Género';
    }
    
    // 2. If it's a string ID, resolve it via our hook's genre map
    if (typeof genreCandidate === 'string') {
      const name = genreIdToName[genreCandidate];
      return name || 'Cargando...';
    }

    return 'Género';
  };

  return (
    <div className="mt-10 px-2 pb-20">
      <h2 className="text-2xl font-bold text-white mb-6">Canciones</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Button className="w-14 h-14 rounded-full bg-[#1E293B] hover:bg-[#334155] p-0 flex items-center justify-center align-middle shadow-lg border-0 shrink-0">
          <Play className="w-6 h-6 text-slate-300 ml-1" fill="currentColor" />
        </Button>
        
        <div className="flex gap-3">
          {/* Genre Select */}
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
            <SelectTrigger className="w-[160px] bg-[#1E293B] border-0 text-slate-300 rounded-full h-10 px-4 shadow-sm hover:!bg-[#334155] cursor-pointer ring-0 focus:ring-0">
              <SelectValue>
                {selectedGenre === 'all' ? 'Filtrar por género' : genreIdToName[selectedGenre] || 'Género'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
              <SelectItem value="all">Todos los géneros</SelectItem>
              {genreOptions.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subgenre Select */}
          <Select value={selectedSubGenre} onValueChange={handleSubGenreChange}>
            <SelectTrigger className="w-[180px] bg-[#1E293B] border-0 text-slate-300 rounded-full h-10 px-4 shadow-sm hover:!bg-[#334155] cursor-pointer ring-0 focus:ring-0">
              <SelectValue>
                {selectedSubGenre === 'all' ? 'Filtrar por subgénero' : selectedSubGenre}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
              <SelectItem value="all">Todos los subgéneros</SelectItem>
              {subGenres.map(subGenre => (
                <SelectItem key={subGenre} value={subGenre}>
                  {subGenre.charAt(0).toUpperCase() + subGenre.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tracks List */}
      <div className="flex flex-col gap-2">
        {populatedTracks.length === 0 ? (
          <ArtistNoTracks />
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400">No hay canciones que coincidan con los filtros aplicados.</p>
            <Button 
              variant="link" 
              className="text-emerald-500 mt-2"
              onClick={() => {
                handleGenreChange('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          filteredTracks.map((track, index) => (
            <div 
              key={track.id} 
              className="group flex flex-col sm:flex-row items-start sm:items-center py-2 px-3 hover:bg-white/5 rounded-lg transition-colors gap-4 sm:gap-6 w-full cursor-pointer"
            >
              <span className="text-slate-400 font-medium w-4 shrink-0 text-center">{index + 1}</span>
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                 {track.coverUrl ? (
                   <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded object-cover shadow-sm bg-slate-800" />
                 ) : (
                   <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                      <span className="text-slate-500 text-xs">🎵</span>
                   </div>
                 )}
                 <span className="text-white font-semibold truncate hover:underline">{track.title}</span>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-14 ml-10 sm:ml-0 text-sm text-slate-400 font-medium whitespace-nowrap overflow-hidden">
                <span className="text-emerald-500 min-w-[3rem]">{'3:12'}</span>
                <span className="min-w-[7rem] hidden md:block truncate opacity-80 italic">
                  {resolveGenreName(track)}
                </span>
                <span className="min-w-[8rem] hidden md:block truncate">
                  {track.subGenre || '-'}
                </span>
              </div>
              
              <button className="text-slate-500 hover:text-white p-2 self-end sm:self-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

