import { UserPlus, Link2, ShoppingCart, Wallet } from 'lucide-react';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Regístrate',
    description: 'Crea tu cuenta de afiliado en minutos con tus datos básicos y de pago.',
  },
  {
    icon: Link2,
    title: 'Comparte tu enlace',
    description: 'Obtén un enlace personalizado y compártelo con tu audiencia.',
  },
  {
    icon: ShoppingCart,
    title: 'Genera ventas',
    description: 'Cuando alguien se registra con tu enlace y compra un plan Pro dentro de 60 días, la venta queda atribuida a ti.',
  },
  {
    icon: Wallet,
    title: 'Recibe tu comisión',
    description: 'Gana hasta 30% de la primera compra, con pagos mensuales una vez aprobada la comisión.',
  },
];

export function HowItWorksSteps() {
  return (
    <section className="py-16 sm:py-20 md:py-24 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">¿Cómo funciona?</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Cuatro pasos simples para empezar a generar ingresos recomendando Musila.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative flex flex-col items-center text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Paso {i + 1}
                </span>
                <h3 className="font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
