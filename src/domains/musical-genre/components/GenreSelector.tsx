'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/UI/select';
import { Loader2 } from 'lucide-react';
import { useGenres } from '@domains/musical-genre/hooks/useGenres';

interface GenreSelectorProps {
  genreId?: string;
  subGenre?: string;
  onGenreChange: (genreId: string) => void;
  onSubGenreChange: (subGenre: string) => void;
  disabled?: boolean;
}

export function GenreSelector({
  genreId,
  subGenre,
  onGenreChange,
  onSubGenreChange,
  disabled,
}: GenreSelectorProps) {
  // 1. Magia de React Query: Extraemos datos, estado de carga y errores en una sola línea
  const { data: genres = [], isLoading, isError } = useGenres();

  // 2. Lógica de UI y dependencias
  const selectedGenre = genres.find((g) => String(g.id) === String(genreId));
  const hasSubGenres = selectedGenre?.subGenre && selectedGenre.subGenre.length > 0;

  const handleGenreChange = (newGenreId: string) => {
    onGenreChange(newGenreId);
    onSubGenreChange(''); // Limpiamos el subgénero si el padre cambia
  };

  // 3. Renderizados de estado
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando catálogo de géneros...
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-destructive">Error de conexión. Intenta de nuevo más tarde.</div>;
  }

  // 4. Render principal
  return (
    <div className="flex flex-col gap-4">
      {/* SELECT DE GÉNERO */}
      <div className="flex flex-col gap-2">
        <Select value={genreId} onValueChange={handleGenreChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un género" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((g) => (
              <SelectItem key={g.id} value={String(g.id)}>
                {g.genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SELECT DE SUBGÉNERO (Condicional) */}
      {hasSubGenres && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          <Select value={subGenre} onValueChange={onSubGenreChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un subgénero" />
            </SelectTrigger>
            <SelectContent>
              {selectedGenre.subGenre!.map((sg) => (
                <SelectItem key={sg} value={sg}>
                  {sg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}