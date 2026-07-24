import React from "react";
import { UserRegisterForm } from "@/src/domains/auth/components/UserRegisterForm";

interface RegistrationCompletePanelProps {
  defaultPlanType?: string;
  externalReference?: string;
}

export function RegistrationCompletePanel({
  defaultPlanType,
  externalReference,
}: RegistrationCompletePanelProps) {
  return (
    <>
      <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
        ✅ Pago confirmado — completa tu registro para activar tu plan Pro
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-2">Completa tu registro</h1>
      <p className="text-muted-foreground mb-6">
        Tu pago fue procesado exitosamente. Crea tu cuenta para acceder a Musila Pro.
      </p>

      <UserRegisterForm
        defaultPlanType={defaultPlanType}
        externalReference={externalReference}
      />
    </>
  );
}
