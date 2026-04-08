import { AuthorSummary} from '@domains/artists/types/artist.types'

export type PlaylistOwner = AuthorSummary; 

export interface Playlist {
  id: string;
  title: string;
  owner: PlaylistOwner;
  cover?: string | null;

  guests: any[]; 
  tracks: PlaylistTrack[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePlaylist{ title:string}

export interface PlaylistTrack {
  id: string;
  title: string;  
}

