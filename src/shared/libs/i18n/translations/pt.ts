export const pt = {
  nav: {
    features: 'Funcionalidades',
    howItWorks: 'Como funciona',
    testimonials: 'Depoimentos',
    pricing: 'Preços',
    login: 'Entrar',
    getStarted: 'Começar grátis',
  },
  hero: {
    badge: 'Plataforma ativa',
    title: 'Descubra músicas',
    titleHighlight: 'inéditas',
    titleSuffix: 'de todos os gêneros musicais',
    description:
      'Conectamos compositores com intérpretes. Publique suas músicas inéditas e permita que outros artistas as levem ao próximo nível.',
    cta: 'Começar agora',
    ctaSecondary: 'Ver como funciona',
  },
  features: {
    title: 'Tudo o que você precisa para sua música',
    subtitle: 'Uma plataforma completa projetada para compositores e intérpretes que buscam novas oportunidades.',
    items: [
      {
        title: 'Músicas Inéditas',
        description: 'Acesse um catálogo exclusivo de músicas que nunca foram gravadas comercialmente.',
      },
      {
        title: 'Solicite Uso',
        description: 'Os intérpretes podem solicitar permissão para gravar as músicas de seu interesse.',
      },
      {
        title: 'Publique sua Música',
        description: 'Compositores podem enviar suas criações e manter o controle de sua propriedade intelectual.',
      },
      {
        title: 'Crie Playlists',
        description: 'Organize suas músicas favoritas em listas de reprodução personalizadas.',
      },
      {
        title: 'Propriedade Protegida',
        description: 'Sua música está protegida. Controlamos o registro de propriedade intelectual.',
      },
      {
        title: 'Comunidade Ativa',
        description: 'Conecte-se com outros artistas, colabore e expanda sua rede profissional.',
      },
    ],
  },
  howItWorks: {
    title: 'Como o Músila funciona',
    subtitle: 'Um processo simples para conectar talentos criativos com as vozes que darão vida às músicas.',
    steps: [
      {
        title: 'Crie sua conta',
        description: 'Cadastre-se como compositor ou intérprete. É gratuito e leva apenas um minuto.',
      },
      {
        title: 'Explore ou publique',
        description: 'Os compositores enviam suas músicas. Os intérpretes descobrem novo material.',
      },
      {
        title: 'Conecte e colabore',
        description: 'Solicite o uso de músicas ou receba solicitações. Negocie e acorde os termos.',
      },
    ],
  },
  testimonials: {
    title: 'O que nossos artistas dizem',
    subtitle: 'Histórias de sucesso de compositores e intérpretes que encontraram sua combinação perfeita.',
    items: [
      {
        quote:
          'O Músila me permitiu encontrar a música perfeita para meu próximo álbum. O processo de solicitação foi simples e o compositor foi muito profissional.',
        author: 'María González',
        role: 'Cantora',
        avatar: '/female-singer-portrait.png',
      },
      {
        quote:
          'Como compositor, sempre tive músicas guardadas. Agora posso compartilhá-las com artistas que realmente as apreciam e as levam a outro nível.',
        author: 'Roberto Sánchez',
        role: 'Compositor',
        avatar: '/male-composer-portrait.jpg',
      },
      {
        quote:
          'A proteção de propriedade intelectual me dá tranquilidade. Sei que meu trabalho está seguro enquanto procuro o intérprete perfeito.',
        author: 'Ana Martínez',
        role: 'Compositora',
        avatar: '/female-musician-portrait.png',
      },
    ],
  },
  pricing: {
    title: 'Planos para cada artista',
    subtitle: 'Comece grátis e cresça com sua música. Sem limites quando estiver pronto.',
    monthly: 'Mensal',
    annual: 'Anual',
    showFreePlans: 'Ver planos gratuitos',
    securePay: '🔒 Pagamentos seguros',
    processedBy: '💳 Processado por Mercado Pago',
    noHiddenFees: '✅ Sem taxas ocultas',
    cancelAnytime: '🔄 Cancele a qualquer momento',
    freeLabel: 'Grátis',
    estimatedPrice: 'Preço estimado. A cobrança é feita em COP.',
    switchToAnnual: 'Mude para anual e economize',
    yearlyTotal: '/ano · Você economiza',
    perMonth: '/mês',
    perYear: '/ano',
    redirecting: 'Redirecionando...',
    paymentError: 'Não foi possível iniciar o processo de pagamento',
    tryAgain: 'Tente novamente.',
    billingLabels: {
      'por mes': '/mês',
      'pago único': 'pagamento único',
    } as Record<string, string>,
    planFeatures: {
      'Canciones ilimitadas': 'Músicas ilimitadas',
      'Solicitudes ilimitadas': 'Solicitações ilimitadas',
      'Hasta 5 colaboradores': 'Até 5 colaboradores',
      'Playlists ilimitadas': 'Playlists ilimitadas',
      'Búsqueda ilimitada': 'Pesquisa ilimitada',
      'Solicitudes ilimitadas recibidas': 'Solicitações recebidas ilimitadas',
      'Acceso de por vida': 'Acesso vitalício',
      'Hasta 3 canciones': 'Até 3 músicas',
      'Hasta 3 solicitudes': 'Até 3 solicitações',
      'Hasta 2 colaboradores': 'Até 2 colaboradores',
      'Hasta 1 playlist': 'Até 1 playlist',
    } as Record<string, string>,
    planBadges: {
      '⭐ Más Popular': '⭐ Mais Popular',
      '🚀 Crecimiento Profesional': '🚀 Crescimento Profissional',
      '🔥 Acceso Vitalicio': '🔥 Acesso Vitalício',
    } as Record<string, string>,
    planCtas: {
      'Suscribirme Ahora': 'Assinar Agora',
      'Obtener Acceso': 'Obter Acesso',
      'Comenzar Gratis': 'Começar Grátis',
    } as Record<string, string>,
    planMainBenefits: {
      'Licencias ilimitadas': 'Licenças ilimitadas',
      'Canciones ilimitadas': 'Músicas ilimitadas',
      'Acceso de por vida': 'Acesso vitalício',
      'Empieza a colaborar': 'Comece a colaborar',
      'Publica tus primeras canciones': 'Publique suas primeiras músicas',
      'Descubre el catálogo': 'Descubra o catálogo',
    } as Record<string, string>,
    comparator: {
      title: 'Comparador de planos',
      ariaLabel: 'Comparador de planos Musila',
      headers: [
        'Funcionalidade',
        'Plano Autor Free',
        'Plano Autor Pro',
        'Plano 360 Free',
        'Plano 360 Pro',
        'Plano Descubridor Free',
        'Plano Descubridor Pro',
      ],
      rows: [
        {
          feature: 'Músicas permitidas',
          plan_autor_free: 'Até 3',
          plan_autor_pro: 'Ilimitadas',
          plan_360_free: 'Até 3',
          plan_360_pro: 'Ilimitadas',
          plan_descubridor_free: '—',
          plan_descubridor_pro: '—',
        },
        {
          feature: 'Solicitações de licença',
          plan_autor_free: '—',
          plan_autor_pro: 'Ilimitadas (recebe)',
          plan_360_free: 'Até 3',
          plan_360_pro: 'Ilimitadas',
          plan_descubridor_free: 'Até 3',
          plan_descubridor_pro: 'Ilimitadas',
        },
        {
          feature: 'Colaboradores',
          plan_autor_free: '—',
          plan_autor_pro: '—',
          plan_360_free: 'Até 2',
          plan_360_pro: 'Até 5',
          plan_descubridor_free: 'Até 2',
          plan_descubridor_pro: 'Até 5',
        },
        {
          feature: 'Playlists',
          plan_autor_free: '—',
          plan_autor_pro: '—',
          plan_360_free: 'Até 1',
          plan_360_pro: 'Ilimitadas',
          plan_descubridor_free: 'Até 1',
          plan_descubridor_pro: 'Ilimitadas',
        },
        {
          feature: 'Pesquisa',
          plan_autor_free: 'Ilimitada',
          plan_autor_pro: 'Ilimitada',
          plan_360_free: 'Ilimitada',
          plan_360_pro: 'Ilimitada',
          plan_descubridor_free: 'Ilimitada',
          plan_descubridor_pro: 'Ilimitada',
        },
        {
          feature: 'Modalidade de pagamento',
          plan_autor_free: 'Grátis',
          plan_autor_pro: 'Mensal',
          plan_360_free: 'Grátis',
          plan_360_pro: 'Mensal',
          plan_descubridor_free: 'Grátis',
          plan_descubridor_pro: 'Pagamento único',
        },
        {
          feature: 'Preço',
          plan_autor_free: 'Grátis',
          plan_autor_pro: '$39.900 COP/mês',
          plan_360_free: 'Grátis',
          plan_360_pro: '$59.900 COP/mês',
          plan_descubridor_free: 'Grátis',
          plan_descubridor_pro: '$249.900 COP',
        },
      ],
    },
  },
  faq: {
    title: 'Perguntas frequentes',
    subtitle: 'Tudo o que você precisa saber sobre os planos do Musila.',
    ariaLabel: 'Perguntas frequentes',
    items: [
      {
        question: 'Posso mudar de plano?',
        answer:
          'Sim. Você pode atualizar seu plano a qualquer momento na seção de preços. Seu novo plano é ativado imediatamente após confirmar o pagamento.',
      },
      {
        question: 'Posso cancelar minha assinatura?',
        answer:
          'Sim. Os planos mensais (Plano Autor Pro e Plano 360 Pro) podem ser cancelados quando você quiser. Você manterá o acesso até o final do período já pago.',
      },
      {
        question: 'O que inclui o acesso vitalício?',
        answer:
          'O acesso vitalício do Plano Descubridor Pro concede acesso permanente a todas as funcionalidades do plano mediante um único pagamento de $249.900 COP. Não haverá cobranças recorrentes ou renovações.',
      },
      {
        question: 'Como funcionam as solicitações de licença?',
        answer:
          'As solicitações de licença permitem que intérpretes e cantores-compositores peçam autorização aos compositores para utilizar suas músicas inéditas publicadas no Musila. Cada solicitação inclui o tipo de licença necessário.',
      },
      {
        question: 'O que acontece se eu atingir o limite do meu plano gratuito?',
        answer:
          'Você poderá atualizar para um plano Pro para desbloquear funcionalidades adicionais e eliminar restrições. Enquanto isso, poderá continuar aproveitando as funções já criadas no seu plano.',
      },
      {
        question: 'Quais métodos de pagamento vocês aceitam?',
        answer:
          'Aceitamos cartão de crédito, cartão de débito e PSE (Pagamentos Seguros Online) através do Mercado Pago. Todos os pagamentos são processados de forma segura em pesos colombianos (COP).',
      },
      {
        question: 'Os preços incluem impostos?',
        answer:
          'Os preços mostrados são os valores finais a pagar. Não há cobranças ocultas nem impostos adicionais sobre o valor indicado.',
      },
    ],
  },
  cta: {
    title: 'Sua próxima música está esperando',
    subtitle: 'Junte-se a milhares de compositores e intérpretes que já estão criando juntos. Comece grátis hoje.',
    createAccount: 'Criar conta gratuita',
    haveAccount: 'Já tenho uma conta',
  },
  footer: {
    description: 'A plataforma que conecta compositores com intérpretes. Músicas inéditas prontas para serem gravadas.',
    platform: 'Plataforma',
    explore: 'Explorar',
    uploadMusic: 'Enviar música',
    legal: 'Legal',
    privacy: 'Privacidade',
    terms: 'Termos',
    rights: 'Todos os direitos reservados.',
  },
};
