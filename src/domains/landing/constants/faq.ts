export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: '¿Puedo cambiar de plan?',
    answer:
      'Sí. Puedes actualizar tu plan en cualquier momento desde la sección de precios. Tu nuevo plan se activa inmediatamente después de confirmar el pago.',
  },
  {
    question: '¿Puedo cancelar mi suscripción?',
    answer:
      'Sí. Los planes mensuales (Autor Pro y Cantautor Pro) pueden cancelarse cuando lo desees. Conservarás el acceso hasta el final del período ya pagado.',
  },
  {
    question: '¿Qué incluye el acceso vitalicio?',
    answer:
      'El acceso vitalicio del Plan Intérprete Pro otorga acceso permanente a todas las funcionalidades del plan mediante un único pago de $249.900 COP. No habrá cargos recurrentes ni renewals.',
  },
  {
    question: '¿Cómo funcionan las solicitudes de licencia?',
    answer:
      'Las solicitudes de licencia permiten a intérpretes y cantautores pedir autorización a los compositores para utilizar sus canciones inéditas publicadas en Musila. Cada solicitud incluye el tipo de licencia requerido.',
  },
  {
    question: '¿Qué sucede si alcanzo el límite de mi plan gratuito?',
    answer:
      'Podrás actualizar a un plan Pro para desbloquear funcionalidades adicionales y eliminar restricciones. Mientras tanto, podrás seguir disfrutando de las funciones ya creadas dentro de tu plan.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjeta de crédito, tarjeta débito y PSE (Pagos Seguros en Línea) a través de Mercado Pago. Todos los pagos se procesan de forma segura en pesos colombianos (COP).',
  },
  {
    question: '¿Los precios incluyen impuestos?',
    answer:
      'Los precios mostrados son los valores finales a pagar. No hay cargos ocultos ni impuestos adicionales sobre el valor indicado.',
  },
];
