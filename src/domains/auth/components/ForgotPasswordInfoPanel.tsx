import React from "react";
import { Mail } from "lucide-react";

const BENEFITS = [
  "El enlace expira en 15 minutos",
  "Proceso 100% seguro y encriptado",
  "Sin necesidad de datos adicionales",
];

export function ForgotPasswordInfoPanel() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-foreground leading-tight">
          Recupera el acceso a tu cuenta
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Te enviaremos un enlace seguro y temporal a tu correo para que puedas crear una nueva contraseña en minutos.
        </p>
        <div className="space-y-3 pt-4">
          {BENEFITS.map((item) => (
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
