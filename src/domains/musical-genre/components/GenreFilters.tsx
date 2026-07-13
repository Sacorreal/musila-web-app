import React from "react";
import { X } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Switch } from "@/src/shared/components/UI/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/UI/select";

const LANGUAGE_LABELS: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  it: "Italiano",
  pt: "Portugués",
  de: "Alemán",
  ja: "Japonés",
  zh: "Chino",
};

interface GenreFiltersProps {
  isGospelFilter: boolean;
  onGospelFilterChange: (value: boolean) => void;
  subGenreFilter: string;
  onSubGenreFilterChange: (value: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
  uniqueSubGenres: string[];
  uniqueLanguages: string[];
}

export function GenreFilters({
  isGospelFilter,
  onGospelFilterChange,
  subGenreFilter,
  onSubGenreFilterChange,
  languageFilter,
  onLanguageFilterChange,
  uniqueSubGenres,
  uniqueLanguages,
}: GenreFiltersProps) {
  const hasActiveFilters =
    isGospelFilter || subGenreFilter !== "all" || languageFilter !== "all";

  return (
    <div className="flex flex-wrap items-center gap-4 py-2">
      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-300 dark:border-white/5 shadow-inner">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Gospel
        </span>
        <Switch checked={isGospelFilter} onCheckedChange={onGospelFilterChange} />
      </div>

      <Select value={subGenreFilter} onValueChange={onSubGenreFilterChange}>
        <SelectTrigger className="w-[180px] h-10 bg-background text-foreground border border-input font-bold rounded-xl shadow-sm hover:bg-accent focus:ring-0">
          <SelectValue placeholder="Subgénero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Subgéneros</SelectItem>
          {uniqueSubGenres.map((sg) => (
            <SelectItem key={sg} value={sg}>
              {sg}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={languageFilter} onValueChange={onLanguageFilterChange}>
        <SelectTrigger className="w-[180px] h-10 bg-background text-foreground border border-input font-bold rounded-xl shadow-sm hover:bg-accent focus:ring-0">
          <SelectValue placeholder="Idioma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Idioma</SelectItem>
          {uniqueLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {LANGUAGE_LABELS[lang.toLowerCase()] || lang.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          className="h-10 text-primary hover:text-primary/80 hover:bg-primary/5 flex items-center gap-2 px-4 rounded-xl font-bold transition-all"
          onClick={() => {
            onGospelFilterChange(false);
            onSubGenreFilterChange("all");
            onLanguageFilterChange("all");
          }}
        >
          Eliminar filtros <X size={16} />
        </Button>
      )}
    </div>
  );
}
