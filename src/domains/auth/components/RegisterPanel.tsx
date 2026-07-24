import React from "react";
import Link from "next/link";
import { UserRegisterForm } from "@/src/domains/auth/components/UserRegisterForm";

interface RegisterPanelProps {
  defaultPlanType?: string;
}

export function RegisterPanel({ defaultPlanType }: RegisterPanelProps) {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Crea tu cuenta
      </h1>
      <p className="text-muted-foreground mb-6">
        Únete a la comunidad de compositores e intérpretes
      </p>

      <UserRegisterForm defaultPlanType={defaultPlanType} />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
