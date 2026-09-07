export const queryKeys = {
    // Dominio de Géneros Musicales
    genres: {
      all: ['musical-genres'] as const,

      detail: (id: string) => [...queryKeys.genres.all, id] as const,
    },
    languages:{
      all: ['languages'] as const
    },
    moods: {
      all: ['moods'] as const,
    },
    themes: {
      all: ['themes'] as const,
    },
   
    tracks: {
      all: ['tracks'] as const,
      create: ['create-track'] as const,
      detail: (id: string) => [...queryKeys.tracks.all, id] as const,
  
      list: (filters: Record<string, any>) => [...queryKeys.tracks.all, { filters }] as const,
    },   
    
  };