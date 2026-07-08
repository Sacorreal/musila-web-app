import { LayoutDashboard, Link2, BarChart3, Image as ImageIcon, HeadphonesIcon } from 'lucide-react';

const BENEFITS = [
  { icon: LayoutDashboard, title: 'Panel de control', description: 'Sigue tus referidos, ventas y comisiones en tiempo real.' },
  { icon: Link2, title: 'Enlace personalizado', description: 'Tu propio enlace de referido, listo para compartir.' },
  { icon: BarChart3, title: 'Estadísticas de conversión', description: 'Visibilidad clara de cuántos referidos se convierten en ventas.' },
  { icon: ImageIcon, title: 'Recursos promocionales', description: 'Banners, historias y plantillas listas para usar.' },
  { icon: HeadphonesIcon, title: 'Soporte prioritario', description: 'Acompañamiento dedicado para resolver tus dudas.' },
];

export function ProgramBenefits() {
  return (
    <section className="py-16 sm:py-20 md:py-24 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Beneficios para afiliados</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Todo lo que necesitas para promocionar Musila de forma efectiva.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
