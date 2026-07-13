import React from "react";
import Link from "next/link";
import { LoginForm } from "@/src/domains/auth/components/LoginForm";

export function LoginPanel() {
  return (
    <>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Bienvenido de vuelta
      </h1>
      <p className="text-muted-foreground mb-8">
        Ingresa tus credenciales para acceder a tu cuenta
      </p>

      <LoginForm />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-primary hover:underline font-medium"
        >
          Regístrate gratis
        </Link>
      </p>
    </>
  );
}
