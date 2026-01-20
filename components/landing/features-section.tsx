import { MusicNoteIcon, PlaylistIcon, RequestIcon, UploadIcon } from "@/components/icons"
import { Shield, Users } from "lucide-react"

const features = [
  {
    icon: MusicNoteIcon,
    title: "Canciones Inéditas",
    description: "Accede a un catálogo exclusivo de canciones que nunca han sido grabadas comercialmente.",
  },
  {
    icon: RequestIcon,
    title: "Solicita Uso",
    description: "Los intérpretes pueden solicitar permiso para grabar las canciones que les interesen.",
  },
  {
    icon: UploadIcon,
    title: "Publica tu Música",
    description: "Compositores pueden subir sus creaciones y mantener el control de su propiedad intelectual.",
  },
  {
    icon: PlaylistIcon,
    title: "Crea Playlists",
    description: "Organiza tus canciones favoritas en listas de reproducción personalizadas.",
  },
  {
    icon: Shield,
    title: "Propiedad Protegida",
    description: "Tu música está protegida. Controlamos el registro de propiedad intelectual.",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description: "Conecta con otros artistas, colabora y haz crecer tu red profesional.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Todo lo que necesitas para tu música
          </h2>
          <p className="text-lg text-muted-foreground">
            Una plataforma completa diseñada para compositores e intérpretes que buscan nuevas oportunidades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
