import React from 'react';

interface ArtistBiographyProps {
  biography?: string;
}

export function ArtistBiography({ biography }: ArtistBiographyProps) {
  if (!biography) return null;

  return (
    <div className="mt-8 px-2">
      <h2 className="text-2xl font-bold text-white mb-4">Biografía</h2>
      <p className="text-slate-300 leading-relaxed text-base max-w-5xl">
        {biography}
      </p>
    </div>
  );
}
