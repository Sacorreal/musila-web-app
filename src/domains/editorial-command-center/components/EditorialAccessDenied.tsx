import { ShieldAlert } from "lucide-react";

interface EditorialAccessDeniedProps {
  message?: string;
}

/**
 * Bloqueo de acceso al Editorial Command Center (Flow 5, error): solo UX, la
 * autorización real la hace el backend vía AuthorizationGuard en cada request.
 * No existe todavía una página de upgrade de plan dedicada en el producto, así
 * que por ahora se muestra el mensaje explicativo en el propio lugar.
 */
export function EditorialAccessDenied({
  message = "El Editorial Command Center está disponible para organizaciones tipo publisher y usuarios con plan Autor o 360. Actualiza tu plan para acceder al Health Score de tu catálogo.",
}: EditorialAccessDeniedProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <ShieldAlert className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
      <h2 className="text-lg font-bold text-foreground">Acceso restringido</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
