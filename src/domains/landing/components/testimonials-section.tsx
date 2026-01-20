import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Músila me permitió encontrar una canción perfecta para mi próximo álbum. El proceso de solicitud fue simple y el compositor fue muy profesional.",
    author: "María González",
    role: "Cantante",
    avatar: "/female-singer-portrait.png",
  },
  {
    quote:
      "Como compositor, siempre tuve canciones guardadas. Ahora puedo compartirlas con artistas que realmente las aprecian y las llevan a otro nivel.",
    author: "Roberto Sánchez",
    role: "Compositor",
    avatar: "/male-composer-portrait.jpg",
  },
  {
    quote:
      "La protección de propiedad intelectual me da tranquilidad. Sé que mi trabajo está seguro mientras busco el intérprete perfecto.",
    author: "Ana Martínez",
    role: "Compositora",
    avatar: "/female-musician-portrait.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Lo que dicen nuestros artistas
          </h2>
          <p className="text-lg text-muted-foreground">
            Historias de éxito de compositores e intérpretes que encontraron su match perfecto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative p-8 rounded-2xl bg-background border border-border">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              <p className="text-muted-foreground mb-6 leading-relaxed">{`"${testimonial.quote}"`}</p>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
