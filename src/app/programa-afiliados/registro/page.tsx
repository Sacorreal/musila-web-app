import type { Metadata } from 'next'
import { AffiliateRegisterForm } from '@/src/domains/affiliates/components/AffiliateRegisterForm'
import { AffiliateLoginLinkNote } from '@/src/domains/affiliates/components/AffiliateLoginLinkNote'
import { AuthCardShell } from '@/src/domains/auth/components/AuthCardShell'

export const metadata: Metadata = {
  title: 'Regístrate como afiliado | Musila',
  description: 'Crea tu cuenta de afiliado y empieza a generar ingresos recomendando Musila.',
}

export default function AffiliateRegisterPage() {
  return (
    <AuthCardShell
      logoHref="/programa-afiliados"
      badge="Programa de Afiliados"
      title="Crea tu cuenta de afiliado"
      description="Regístrate para obtener tu enlace personalizado y empezar a generar comisiones."
      maxWidth="lg"
      align="start"
      footer={<AffiliateLoginLinkNote />}
    >
      <AffiliateRegisterForm />
    </AuthCardShell>
  )
}
