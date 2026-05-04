'use client';

import React from 'react';
import { Button } from '@/src/shared/components/UI/button';
import { LogIn, UserPlus, Music, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthRequiredPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card border border-border p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative">
             <Music className="w-10 h-10" />
             <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-lg border border-border">
                <ShieldAlert className="w-5 h-5 text-foreground" />
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Inicia Sesión</h1>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Si quieres acceder a <span className="text-foreground font-bold italic tracking-tighter">Musila</span>, debes iniciar sesión o registrarte.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          <Link href="/login" passHref>
            <Button className="w-full h-14 rounded-2xl font-black text-lg gap-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <LogIn className="w-5 h-5" />
              INICIAR SESIÓN
            </Button>
          </Link>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-bold tracking-widest">O</span>
            </div>
          </div>

          <Link href="/register" passHref>
            <Button variant="outline" className="w-full h-14 rounded-2xl font-black text-lg gap-3 border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <UserPlus className="w-5 h-5 text-primary" />
              REGISTRARSE
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest pt-4">
          Compositores · Intérpretes · Amantes de la música
        </p>
      </motion.div>
    </div>
  );
}
