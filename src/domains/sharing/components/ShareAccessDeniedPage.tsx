import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, Lock, Clock, Ban, HelpCircle } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { ShareAccessReason } from "../types/sharing.types";

interface ShareAccessDeniedPageProps {
  reason: ShareAccessReason;
}

const REASON_CONTENT: Record<ShareAccessReason, { icon: ReactNode; title: string; description: string }> = {
  [ShareAccessReason.NOT_AUTHORIZED]: {
    icon: <Lock className="w-10 h-10 text-destructive" />,
    title: "No tienes permiso para escuchar este contenido",
    description: "Tu cuenta no está autorizada para acceder a este enlace. Pídele al creador que te autorice usando tu Musila Creator ID.",
  },
  [ShareAccessReason.EXPIRED]: {
    icon: <Clock className="w-10 h-10 text-destructive" />,
    title: "Este enlace ha expirado",
    description: "El enlace de compartir ya no está disponible. Solicita uno nuevo al creador del contenido.",
  },
  [ShareAccessReason.REVOKED]: {
    icon: <Ban className="w-10 h-10 text-destructive" />,
    title: "Este enlace fue revocado",
    description: "El creador revocó el acceso a este contenido. Contacta al creador si crees que esto es un error.",
  },
  [ShareAccessReason.TOKEN_NOT_FOUND]: {
    icon: <AlertTriangle className="w-10 h-10 text-destructive" />,
    title: "Enlace no encontrado",
    description: "Este enlace no existe o ya no es válido. Verifica que lo copiaste completo.",
  },
  [ShareAccessReason.NOT_AUTHENTICATED]: {
    icon: <HelpCircle className="w-10 h-10 text-destructive" />,
    title: "Inicia sesión para continuar",
    description: "Necesitas iniciar sesión con tu cuenta de Musila para validar tu acceso a este contenido.",
  },
  [ShareAccessReason.GRANTED]: {
    icon: <HelpCircle className="w-10 h-10 text-muted-foreground" />,
    title: "Acceso concedido",
    description: "",
  },
  [ShareAccessReason.OWNER_ACCESS]: {
    icon: <HelpCircle className="w-10 h-10 text-muted-foreground" />,
    title: "Acceso concedido",
    description: "",
  },
};

export function ShareAccessDeniedPage({ reason }: ShareAccessDeniedPageProps) {
  const content = REASON_CONTENT[reason];

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        {content.icon}
      </div>
      <div className="flex flex-col gap-2 max-w-md">
        <h1 className="text-2xl font-bold text-foreground">{content.title}</h1>
        <p className="text-muted-foreground">{content.description}</p>
      </div>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/music">Ir al inicio</Link>
        </Button>
        {reason === ShareAccessReason.NOT_AUTHENTICATED && (
          <Button asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
