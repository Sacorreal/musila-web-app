import React from "react";
import { Music2 } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.01] p-6 sm:p-10 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
        <Music2 className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Selecciona un chat</h3>
      <p className="text-muted-foreground max-w-sm">
        Elige una conversación de la lista para empezar a chatear sobre tus licencias y colaboraciones.
      </p>
    </div>
  );
}
