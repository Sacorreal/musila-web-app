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
  // Filter out plain string IDs — keep only populated TrackSummary objects
  const populatedTracks = (tracks as Array<TrackSummary | string>).filter(
    (t): t is TrackSummary => typeof t === 'object' && t !== null,
  );

  const {
    filteredTracks,
    subGenreOptions,
    selectedSubGenre,
    handleSubGenreChange,
  } = useArtistTracksFilter(populatedTracks);

  return (
    <div className="mt-10 px-2 pb-20">
      <h2 className="text-2xl font-bold text-white mb-6">Canciones</h2>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Button className="w-14 h-14 rounded-full bg-[#1E293B] hover:bg-[#334155] p-0 flex items-center justify-center align-middle shadow-lg border-0 shrink-0">
          <Play className="w-6 h-6 text-slate-300 ml-1" fill="currentColor" />
        </Button>

        <div className="flex gap-3">
          {/* SubGenre filter — the only genre-level data the backend returns on tracks */}
          <Select value={selectedSubGenre} onValueChange={handleSubGenreChange}>
            <SelectTrigger className="w-[180px] bg-[#1E293B] border-0 text-slate-300 rounded-full h-10 px-4 shadow-sm hover:!bg-[#334155] cursor-pointer ring-0 focus:ring-0">
              <SelectValue>
                {selectedSubGenre === 'all' ? 'Filtrar por género' : selectedSubGenre}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#1E293B] border-slate-700 text-white">
              <SelectItem value="all">Todos los géneros</SelectItem>
              {subGenreOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
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
            <p className="text-slate-400">No hay canciones que coincidan con el filtro aplicado.</p>
            <Button
              variant="link"
              className="text-emerald-500 mt-2"
              onClick={() => handleSubGenreChange('all')}
            >
              Limpiar filtro
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
                {/* subGenre is the only genre-level field returned by the backend */}
                <span className="min-w-[9rem] hidden md:block truncate opacity-80 italic">
                  {track.subGenre || '—'}
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
