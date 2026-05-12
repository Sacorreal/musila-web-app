'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { InviteUserPanel } from '@/src/domains/guests/components/InviteUserPanel';
import { GuestManagementList } from '@/src/domains/guests/components/GuestManagementList';

// ─── Feature chips decorativos ────────────────────────────────────────────────
const features = [
  { icon: Mail, label: 'Email automático' },
  { icon: ShieldCheck, label: 'Token seguro' },
  { icon: Users, label: 'Colaboración en tiempo real' },
];

export default function InvitarUsuarioPage() {
  const user = useAuthStore((s) => s.user);
  const inviterName = user?.name ?? 'Usuario';

  return (
    <main className="w-full min-h-screen bg-background p-4 md:p-8 lg:p-12 space-y-12">
      
      {/* ── Header / Hero Section ────────────────────────────────────────── */}
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
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border text-xs font-bold text-muted-foreground shadow-sm"
              >
                <Icon className="w-4 h-4 text-primary" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden xl:flex items-center gap-4 p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
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

      {/* ── Main Content Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Lado Izquierdo: Formulario */}
        <section className="lg:col-span-4 space-y-6">
          <div className="sticky top-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Nueva invitación</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                El invitado recibirá un correo electrónico con su enlace de registro único válido por <strong className="text-foreground">24 horas</strong>.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/10 overflow-hidden relative"
            >
              {/* Decorative circle */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              
              <InviteUserPanel inviterName={inviterName} />
            </motion.div>

            {/* Quick tips */}
            <div className="bg-muted/30 p-6 rounded-3xl border border-border/50">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Tip de seguridad
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cada token es personal e intransferible. Una vez el invitado crea su cuenta, el enlace queda invalidado permanentemente.
              </p>
            </div>
          </div>
        </section>

        {/* Lado Derecho: Listado de Invitados (CRUD) */}
        <section className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/5"
          >
            <GuestManagementList />
          </motion.div>
        </section>

      </div>

    </main>
  );
}
