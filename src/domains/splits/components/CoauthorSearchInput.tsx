"use client";

import { useState } from "react";
import { Search, UserX, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldLabel } from "@/src/shared/components/UI/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/src/shared/components/UI/input-group";
import { useSearchCoauthor } from "../hooks/splits.hooks";
import { CoauthorSearchResult } from "../types/splits.types";

interface Props {
  onSelect: (user: CoauthorSearchResult) => void;
  disabled?: boolean;
}

export function CoauthorSearchInput({ onSelect, disabled }: Props) {
  const [username, setUsername] = useState("");
  const [notFound, setNotFound] = useState(false);
  const { mutate, isPending } = useSearchCoauthor();

  const handleSearch = () => {
    if (!username.trim()) return;
    setNotFound(false);

    mutate(username.trim(), {
      onSuccess: (user) => {
        if (!user) {
          setNotFound(true);
          return;
        }
        onSelect(user);
        setUsername("");
      },
      onError: () => setNotFound(true),
    });
  };

  return (
    <Field>
      <FieldLabel>Nombre de usuario del coautor</FieldLabel>
      <div className="flex gap-2">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setNotFound(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
            disabled={disabled || isPending}
            placeholder="Ej: Nombre123"
          />
        </InputGroup>
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={disabled || isPending || !username.trim()}
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
