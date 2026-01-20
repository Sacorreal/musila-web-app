const steps = [
  {
    number: "01",
    title: "Crea tu cuenta",
    description: "Regístrate como compositor o intérprete. Es gratis y solo toma un minuto.",
    image: "/person-signing-up-on-laptop-music-app.jpg",
  },
  {
    number: "02",
    title: "Explora o publica",
    description: "Los compositores suben sus canciones. Los intérpretes descubren nuevo material.",
    image: "/musician-uploading-music-to-computer.jpg",
  },
  {
    number: "03",
    title: "Conecta y colabora",
    description: "Solicita el uso de canciones o recibe solicitudes. Negocia y acuerda términos.",
    image: "/two-musicians-collaborating-shaking-hands.jpg",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Cómo funciona Músila</h2>
          <p className="text-lg text-muted-foreground">
            Un proceso simple para conectar el talento creativo con las voces que darán vida a las canciones.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                <span className="text-5xl font-bold text-primary/30">{step.number}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">{step.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border">
                  <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
