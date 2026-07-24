"use client";

import { useState } from "react";
import { Search, UserX, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldLabel } from "@/src/shared/components/UI/field";
import { useSearchCoauthor } from "../hooks/splits.hooks";
import { CoauthorSearchResult } from "../types/splits.types";

interface Props {
  onSelect: (user: CoauthorSearchResult) => void;
  disabled?: boolean;
}

export function CoauthorSearchInput({ onSelect, disabled }: Props) {
  const [musilaCreatorId, setMusilaCreatorId] = useState("");
  const [notFound, setNotFound] = useState(false);
  const { mutate, isPending } = useSearchCoauthor();

  const handleSearch = () => {
    if (!musilaCreatorId.trim()) return;
    setNotFound(false);

    mutate(musilaCreatorId.trim(), {
      onSuccess: (user) => {
        if (!user) {
          setNotFound(true);
          return;
        }
        onSelect(user);
        setMusilaCreatorId("");
      },
      onError: () => setNotFound(true),
    });
  };

  return (
    <Field>
      <FieldLabel>Musila Creator ID del coautor</FieldLabel>
      <div className="flex gap-2">
        <input
          value={musilaCreatorId}
          onChange={(e) => {
            setMusilaCreatorId(e.target.value);
            setNotFound(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          disabled={disabled || isPending}
          placeholder="Ej: MUS-1A2B3C"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={disabled || isPending || !musilaCreatorId.trim()}
          className="shrink-0 gap-2"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Buscar
        </Button>
      </div>
      {notFound && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <UserX className="h-3.5 w-3.5" />
          Usuario no encontrado
        </p>
      )}
    </Field>
  );
}
