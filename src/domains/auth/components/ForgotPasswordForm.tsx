"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";
import { forgotPasswordRequest } from "@/src/domains/auth/services/auth.actions";
import { motion, AnimatePresence } from "framer-motion";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await forgotPasswordRequest(email);
      setIsSubmitted(true);
    } catch (error) {
      // Always show generic success (backend hides whether email exists for security)
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isSubmitted ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>

          <h1 className="text-3xl font-black text-foreground mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-muted-foreground mb-8">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar enlace de recuperación
                </>
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
            ¡Revisa tu correo!
          </h1>
          <p className="text-muted-foreground mb-2 leading-relaxed">
            Si <strong className="text-foreground">{email}</strong> está registrado en Músila, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            El enlace expirará en <strong>15 minutos</strong>. Revisa también tu carpeta de spam.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
