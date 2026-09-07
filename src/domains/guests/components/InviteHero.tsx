import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users } from 'lucide-react';
import { InviteFeatureChips } from '@/src/domains/guests/components/InviteFeatureChips';

export function InviteHero() {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold uppercase tracking-widest"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Sistema de Invitaciones
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none"
          >
            Invita a tu <span className="text-primary">equipo</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg leading-relaxed max-w-xl"
          >
            Genera enlaces seguros de acceso único para que nuevos colaboradores se unan a tu espacio de trabajo y comiencen a crear contigo.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-3 pt-2"
        >
          <InviteFeatureChips />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="hidden xl:flex items-center gap-4 p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10"
      >
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted overflow-hidden flex items-center justify-center">
              <Users className="w-5 h-5 text-muted-foreground/40" />
            </div>
          ))}
          <div className="w-12 h-12 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            +
          </div>
        </div>
        <div className="pr-4">
          <p className="text-sm font-bold">Colaboración Activa</p>
          <p className="text-xs text-muted-foreground">Gestiona tus invitados con un clic</p>
        </div>
      </motion.div>
    </header>
  );
}
