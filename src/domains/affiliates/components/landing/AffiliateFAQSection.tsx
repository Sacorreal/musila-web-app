import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: '¿Cuánto puedo ganar como afiliado?',
    answer:
      'Como Afiliado Estándar ganas 20% de la primera compra de cada usuario que refieras. Al subir a Embajador (mínimo 10 ventas aprobadas) ganas 30% de la primera compra más 20% de los pagos recurrentes durante 12 meses.',
  },
  {
    question: '¿Cuándo se paga mi comisión?',
    answer:
      'Las comisiones quedan en estado "pendiente" al momento de la compra, se aprueban automáticamente a los 30 días (tiempo para verificar pagos y descartar reembolsos), y se pagan mensualmente durante los primeros 10 días hábiles de cada mes, siempre que superes el monto mínimo de retiro de $100.000 COP.',
  },
  {
    question: '¿Qué planes generan comisión?',
    answer:
      'Autor Pro, Cantautor Pro e Intérprete Pro. Los planes gratuitos, créditos promocionales y bonificaciones internas no generan comisión.',
  },
  {
    question: '¿Cómo se atribuye una venta a mi cuenta?',
    answer:
      'Cuando alguien se registra usando tu enlace, la atribución queda vigente por 60 días. Si esa persona compra un plan dentro de ese período, la comisión te corresponde a ti (último clic gana).',
  },
  {
    question: '¿Cómo subo de nivel dentro del programa?',
    answer:
      'Los niveles de Embajador y Partner se asignan por el equipo de Musila según tu volumen de ventas y, en el caso de Partner, un convenio de colaboración adicional.',
  },
];

export function AffiliateFAQSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 border-t border-border/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Preguntas frecuentes</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="group bg-card border border-border rounded-2xl px-5 py-4 open:shadow-sm transition-all"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-sm sm:text-base text-foreground">
                {faq.question}
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
