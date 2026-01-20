import { PlayIcon } from "@/src/shared/components/icons"
import { Button } from "@/src/shared/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm text-primary">Plataforma activa</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Descubre canciones <span className="text-primary">inéditas</span>
              <br />
              de todos los géneros musicales
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Conectamos compositores con intérpretes. Publica tus canciones inéditas y permite que otros artistas las
              lleven al siguiente nivel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" asChild>
                <Link href="/register">
                  Comenzar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                <Link href="#how-it-works">
                  <PlayIcon className="mr-2 h-4 w-4" />
                  Ver cómo funciona
                </Link>
              </Button>
            </div>

            
          </div>

          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 rounded-3xl blur-3xl" />
              <div className="relative bg-card rounded-3xl border border-border p-6 shadow-2xl">
                <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                  <img
                    src="/musician-composing-music-in-studio-with-guitar.jpg"
                    alt="Músico componiendo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Melodía del Alma</h3>
                      <p className="text-sm text-muted-foreground">Carlos Mendoza</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 rounded-full bg-primary text-primary-foreground"
                    >
                      <PlayIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
