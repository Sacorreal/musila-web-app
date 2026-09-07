export const en = {
  nav: {
    features: 'Features',
    howItWorks: 'How it works',
    testimonials: 'Testimonials',
    pricing: 'Pricing',
    login: 'Log in',
    getStarted: 'Get started free',
  },
  hero: {
    badge: 'Platform live',
    title: 'Discover',
    titleHighlight: 'unreleased',
    titleSuffix: 'songs across all music genres',
    description:
      'We connect songwriters with performers. Publish your unreleased songs and let other artists take them to the next level.',
    cta: 'Get started',
    ctaSecondary: 'See how it works',
  },
  features: {
    title: 'Everything you need for your music',
    subtitle: 'A complete platform designed for songwriters and performers looking for new opportunities.',
    items: [
      {
        title: 'Unreleased Songs',
        description: 'Access an exclusive catalog of songs that have never been commercially recorded.',
      },
      {
        title: 'Request Usage',
        description: 'Performers can request permission to record songs they are interested in.',
      },
      {
        title: 'Publish Your Music',
        description: 'Songwriters can upload their creations and maintain control over their intellectual property.',
      },
      {
        title: 'Create Playlists',
        description: 'Organize your favorite songs into personalized playlists.',
      },
      {
        title: 'Protected Property',
        description: 'Your music is protected. We control intellectual property registration.',
      },
      {
        title: 'Active Community',
        description: 'Connect with other artists, collaborate and grow your professional network.',
      },
    ],
  },
  howItWorks: {
    title: 'How Músila works',
    subtitle: 'A simple process to connect creative talent with the voices that will bring songs to life.',
    steps: [
      {
        title: 'Create your account',
        description: "Sign up as a songwriter or performer. It's free and only takes a minute.",
      },
      {
        title: 'Explore or publish',
        description: 'Songwriters upload their songs. Performers discover new material.',
      },
      {
        title: 'Connect and collaborate',
        description: 'Request song usage or receive requests. Negotiate and agree on terms.',
      },
    ],
  },
  testimonials: {
    title: 'What our artists say',
    subtitle: 'Success stories from songwriters and performers who found their perfect match.',
    items: [
      {
        quote:
          'Músila allowed me to find the perfect song for my next album. The request process was simple and the composer was very professional.',
        author: 'María González',
        role: 'Singer',
        avatar: '/female-singer-portrait.png',
      },
      {
        quote:
          'As a songwriter, I always had songs stored away. Now I can share them with artists who truly appreciate them and take them to another level.',
        author: 'Roberto Sánchez',
        role: 'Songwriter',
        avatar: '/male-composer-portrait.jpg',
      },
      {
        quote:
          'Intellectual property protection gives me peace of mind. I know my work is safe while I search for the perfect performer.',
        author: 'Ana Martínez',
        role: 'Songwriter',
        avatar: '/female-musician-portrait.png',
      },
    ],
  },
  pricing: {
    title: 'Plans for every artist',
    subtitle: "Start free and grow with your music. No limits when you're ready.",
    monthly: 'Monthly',
    annual: 'Annual',
    showFreePlans: 'View free plans',
    securePay: '🔒 Secure payments',
    processedBy: '💳 Processed by Mercado Pago',
    noHiddenFees: '✅ No hidden fees',
    cancelAnytime: '🔄 Cancel anytime',
    freeLabel: 'Free',
    estimatedPrice: 'Estimated price. Charged in COP.',
    switchToAnnual: 'Switch to annual and save',
    yearlyTotal: '/year · You save',
    perMonth: '/month',
    perYear: '/year',
    redirecting: 'Redirecting...',
    paymentError: 'Could not start the payment process',
    tryAgain: 'Please try again.',
    billingLabels: {
      'por mes': '/month',
      'pago único': 'one-time',
    } as Record<string, string>,
    planFeatures: {
      'Canciones ilimitadas': 'Unlimited songs',
      'Solicitudes ilimitadas': 'Unlimited requests',
      'Hasta 5 colaboradores': 'Up to 5 collaborators',
      'Playlists ilimitadas': 'Unlimited playlists',
      'Búsqueda ilimitada': 'Unlimited search',
      'Solicitudes ilimitadas recibidas': 'Unlimited incoming requests',
      'Acceso de por vida': 'Lifetime access',
      'Hasta 3 canciones': 'Up to 3 songs',
      'Hasta 3 solicitudes': 'Up to 3 requests',
      'Hasta 2 colaboradores': 'Up to 2 collaborators',
      'Hasta 1 playlist': 'Up to 1 playlist',
    } as Record<string, string>,
    planBadges: {
      '⭐ Más Popular': '⭐ Most Popular',
      '🚀 Crecimiento Profesional': '🚀 Professional Growth',
      '🔥 Acceso Vitalicio': '🔥 Lifetime Access',
    } as Record<string, string>,
    planCtas: {
      'Suscribirme Ahora': 'Subscribe Now',
      'Obtener Acceso': 'Get Access',
      'Comenzar Gratis': 'Start Free',
    } as Record<string, string>,
    planMainBenefits: {
      'Licencias ilimitadas': 'Unlimited licenses',
      'Canciones ilimitadas': 'Unlimited songs',
      'Acceso de por vida': 'Lifetime access',
      'Empieza a colaborar': 'Start collaborating',
      'Publica tus primeras canciones': 'Publish your first songs',
      'Descubre el catálogo': 'Discover the catalog',
    } as Record<string, string>,
    comparator: {
      title: 'Plan comparator',
      ariaLabel: 'Musila plan comparator',
      headers: [
        'Feature',
        'Autor Plan Free',
        'Autor Plan Pro',
        '360 Plan Free',
        '360 Plan Pro',
        'Descubridor Plan Free',
        'Descubridor Plan Pro',
      ],
      rows: [
        {
          feature: 'Allowed songs',
          plan_autor_free: 'Up to 3',
          plan_autor_pro: 'Unlimited',
          plan_360_free: 'Up to 3',
          plan_360_pro: 'Unlimited',
          plan_descubridor_free: '—',
          plan_descubridor_pro: '—',
        },
        {
          feature: 'License requests',
          plan_autor_free: '—',
          plan_autor_pro: 'Unlimited (receives)',
          plan_360_free: 'Up to 3',
          plan_360_pro: 'Unlimited',
          plan_descubridor_free: 'Up to 3',
          plan_descubridor_pro: 'Unlimited',
        },
        {
          feature: 'Collaborators',
          plan_autor_free: '—',
          plan_autor_pro: '—',
          plan_360_free: 'Up to 2',
          plan_360_pro: 'Up to 5',
          plan_descubridor_free: 'Up to 2',
          plan_descubridor_pro: 'Up to 5',
        },
        {
          feature: 'Playlists',
          plan_autor_free: '—',
          plan_autor_pro: '—',
          plan_360_free: 'Up to 1',
          plan_360_pro: 'Unlimited',
          plan_descubridor_free: 'Up to 1',
          plan_descubridor_pro: 'Unlimited',
        },
        {
          feature: 'Search',
          plan_autor_free: 'Unlimited',
          plan_autor_pro: 'Unlimited',
          plan_360_free: 'Unlimited',
          plan_360_pro: 'Unlimited',
          plan_descubridor_free: 'Unlimited',
          plan_descubridor_pro: 'Unlimited',
        },
        {
          feature: 'Payment type',
          plan_autor_free: 'Free',
          plan_autor_pro: 'Monthly',
          plan_360_free: 'Free',
          plan_360_pro: 'Monthly',
          plan_descubridor_free: 'Free',
          plan_descubridor_pro: 'One-time',
        },
        {
          feature: 'Price',
          plan_autor_free: 'Free',
          plan_autor_pro: '$39.900 COP/month',
          plan_360_free: 'Free',
          plan_360_pro: '$59.900 COP/month',
          plan_descubridor_free: 'Free',
          plan_descubridor_pro: '$249.900 COP',
        },
      ],
    },
  },
  faq: {
    title: 'Frequently asked questions',
    subtitle: "Everything you need to know about Musila's plans.",
    ariaLabel: 'Frequently asked questions',
    items: [
      {
        question: 'Can I change my plan?',
        answer:
          'Yes. You can upgrade your plan at any time from the pricing section. Your new plan activates immediately after confirming payment.',
      },
      {
        question: 'Can I cancel my subscription?',
        answer:
          'Yes. Monthly plans (Plan Autor Pro and Plan 360 Pro) can be cancelled whenever you wish. You will keep access until the end of the already paid period.',
      },
      {
        question: 'What does lifetime access include?',
        answer:
          'The lifetime access of the Plan Descubridor Pro grants permanent access to all plan features through a single payment of $249,900 COP. There will be no recurring charges or renewals.',
      },
      {
        question: 'How do license requests work?',
        answer:
          'License requests allow performers and singer-songwriters to request authorization from composers to use their unreleased songs published on Musila. Each request includes the type of license required.',
      },
      {
        question: 'What happens if I reach my free plan limit?',
        answer:
          'You can upgrade to a Pro plan to unlock additional features and remove restrictions. In the meantime, you can continue enjoying the features already created within your plan.',
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept credit card, debit card and PSE (Online Secure Payments) through Mercado Pago. All payments are processed securely in Colombian pesos (COP).',
      },
      {
        question: 'Are taxes included in the prices?',
        answer:
          'The prices shown are the final amounts to pay. There are no hidden charges or additional taxes on the indicated value.',
      },
    ],
  },
  cta: {
    title: 'Your next song is waiting',
    subtitle: 'Join thousands of songwriters and performers already creating together. Start free today.',
    createAccount: 'Create free account',
    haveAccount: 'I already have an account',
  },
  footer: {
    description: 'The platform that connects songwriters with performers. Unreleased songs ready to be recorded.',
    platform: 'Platform',
    explore: 'Explore',
    uploadMusic: 'Upload music',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    rights: 'All rights reserved.',
  },
};
