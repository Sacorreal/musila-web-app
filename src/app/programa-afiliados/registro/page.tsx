import type { Metadata } from 'next'
import Link from 'next/link'
import { MusilaLogo } from '@/src/shared/components/Icons/icons'
import { AffiliateRegisterForm } from '@/src/domains/affiliates/components/AffiliateRegisterForm'

export const metadata: Metadata = {
  title: 'Regístrate como afiliado | Musila',
  description: 'Crea tu cuenta de afiliado y empieza a generar ingresos recomendando Musila.',
}

export default function AffiliateRegisterPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/4 rounded-full blur-3xl" />
      </div>

      <header className="p-6 border-b border-border/50 backdrop-blur-sm">
        <Link href="/programa-afiliados" className="inline-flex items-center gap-2">
          <MusilaLogo className="h-auto w-auto text-primary" />
        </Link>
      </header>

      <main className="flex-1 flex items-start justify-center p-4 sm:p-6 py-8 sm:py-10">
        <div className="w-full max-w-lg space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold uppercase tracking-widest w-fit">
              Programa de Afiliados
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Crea tu cuenta de afiliado
            </h1>
            <p className="text-muted-foreground text-sm">
              Regístrate para obtener tu enlace personalizado y empezar a generar comisiones.
            </p>
          </div>

          <div className="bg-card border border-border rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-xl shadow-black/5">
            <AffiliateRegisterForm />
          </div>

          <p className="text-xs text-muted-foreground/50 text-center leading-relaxed">
            ¿Ya tienes cuenta de afiliado?{' '}
            <Link href="/programa-afiliados/login" className="text-primary hover:underline font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
