'use client';

import React from 'react';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { InviteHero } from '@/src/domains/guests/components/InviteHero';
import { InviteFormPanel } from '@/src/domains/guests/components/InviteFormPanel';
import { GuestManagementPanel } from '@/src/domains/guests/components/GuestManagementPanel';

export default function InvitarUsuarioPage() {
  const user = useAuthStore((s) => s.user);
  const inviterName = user?.name ?? 'Usuario';

  return (
    <main className="w-full min-h-screen bg-background p-4 md:p-8 lg:p-12 space-y-12">
      <InviteHero />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <section className="lg:col-span-4 space-y-6">
          <InviteFormPanel inviterName={inviterName} />
        </section>

        <section className="lg:col-span-8">
          <GuestManagementPanel />
        </section>
      </div>
    </main>
  );
}
