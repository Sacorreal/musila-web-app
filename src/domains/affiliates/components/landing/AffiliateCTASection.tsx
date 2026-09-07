import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/src/shared/components/UI/button';

export function AffiliateCTASection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 border-t border-border/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
          Musila no solo vende una suscripción; ayuda a transformar canciones inéditas en
          oportunidades reales
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Únete al Programa de Afiliados y empieza a generar ingresos recomendando una plataforma
          en la que realmente crees.
        </p>
        <Button size="lg" className="text-base w-full sm:w-auto" asChild>
          <Link href="/programa-afiliados/registro">
            Registrarme como afiliado
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
