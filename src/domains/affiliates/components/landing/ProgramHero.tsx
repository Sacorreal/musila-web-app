'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/src/shared/components/UI/button';

export function ProgramHero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs sm:text-sm text-primary font-semibold">Programa de Afiliados Musila</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
          Recomienda Musila y genera <span className="text-primary">ingresos</span> ayudando a la música
          a encontrar nuevas oportunidades
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Gana hasta un 30% de comisión por cada nueva membresía vendida a través de tu enlace
          personalizado. Ideal para productores, escuelas de música, creadores de contenido y
          profesionales del sector.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
          <Button size="lg" className="text-base w-full sm:w-auto" asChild>
            <Link href="/programa-afiliados/registro">
              Unirme al programa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base w-full sm:w-auto bg-transparent" asChild>
            <Link href="/programa-afiliados/login">Ya soy afiliado</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
