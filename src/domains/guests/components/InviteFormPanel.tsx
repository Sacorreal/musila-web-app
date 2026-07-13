import React from 'react';
import { motion } from 'framer-motion';
import { InviteUserPanel } from '@/src/domains/guests/components/InviteUserPanel';
import { InviteSecurityTip } from '@/src/domains/guests/components/InviteSecurityTip';

interface InviteFormPanelProps {
  inviterName: string;
}

export function InviteFormPanel({ inviterName }: InviteFormPanelProps) {
  return (
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

      <InviteSecurityTip />
    </div>
  );
}
