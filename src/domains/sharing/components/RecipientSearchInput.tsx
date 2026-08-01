"use client";

import { useState } from "react";
import { Search, UserPlus, UserX, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldLabel } from "@/src/shared/components/UI/field";
import { useAuthorizeRecipient, useSearchUserByCreatorId } from "../hooks/sharing.hooks";

interface RecipientSearchInputProps {
  shareLinkId: string;
}

export function RecipientSearchInput({ shareLinkId }: RecipientSearchInputProps) {
  const [musilaCreatorId, setMusilaCreatorId] = useState("");
  const [notFound, setNotFound] = useState(false);
  const { mutate: search, isPending: isSearching } = useSearchUserByCreatorId();
  const { mutate: authorize, isPending: isAuthorizing } = useAuthorizeRecipient(shareLinkId);

  const handleSearch = () => {
    const trimmed = musilaCreatorId.trim();
    if (!trimmed) return;
    setNotFound(false);

    search(trimmed, {
      onSuccess: (user) => {
        if (!user) {
          setNotFound(true);
          return;
        }
        authorize(trimmed, {
          onSuccess: () => setMusilaCreatorId(""),
        });
      },
      onError: () => setNotFound(true),
    });
  };

  const isPending = isSearching || isAuthorizing;

  return (
    <Field>
      <FieldLabel>Autorizar por Musila Creator ID</FieldLabel>
      <div className="flex gap-2">
        <input
          value={musilaCreatorId}
          onChange={(e) => {
            setMusilaCreatorId(e.target.value.toUpperCase());
            setNotFound(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          disabled={isPending}
          placeholder="Ej: MC-1A2B3C"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleSearch}
          disabled={isPending || !musilaCreatorId.trim()}
          className="shrink-0 gap-2"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4" />
              <UserPlus className="h-4 w-4" />
            </>
          )}
          Autorizar
        </Button>
      </div>
      {notFound && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <UserX className="h-3.5 w-3.5" />
          No existe ningún usuario con ese Musila Creator ID
        </p>
      )}
    </Field>
  );
}
