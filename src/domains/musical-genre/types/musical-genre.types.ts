import { TracksResponseDto } from "../../tracks/types/track.types";

export interface MusicalGenreDto {
  id: string;
  genre: string;
  slug: string;
  ritmo?: string[];
  tracks?: TracksResponseDto[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;    
}

