export const es = {
  nav: {
    features: 'Características',
    howItWorks: 'Cómo funciona',
    testimonials: 'Testimonios',
    pricing: 'Precios',
    login: 'Iniciar sesión',
    getStarted: 'Comenzar gratis',
  },
  hero: {
    badge: 'Plataforma activa',
    title: 'Descubre canciones',
    titleHighlight: 'inéditas',
    titleSuffix: 'de todos los géneros musicales',
    description:
      'Conectamos compositores con intérpretes. Publica tus canciones inéditas y permite que otros artistas las lleven al siguiente nivel.',
    cta: 'Comenzar ahora',
    ctaSecondary: 'Ver cómo funciona',
  },
  features: {
    title: 'Todo lo que necesitas para tu música',
    subtitle:
      'Una plataforma completa diseñada para compositores e intérpretes que buscan nuevas oportunidades.',
    items: [
      {
        title: 'Canciones Inéditas',
        description: 'Accede a un catálogo exclusivo de canciones que nunca han sido grabadas comercialmente.',
      },
      {
        title: 'Solicita Uso',
        description: 'Los intérpretes pueden solicitar permiso para grabar las canciones que les interesen.',
      },
      {
        title: 'Publica tu Música',
        description: 'Compositores pueden subir sus creaciones y mantener el control de su propiedad intelectual.',
      },
      {
        title: 'Crea Playlists',
        description: 'Organiza tus canciones favoritas en listas de reproducción personalizadas.',
      },
      {
        title: 'Propiedad Protegida',
        description: 'Tu música está protegida. Controlamos el registro de propiedad intelectual.',
      },
      {
        title: 'Comunidad Activa',
        description: 'Conecta con otros artistas, colabora y haz crecer tu red profesional.',
      },
    ],
  },
  howItWorks: {
    title: 'Cómo funciona Músila',
    subtitle: 'Un proceso simple para conectar el talento creativo con las voces que darán vida a las canciones.',
    steps: [
      {
        title: 'Crea tu cuenta',
        description: 'Regístrate como compositor o intérprete. Es gratis y solo toma un minuto.',
      },
      {
        title: 'Explora o publica',
        description: 'Los compositores suben sus canciones. Los intérpretes descubren nuevo material.',
      },
      {
        title: 'Conecta y colabora',
        description: 'Solicita el uso de canciones o recibe solicitudes. Negocia y acuerda términos.',
      },
    ],
  },
  testimonials: {
    title: 'Lo que dicen nuestros artistas',
    subtitle: 'Historias de éxito de compositores e intérpretes que encontraron su match perfecto.',
    items: [
      {
        quote:
          'Músila me permitió encontrar una canción perfecta para mi próximo álbum. El proceso de solicitud fue simple y el compositor fue muy profesional.',
        author: 'María González',
        role: 'Cantante',
        avatar: '/female-singer-portrait.png',
      },
      {
        quote:
          'Como compositor, siempre tuve canciones guardadas. Ahora puedo compartirlas con artistas que realmente las aprecian y las llevan a otro nivel.',
        author: 'Roberto Sánchez',
        role: 'Compositor',
        avatar: '/male-composer-portrait.jpg',
      },
      {
        quote:
          'La protección de propiedad intelectual me da tranquilidad. Sé que mi trabajo está seguro mientras busco el intérprete perfecto.',
        author: 'Ana Martínez',
        role: 'Compositora',
        avatar: '/female-musician-portrait.png',
      },
    ],
  },
  pricing: {
    title: 'Planes para cada artista',
    subtitle: 'Empieza gratis y crece con tu música. Sin límites cuando estés listo.',
    monthly: 'Mensual',
    annual: 'Anual',
    showFreePlans: 'Ver planes gratuitos',
    securePay: '🔒 Pagos seguros',
    processedBy: '💳 Procesado por Mercado Pago',
    noHiddenFees: '✅ Sin cargos ocultos',
    cancelAnytime: '🔄 Cancelación en cualquier momento',
    freeLabel: 'Gratis',
    estimatedPrice: 'Precio estimado. El cobro se realiza en COP.',
    switchToAnnual: 'Cambia a anual y ahorra',
    yearlyTotal: '/año · Ahorras',
    perMonth: '/mes',
    perYear: '/año',
    redirecting: 'Redirigiendo...',
    paymentError: 'No se pudo iniciar el proceso de pago',
    tryAgain: 'Intenta nuevamente.',
    billingLabels: {
      'por mes': 'por mes',
      'pago único': 'pago único',
    } as Record<string, string>,
    planFeatures: {
      'Canciones ilimitadas': 'Canciones ilimitadas',
      'Solicitudes ilimitadas': 'Solicitudes ilimitadas',
      'Hasta 5 colaboradores': 'Hasta 5 colaboradores',
      'Playlists ilimitadas': 'Playlists ilimitadas',
      'Búsqueda ilimitada': 'Búsqueda ilimitada',
      'Solicitudes ilimitadas recibidas': 'Solicitudes ilimitadas recibidas',
      'Acceso de por vida': 'Acceso de por vida',
      'Hasta 3 canciones': 'Hasta 3 canciones',
      'Hasta 3 solicitudes': 'Hasta 3 solicitudes',
      'Hasta 2 colaboradores': 'Hasta 2 colaboradores',
      'Hasta 1 playlist': 'Hasta 1 playlist',
    } as Record<string, string>,
    planBadges: {
      '⭐ Más Popular': '⭐ Más Popular',
      '🚀 Crecimiento Profesional': '🚀 Crecimiento Profesional',
      '🔥 Acceso Vitalicio': '🔥 Acceso Vitalicio',
    } as Record<string, string>,
    planCtas: {
      'Suscribirme Ahora': 'Suscribirme Ahora',
      'Obtener Acceso': 'Obtener Acceso',
      'Comenzar Gratis': 'Comenzar Gratis',
    } as Record<string, string>,
    planMainBenefits: {
      'Licencias ilimitadas': 'Licencias ilimitadas',
      'Canciones ilimitadas': 'Canciones ilimitadas',
      'Acceso de por vida': 'Acceso de por vida',
      'Empieza a colaborar': 'Empieza a colaborar',
      'Publica tus primeras canciones': 'Publica tus primeras canciones',
      'Descubre el catálogo': 'Descubre el catálogo',
    } as Record<string, string>,
    comparator: {
      title: 'Comparador de planes',
      ariaLabel: 'Comparador de planes Musila',
      headers: [
        'Característica',
        'Autor Free',
        'Autor Pro',
        'Cantautor Free',
        'Cantautor Pro',
        'Intérprete Free',
        'Intérprete Pro',
      ],
      rows: [
        {
          feature: 'Canciones permitidas',
          autor_free: 'Hasta 3',
          autor_pro: 'Ilimitadas',
          cantautor_free: 'Hasta 3',
          cantautor_pro: 'Ilimitadas',
          interprete_free: '—',
          interprete_pro: '—',
        },
        {
          feature: 'Solicitudes de licencia',
          autor_free: '—',
          autor_pro: 'Ilimitadas (recibe)',
          cantautor_free: 'Hasta 3',
          cantautor_pro: 'Ilimitadas',
          interprete_free: 'Hasta 3',
          interprete_pro: 'Ilimitadas',
        },
        {
          feature: 'Colaboradores',
          autor_free: '—',
          autor_pro: '—',
          cantautor_free: 'Hasta 2',
          cantautor_pro: 'Hasta 5',
          interprete_free: 'Hasta 2',
          interprete_pro: 'Hasta 5',
        },
        {
          feature: 'Playlists',
          autor_free: '—',
          autor_pro: '—',
          cantautor_free: 'Hasta 1',
          cantautor_pro: 'Ilimitadas',
          interprete_free: 'Hasta 1',
          interprete_pro: 'Ilimitadas',
        },
        {
          feature: 'Búsqueda',
          autor_free: 'Ilimitada',
          autor_pro: 'Ilimitada',
          cantautor_free: 'Ilimitada',
          cantautor_pro: 'Ilimitada',
          interprete_free: 'Ilimitada',
          interprete_pro: 'Ilimitada',
        },
        {
          feature: 'Modalidad de pago',
          autor_free: 'Gratis',
          autor_pro: 'Mensual',
          cantautor_free: 'Gratis',
          cantautor_pro: 'Mensual',
          interprete_free: 'Gratis',
          interprete_pro: 'Pago único',
        },
        {
          feature: 'Precio',
          autor_free: 'Gratis',
          autor_pro: '$39.900 COP/mes',
          cantautor_free: 'Gratis',
          cantautor_pro: '$59.900 COP/mes',
          interprete_free: 'Gratis',
          interprete_pro: '$249.900 COP',
        },
      ],
    },
  },
  faq: {
    title: 'Preguntas frecuentes',
    subtitle: 'Todo lo que necesitas saber sobre los planes de Musila.',
    ariaLabel: 'Preguntas frecuentes',
    items: [
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
    ],
  },
  cta: {
    title: 'Tu próxima canción está esperando',
    subtitle: 'Únete a miles de compositores e intérpretes que ya están creando juntos. Comienza gratis hoy.',
    createAccount: 'Crear cuenta gratis',
    haveAccount: 'Ya tengo cuenta',
  },
  footer: {
    description: 'La plataforma que conecta compositores con intérpretes. Canciones inéditas listas para ser grabadas.',
    platform: 'Plataforma',
    explore: 'Explorar',
    uploadMusic: 'Subir música',
    legal: 'Legal',
    privacy: 'Privacidad',
    terms: 'Términos',
    rights: 'Todos los derechos reservados.',
  },
};
