"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Aquí se podría integrar un servicio de reporte como Sentry
    console.error("Global Error Captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration - Abstract Waves */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <Image 
          src="/abstract-music-waves-pattern.jpg" 
          alt="" 
          fill 
          className="object-cover grayscale"
        />
      </div>

      {/* Blur Orbs for Premium Look */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="z-10 flex flex-col items-center max-w-xl text-center gap-10"
      >
        {/* Logo Branding */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image 
            src="/logo.png" 
            alt="Musila Logo" 
            width={200} 
            height={60} 
            className="object-contain hover:brightness-110 transition-all cursor-pointer"
          />
        </motion.div>

        {/* Visual Error Indicator */}
        <div className="relative group">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full group-hover:bg-red-500/30 transition-all duration-500" />
          <motion.div 
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              y: [0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-red-500/10 p-8 rounded-[2.5rem] border border-red-500/20 backdrop-blur-md"
          >
            <AlertCircle className="w-20 h-20 text-red-500 drop-shadow-2xl" />
          </motion.div>
        </div>

        {/* Typography Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase leading-none italic">
            ¡Ups! Algo salió mal
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md mx-auto">
            Hemos encontrado un error inesperado mientras procesábamos tu solicitud. No te preocupes, la música volverá pronto.
          </p>
          
          {error.digest && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="mt-6"
             >
               <span className="text-[10px] font-mono tracking-widest text-muted-foreground/60 bg-muted/50 border border-border px-3 py-1.5 rounded-full uppercase">
                 Internal ID: {error.digest}
               </span>
             </motion.div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
          <Button 
            onClick={() => reset()} 
            size="lg"
            className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tighter text-lg shadow-2xl shadow-primary/30 transition-all active:scale-95 gap-3"
          >
            <RefreshCcw className="w-6 h-6" />
            Reintentar
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            asChild
            className="h-16 px-10 rounded-2xl border-2 border-border font-black uppercase tracking-tighter text-lg hover:bg-muted/50 transition-all active:scale-95 gap-3"
          >
            <Link href="/music">
              <ArrowLeft className="w-6 h-6" />
              Ir al Inicio
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground pointer-events-none"
      >
        © 2026 Musila
      </motion.p>
    </div>
  );
}
