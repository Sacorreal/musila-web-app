import React from "react";
import { MailCheck } from "lucide-react";

export function VerifyEmailInfoPanel() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <MailCheck className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground leading-tight">
          Ya casi estás dentro
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Verificar tu correo nos ayuda a mantener Músila libre de cuentas falsas y proteger a la comunidad de artistas.
        </p>
      </div>
    </>
  );
}
