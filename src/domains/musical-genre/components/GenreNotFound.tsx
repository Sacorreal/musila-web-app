import React from "react";
import { BackButton } from "@/src/shared/components/UI/BackButton";

export function GenreNotFound() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-foreground">
        Género no encontrado
      </h1>
      <BackButton
        label="Volver a la música"
        className="text-primary hover:underline mt-4 inline-flex"
      />
    </div>
  );
}
