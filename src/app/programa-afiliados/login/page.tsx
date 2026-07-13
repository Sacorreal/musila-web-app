import type { Metadata } from 'next'
import { AffiliateLoginForm } from '@/src/domains/affiliates/components/AffiliateLoginForm'
import { AuthCardShell } from '@/src/domains/auth/components/AuthCardShell'

export const metadata: Metadata = {
  title: 'Iniciar sesión como afiliado | Musila',
  description: 'Accede a tu panel de afiliado Musila.',
}

export default function AffiliateLoginPage() {
  return (
    <AuthCardShell
      logoHref="/programa-afiliados"
      badge="Programa de Afiliados"
      title="Bienvenido de vuelta"
      centerHeading
    >
      <AffiliateLoginForm />
    </AuthCardShell>
  )
}
