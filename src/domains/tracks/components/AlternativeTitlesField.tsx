"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/src/shared/libs/cn";
import { Input } from "@/src/shared/components/UI/input";
import { Button } from "@shared/components/UI/button";
import { Badge } from "@shared/components/UI/badge";

interface AlternativeTitlesFieldProps {
  /** Lista actual de títulos alternativos. */
  value: string[];
  /** Notifica la nueva lista tras agregar o quitar un título. */
  onChange: (titles: string[]) => void;
  /** Deshabilita la interacción (p. ej. durante el envío). */
  disabled?: boolean;
}

/**
 * Campo de entrada múltiple para los títulos alternativos de una obra.
 * Permite agregar varios nombres (Enter o botón) y eliminarlos como chips.
 * Descarta entradas vacías y evita duplicados (case-insensitive).
 */
export function AlternativeTitlesField({
  value,
  onChange,
  disabled = false,
}: AlternativeTitlesFieldProps) {
  const [draft, setDraft] = useState("");

  const titles = value ?? [];

  const addTitle = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const isDuplicate = titles.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!isDuplicate) {
      onChange([...titles, trimmed]);
    }
    setDraft("");
  }, [draft, titles, onChange]);

  const removeTitle = useCallback(
    (index: number) => {
      onChange(titles.filter((_, i) => i !== index));
    },
    [titles, onChange],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Enter agrega; evitamos que dispare el submit del formulario.
    if (event.key === "Enter") {
      event.preventDefault();
      addTitle();
    }
    // Backspace con input vacío elimina el último chip.
    if (event.key === "Backspace" && draft.length === 0 && titles.length > 0) {
      removeTitle(titles.length - 1);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ej: Rapsodia Bohemia"
          aria-label="Agregar título alternativo"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addTitle}
          disabled={disabled || draft.trim().length === 0}
          className="shrink-0 gap-1"
        >
          <Plus className="size-4" />
          Agregar
        </Button>
      </div>

      {titles.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Títulos alternativos añadidos">
          {titles.map((title, index) => (
            <li key={`${title}-${index}`}>
              <Badge
                variant="secondary"
                className="max-w-full gap-1.5 py-1 pl-3 pr-1.5 text-sm"
              >
                <span className="truncate">{title}</span>
                <button
                  type="button"
                  onClick={() => removeTitle(index)}
                  disabled={disabled}
                  aria-label={`Quitar título "${title}"`}
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full transition-colors",
                    "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">
          Aún no has agregado títulos alternativos.
        </p>
      )}
    </div>
  );
}
