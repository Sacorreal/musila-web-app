"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";
import { resetPasswordRequest } from "@/src/domains/auth/services/auth.actions";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If no token is provided in the URL, show an error state immediately
  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-3">
          Enlace Inválido
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          El enlace de recuperación de contraseña no es válido o está incompleto. Por favor, solicita uno nuevo.
        </p>
        <Link
          href="/forgot-password"
          className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Solicitar nuevo enlace
        </Link>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordRequest(token, newPassword, confirmPassword);
      setIsSuccess(true);
      toast.success("Contraseña actualizada con éxito");
      // Redirect to login after a few seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "El enlace es inválido o ha expirado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-black text-foreground mb-2">
            Crear nueva contraseña
          </h1>
          <p className="text-muted-foreground mb-8">
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full h-12 pl-11 pr-12 rounded-2xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full h-12 pl-11 pr-12 rounded-2xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full h-12 mt-2 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Actualizar Contraseña"
              )}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h1 className="text-3xl font-black text-foreground mb-3">
            ¡Contraseña Actualizada!
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Tu contraseña ha sido cambiada correctamente. Ya puedes acceder a tu cuenta con tus nuevas credenciales.
          </p>
          <Link
            href="/login"
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Ir al inicio de sesión
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
