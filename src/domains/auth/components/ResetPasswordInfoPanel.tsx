import React from "react";
import { Lock } from "lucide-react";

const TIPS = [
  "Usa al menos 6 caracteres",
  "Mezcla letras y números",
  "Evita contraseñas comunes",
];

export function ResetPasswordInfoPanel() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground leading-tight">
          Protege tu cuenta musical
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Una contraseña segura asegura que tu música, regalías e información personal estén siempre protegidas en Músila.
        </p>
        <div className="space-y-3 pt-4">
          {TIPS.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
