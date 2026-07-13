import React from 'react';
import Link from 'next/link';

export function AffiliateLoginLinkNote() {
  return (
    <p className="text-xs text-muted-foreground/50 text-center leading-relaxed">
      ¿Ya tienes cuenta de afiliado?{' '}
      <Link href="/programa-afiliados/login" className="text-primary hover:underline font-semibold">
        Inicia sesión
      </Link>
    </p>
  );
}
