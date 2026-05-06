'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, ShieldCheck, Mail } from 'lucide-react';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { InviteUserPanel } from '@/src/domains/guests/components/InviteUserPanel';

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
    <main className="min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-0">

      {/* ── Panel izquierdo: Hero informativo ───────────────────────── */}
      <motion.section
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-[45%] bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 flex flex-col justify-between gap-10 border-b lg:border-b-0 lg:border-r border-border"
      >
        {/* Branding / Título */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold uppercase tracking-widest">
            <UserPlus className="w-3.5 h-3.5" />
            Sistema de Invitaciones
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
              Invita a tu<br />
              <span className="text-primary">equipo</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Genera un enlace seguro de acceso único para que nuevos colaboradores se unan a tu espacio en Musila.
            </p>
          </div>

          {/* Chips de características */}
          <div className="flex flex-wrap gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-muted-foreground"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Ilustración del flujo */}
        <div className="hidden lg:block space-y-2">
          <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mb-4">Cómo funciona</p>

          {[
            { step: '01', title: 'Completa el formulario', desc: 'Ingresa el nombre y correo del invitado.' },
            { step: '02', title: 'Envío automático', desc: 'El invitado recibe un email con su enlace único.' },
            { step: '03', title: 'El invitado se registra', desc: 'Al hacer clic, se crea su cuenta como Invitado.' },
            { step: '04', title: 'Colabora en tiempo real', desc: 'Ya puede unirse a tus playlists y sesiones.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex items-start gap-4"
            >
              <span className="text-2xl font-black text-primary/20 tabular-nums w-8 shrink-0">{item.step}</span>
              <div>
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Panel derecho: Formulario / Resultado ───────────────────── */}
      <motion.section
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 flex items-start justify-center p-8 md:p-12"
      >
        <div className="w-full max-w-md space-y-8">
          {/* Header del panel */}
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Nueva invitación</h2>
            <p className="text-muted-foreground text-sm mt-1">
              La invitación expirará en <strong className="text-foreground">24 horas</strong>.
            </p>
          </div>

          {/* Panel dinámico: formulario o resultado */}
          <div className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5">
            <InviteUserPanel inviterName={inviterName} />
          </div>

          {/* Nota informativa */}
          <p className="text-xs text-muted-foreground/50 text-center leading-relaxed">
            Al enviar la invitación, el colaborador recibirá un correo con las instrucciones para crear su cuenta.
            El token es de un solo uso y expira automáticamente.
          </p>
        </div>
      </motion.section>

    </main>
  );
}
