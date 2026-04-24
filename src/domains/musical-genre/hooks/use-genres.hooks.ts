import { useQuery } from "@tanstack/react-query";
import { fetchGenresRequest, fetchGenreBySlugRequest } from "../services/genre.actions";

export function useGenres() {
  return useQuery({
    queryKey: ["musical-genres"],
    queryFn: () => fetchGenresRequest(),
  });
}

export function useGenreBySlug(slug: string) {
  return useQuery({
    queryKey: ["musical-genre", slug],
    queryFn: () => fetchGenreBySlugRequest(slug),
    enabled: !!slug,
  });
}
