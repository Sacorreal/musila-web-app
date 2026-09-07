import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function InviteSecurityTip() {
  return (
    <div className="bg-muted/30 p-6 rounded-3xl border border-border/50">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
        <ShieldCheck className="w-3 h-3" /> Tip de seguridad
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Cada token es personal e intransferible. Una vez el invitado crea su cuenta, el enlace queda invalidado permanentemente.
      </p>
    </div>
  );
}
