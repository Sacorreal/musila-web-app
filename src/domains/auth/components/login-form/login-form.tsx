"use client";

import { Button } from "@/src/shared/components/UI/button";
import { Input } from "@/src/shared/components/UI/input";
import { Label } from "@/src/shared/components/UI/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLogin } from "../../hooks/useLogin";
import type { LoginDTO } from "../../types/auth.types";
import { useAuth } from "../../hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const { login} = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<LoginDTO>();

  const onSubmit = async (data: LoginDTO) => {
    try {
      await login(data);
      toast.success("Bienvenido de vuelta");
      reset();
      router.push("/music");
    } catch (error) {
      toast.error("Error al iniciar sesión", {
        description:
          error instanceof Error ? error.message : "Credenciales inválidas",
      });
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          required
          disabled={isSubmitting}
          className="bg-card"
          {...register("email")}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            disabled={isSubmitting}
            className="bg-card pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
    </form>
  );
}
