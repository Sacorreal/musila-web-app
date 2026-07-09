import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card';

const TIERS = [
  {
    name: 'Afiliado Estándar',
    requirement: 'Registro aprobado',
    firstPurchase: '20%',
    recurring: null,
    highlight: false,
    features: ['Panel de control', 'Enlace personalizado', 'Estadísticas de conversión', 'Recursos promocionales'],
  },
  {
    name: 'Embajador Musila',
    requirement: 'Mínimo 10 ventas aprobadas',
    firstPurchase: '30%',
    recurring: '20% durante 12 meses',
    highlight: true,
    features: ['Todo lo del plan Estándar', 'Aparición en campañas', 'Participación en eventos', 'Certificación oficial', 'Bono de $ 250.000 COP'],
  },
  {
    name: 'Partner Estratégico',
    requirement: 'Más de 50 ventas + convenio',
    firstPurchase: '40%',
    recurring: '30% durante 12 meses',
    highlight: false,
    features: ['Todo lo del plan Embajador', 'Acceso anticipado a funciones', 'Co-marketing', 'Material exclusivo', 'Bono de $ 500.000 COP'],
  },
];

export function CommissionTiersTable() {
  return (
    <section className="py-16 sm:py-20 md:py-24 border-t border-border/50" id="comisiones">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Niveles de comisión</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Empieza como Afiliado Estándar y sube de nivel a medida que generas más ventas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={tier.highlight ? 'border-primary shadow-lg shadow-primary/10 relative' : 'relative'}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                  Más popular
                </span>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{tier.requirement}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-black text-primary">{tier.firstPurchase}</p>
                  <p className="text-xs text-muted-foreground">de la primera compra</p>
                  {tier.recurring && (
                    <p className="text-xs text-muted-foreground mt-1">+ {tier.recurring} en pagos recurrentes</p>
                  )}
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/60 text-center mt-8 max-w-2xl mx-auto leading-relaxed">
          Ventana de atribución de 60 días desde el registro hasta la compra. Las comisiones
          recurrentes se reconocen solo mientras la suscripción del usuario referido permanezca
          activa. Monto mínimo de retiro: $100.000 COP. Pagos procesados mensualmente.
        </p>
      </div>
    </section>
  );
}
