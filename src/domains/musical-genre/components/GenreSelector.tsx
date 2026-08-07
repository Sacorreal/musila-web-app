'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/UI/select';
import { Loader2 } from 'lucide-react';
import { useGenres } from '@domains/musical-genre/hooks/useGenres';

interface GenreSelectorProps {
  genreId?: string;
  ritmo?: string;
  onGenreChange: (genreId: string) => void;
  onRitmoChange: (ritmo: string) => void;
  disabled?: boolean;
}

export function GenreSelector({
  genreId,
  ritmo,
  onGenreChange,
  onRitmoChange,
  disabled,
}: GenreSelectorProps) {
  // 1. Magia de React Query: Extraemos datos, estado de carga y errores en una sola línea
  const { data: genres = [], isLoading, isError } = useGenres();

  // 2. Lógica de UI y dependencias
  const selectedGenre = genres.find((g) => String(g.id) === String(genreId));
  const hasRitmos = selectedGenre?.ritmo && selectedGenre.ritmo.length > 0;

  const handleGenreChange = (newGenreId: string) => {
    onGenreChange(newGenreId);
    onRitmoChange(''); // Limpiamos el ritmo si el padre cambia
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

      {/* SELECT DE RITMO (Condicional) */}
      {hasRitmos && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          <Select value={ritmo} onValueChange={onRitmoChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un ritmo" />
            </SelectTrigger>
            <SelectContent>
              {selectedGenre.ritmo!.map((sg) => (
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