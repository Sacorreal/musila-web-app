'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/UI/select';
import { Loader2 } from 'lucide-react';
import { useLanguages } from '@domains/tracks/hooks/useLanguages';

interface LanguageSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  const { data: languages = [], isLoading, isError } = useLanguages();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground h-10 border rounded-md px-3 bg-muted/20">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando idiomas...
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-destructive">Error al cargar idiomas</div>;
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona el idioma principal" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          
          <SelectItem key={lang.code} value={lang.code}> 
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}