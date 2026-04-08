import { AuthorSummary} from '@domains/artists/types/artist.types'; 
import { PaginatedResponse} from '@shared/types/shared.types'

export type PlaylistOwner = AuthorSummary; 

export interface PlaylistSummary {
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

export type UpdatePlaylistInput = Partial<PlaylistSummary>

export type AuthorsResponse = PaginatedResponse<PlaylistSummary>;