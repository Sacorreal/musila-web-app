import React from 'react';
import { ShieldCheck, Users, Mail } from 'lucide-react';

const FEATURES = [
  { icon: Mail, label: 'Email automático' },
  { icon: ShieldCheck, label: 'Token seguro' },
  { icon: Users, label: 'Colaboración en tiempo real' },
];

export function InviteFeatureChips() {
  return (
    <>
      {FEATURES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border text-xs font-bold text-muted-foreground shadow-sm"
        >
          <Icon className="w-4 h-4 text-primary" />
          {label}
        </div>
      ))}
    </>
  );
}
