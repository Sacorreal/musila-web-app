import type { PaymentRole, PlanType } from '@/src/domains/payments/payments.types';

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PlanData {
  role: PaymentRole;
  plan: PlanType;
  name: string;
  badge?: string;
  mainBenefit: string;
  price: number | null;
  priceLabel: string;
  billing: string;
  /** Precio mensual equivalente al facturar anualmente (solo planes con suscripción) */
  annualMonthlyPrice?: number;
  /** Total cobrado al año */
  annualTotalPrice?: number;
  features: PlanFeature[];
  cta: string;
  highlighted: boolean;
}

export const PLANS: PlanData[] = [
  {
    role: 'cantautor',
    plan: 'pro',
    name: 'Cantautor Pro',
    badge: '⭐ Más Popular',
    mainBenefit: 'Licencias ilimitadas',
    price: 59900,
    priceLabel: '$59.900 COP',
    billing: 'por mes',
    annualMonthlyPrice: 44900,
    annualTotalPrice: 539100,
    highlighted: true,
    cta: 'Suscribirme Ahora',
    features: [
      { label: 'Canciones ilimitadas', included: true },
      { label: 'Solicitudes ilimitadas', included: true },
      { label: 'Hasta 5 colaboradores', included: true },
      { label: 'Playlists ilimitadas', included: true },
      { label: 'Búsqueda ilimitada', included: true },
    ],
  },
  {
    role: 'autor',
    plan: 'pro',
    name: 'Autor Pro',
    badge: '🚀 Crecimiento Profesional',
    mainBenefit: 'Canciones ilimitadas',
    price: 39900,
    priceLabel: '$39.900 COP',
    billing: 'por mes',
    annualMonthlyPrice: 29900,
    annualTotalPrice: 359100,
    highlighted: false,
    cta: 'Suscribirme Ahora',
    features: [
      { label: 'Canciones ilimitadas', included: true },
      { label: 'Solicitudes ilimitadas recibidas', included: true },
    ],
  },
  {
    role: 'interprete',
    plan: 'pro',
    name: 'Intérprete Pro',
    badge: '🔥 Acceso Vitalicio',
    mainBenefit: 'Acceso de por vida',
    price: 249900,
    priceLabel: '$249.900 COP',
    billing: 'pago único',
    highlighted: false,
    cta: 'Obtener Acceso',
    features: [
      { label: 'Solicitudes ilimitadas', included: true },
      { label: 'Hasta 5 colaboradores', included: true },
      { label: 'Playlists ilimitadas', included: true },
      { label: 'Búsqueda ilimitada', included: true },
      { label: 'Acceso de por vida', included: true },
    ],
  },
  {
    role: 'cantautor',
    plan: 'free',
    name: 'Cantautor Free',
    mainBenefit: 'Empieza a colaborar',
    price: null,
    priceLabel: 'Gratis',
    billing: '',
    highlighted: false,
    cta: 'Comenzar Gratis',
    features: [
      { label: 'Hasta 3 canciones', included: true },
      { label: 'Hasta 3 solicitudes', included: true },
      { label: 'Hasta 2 colaboradores', included: true },
      { label: 'Hasta 1 playlist', included: true },
      { label: 'Búsqueda ilimitada', included: true },
    ],
  },
  {
    role: 'autor',
    plan: 'free',
    name: 'Autor Free',
    mainBenefit: 'Publica tus primeras canciones',
    price: null,
    priceLabel: 'Gratis',
    billing: '',
    highlighted: false,
    cta: 'Comenzar Gratis',
    features: [
      { label: 'Hasta 3 canciones', included: true },
    ],
  },
  {
    role: 'interprete',
    plan: 'free',
    name: 'Intérprete Free',
    mainBenefit: 'Descubre el catálogo',
    price: null,
    priceLabel: 'Gratis',
    billing: '',
    highlighted: false,
    cta: 'Comenzar Gratis',
    features: [
      { label: 'Hasta 3 solicitudes', included: true },
      { label: 'Hasta 2 colaboradores', included: true },
      { label: 'Hasta 1 playlist', included: true },
      { label: 'Búsqueda ilimitada', included: true },
    ],
  },
];

export const PRO_PLANS = PLANS.filter((p) => p.plan === 'pro');
export const FREE_PLANS = PLANS.filter((p) => p.plan === 'free');

export interface ComparatorRow {
  feature: string;
  autor_free: string;
  autor_pro: string;
  cantautor_free: string;
  cantautor_pro: string;
  interprete_free: string;
  interprete_pro: string;
}

export const COMPARATOR_ROWS: ComparatorRow[] = [
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
];
