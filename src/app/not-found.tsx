import { MusilaLogo } from "@/src/shared/components/Icons/icons"
import { Button } from "@/src/shared/components/UI/button"
import Link from "next/link"

export default function GlobalNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <section className="relative w-full max-w-xl rounded-3xl border border-border bg-card/95 p-8 text-center shadow-2xl backdrop-blur sm:p-12">
        <MusilaLogo className="mx-auto mb-6 h-12 w-auto text-primary" />

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Error 404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Esta página no existe
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Parece que el enlace está roto o la página fue movida. Vuelve al inicio para seguir descubriendo música
          inédita en Músila.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">Ir al inicio</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            <Link href="/music">Explorar canciones</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
