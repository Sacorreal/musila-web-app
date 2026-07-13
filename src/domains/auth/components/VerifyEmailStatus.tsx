"use client";

import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEmailVerification } from "@/src/domains/auth/hooks/use-email-verification";

function VerifyEmailStatusContent() {
  const { status, message } = useEmailVerification();

  return (
    <AnimatePresence mode="wait">
      {status === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-3">Verificando tu correo...</h1>
          <p className="text-muted-foreground leading-relaxed">
            Esto solo tomará un momento.
          </p>
        </motion.div>
      )}

      {status === "success" && (
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
          <h1 className="text-3xl font-black text-foreground mb-3">¡Correo Verificado!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>
          <Link
            href="/music"
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Ir a Músila
          </Link>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-3">Enlace Inválido</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>
          <Link
            href="/music"
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Ir a Músila
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function VerifyEmailStatus() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailStatusContent />
    </Suspense>
  );
}
