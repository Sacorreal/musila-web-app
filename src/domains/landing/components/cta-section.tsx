import { Button } from "@/src/shared/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary" />
          <div className="absolute inset-0 bg-[url('/abstract-music-waves-pattern.jpg')] opacity-10 bg-cover bg-center" />

          <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 text-balance">
              Tu próxima canción está esperando
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Únete a miles de compositores e intérpretes que ya están creando juntos. Comienza gratis hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-base bg-background text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/register">
                  Crear cuenta gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                asChild
              >
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
