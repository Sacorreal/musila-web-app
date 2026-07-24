import type { PaymentPlanType, PlanType } from '@/src/domains/payments/payments.types';

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface PlanData {
  planType: PaymentPlanType;
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
    planType: 'plan_360',
    plan: 'pro',
    name: 'Plan 360 Pro',
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
    planType: 'plan_autor',
    plan: 'pro',
    name: 'Plan Autor Pro',
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
    planType: 'plan_descubridor',
    plan: 'pro',
    name: 'Plan Descubridor Pro',
    badge: '🔥 Acceso Vitalicio',
    mainBenefit: 'Acceso de por vida',
    price: 39900,
    priceLabel: '$39.900 COP',
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
    planType: 'plan_360',
    plan: 'free',
    name: 'Plan 360 Free',
    mainBenefit: 'Empieza a colaborar',
    price: null,
    priceLabel: 'Gratis',
    billing: '',
    highlighted: false,
    cta: 'Comenzar Gratis',
    features: [
      { label: 'Hasta 5 canciones', included: true },
      { label: 'Hasta 3 solicitudes', included: true },
      { label: 'Hasta 2 colaboradores', included: true },
      { label: 'Hasta 1 playlist', included: true },
      { label: 'Búsqueda ilimitada', included: true },
    ],
  },
  {
    planType: 'plan_autor',
    plan: 'free',
    name: 'Plan Autor Free',
    mainBenefit: 'Publica tus primeras canciones',
    price: null,
    priceLabel: 'Gratis',
    billing: '',
    highlighted: false,
    cta: 'Comenzar Gratis',
    features: [
      { label: 'Hasta 5 canciones', included: true },
    ],
  },
  {
    planType: 'plan_descubridor',
    plan: 'free',
    name: 'Plan Descubridor Free',
    mainBenefit: 'Descubre el catálogo',
    price: null,
    priceLabel: 'Gratis',
    billing: '',
    highlighted: false,
    cta: 'Comenzar Gratis',
    features: [
      { label: 'Hasta 5 solicitudes', included: true },
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
  plan_autor_free: string;
  plan_autor_pro: string;
  plan_360_free: string;
  plan_360_pro: string;
  plan_descubridor_free: string;
  plan_descubridor_pro: string;
}

export const COMPARATOR_ROWS: ComparatorRow[] = [
  {
    feature: 'Canciones permitidas',
    plan_autor_free: 'Hasta 5',
    plan_autor_pro: 'Ilimitadas',
    plan_360_free: 'Hasta 5',
    plan_360_pro: 'Ilimitadas',
    plan_descubridor_free: '—',
    plan_descubridor_pro: '—',
  },
  {
    feature: 'Solicitudes de licencia',
    plan_autor_free: '—',
    plan_autor_pro: 'Ilimitadas (recibe)',
    plan_360_free: 'Hasta 3',
    plan_360_pro: 'Ilimitadas',
    plan_descubridor_free: 'Hasta 5',
    plan_descubridor_pro: 'Ilimitadas',
  },
  {
    feature: 'Colaboradores',
    plan_autor_free: '—',
    plan_autor_pro: '—',
    plan_360_free: 'Hasta 2',
    plan_360_pro: 'Hasta 5',
    plan_descubridor_free: 'Hasta 2',
    plan_descubridor_pro: 'Hasta 5',
  },
  {
    feature: 'Playlists',
    plan_autor_free: '—',
    plan_autor_pro: '—',
    plan_360_free: 'Hasta 1',
    plan_360_pro: 'Ilimitadas',
    plan_descubridor_free: 'Hasta 1',
    plan_descubridor_pro: 'Ilimitadas',
  },
  {
    feature: 'Búsqueda',
    plan_autor_free: 'Ilimitada',
    plan_autor_pro: 'Ilimitada',
    plan_360_free: 'Ilimitada',
    plan_360_pro: 'Ilimitada',
    plan_descubridor_free: 'Ilimitada',
    plan_descubridor_pro: 'Ilimitada',
  },
  {
    feature: 'Modalidad de pago',
    plan_autor_free: 'Gratis',
    plan_autor_pro: 'Mensual',
    plan_360_free: 'Gratis',
    plan_360_pro: 'Mensual',
    plan_descubridor_free: 'Gratis',
    plan_descubridor_pro: 'Pago único',
  },
  {
    feature: 'Precio',
    plan_autor_free: 'Gratis',
    plan_autor_pro: '$39.900 COP/mes',
    plan_360_free: 'Gratis',
    plan_360_pro: '$59.900 COP/mes',
    plan_descubridor_free: 'Gratis',
    plan_descubridor_pro: '$39.900 COP',
  },
];
