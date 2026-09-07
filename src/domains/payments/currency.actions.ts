'use server';

import { headers } from 'next/headers';
import { cache } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  isCOP: boolean;
}

/** Devuelve true si la IP es privada/loopback (no geolocalizable). */
function isPrivateIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('::ffff:') ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  );
}

/** Extrae la IP pública del visitante desde las cabeceras de la request. */
async function getVisitorIp(): Promise<string | null> {
  try {
    const headerList = await headers();
    // x-forwarded-for puede traer "client, proxy1, proxy2": la primera es el cliente.
    const forwarded = headerList.get('x-forwarded-for');
    const candidate =
      forwarded?.split(',')[0]?.trim() ||
      headerList.get('x-real-ip')?.trim() ||
      '';

    if (!candidate || isPrivateIp(candidate)) return null;
    return candidate;
  } catch {
    return null;
  }
}

/**
 * Lee el país desde la cabecera de geolocalización del edge del proveedor.
 * Evita la llamada externa a ipapi cuando está disponible (p. ej. en Vercel).
 */
async function getCountryFromEdgeHeader(): Promise<string | null> {
  try {
    const headerList = await headers();
    const country = headerList.get('x-vercel-ip-country')?.trim() || '';
    // Vercel usa "XX" como marcador desconocido; lo descartamos.
    if (!country || country === 'XX') return null;
    return country.toUpperCase();
  } catch {
    return null;
  }
}

async function detectCountryCode(): Promise<string> {
  // 1) Fuente primaria: cabecera de geolocalización del edge (sin llamada externa).
  const edgeCountry = await getCountryFromEdgeHeader();
  if (edgeCountry) return edgeCountry;

  // 2) Respaldo: geolocalización por IP del visitante vía ipapi.
  try {
    const ip = await getVisitorIp();
    // Con IP del visitante geolocalizamos esa IP; sin ella, ipapi usa la del requester.
    const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return 'CO';
    const data = await res.json();
    return (data.country_code as string) ?? 'CO';
  } catch {
    return 'CO';
  }
}

const COUNTRY_TO_CURRENCY: Record<string, { code: string; symbol: string }> = {
  CO: { code: 'COP', symbol: '$' },
  US: { code: 'USD', symbol: '$' },
  MX: { code: 'MXN', symbol: '$' },
  AR: { code: 'ARS', symbol: '$' },
  BR: { code: 'BRL', symbol: 'R$' },
  CL: { code: 'CLP', symbol: '$' },
  PE: { code: 'PEN', symbol: 'S/' },
  ES: { code: 'EUR', symbol: '€' },
  GB: { code: 'GBP', symbol: '£' },
  CA: { code: 'CAD', symbol: '$' },
};

export const getExchangeRate = cache(async (): Promise<CurrencyInfo> => {
  const countryCode = await detectCountryCode();
  const currencyInfo = COUNTRY_TO_CURRENCY[countryCode] ?? { code: 'USD', symbol: '$' };

  if (currencyInfo.code === 'COP') {
    return { ...currencyInfo, rate: 1, isCOP: true };
  }

  try {
    const res = await fetch(
      `https://api.exchangerate-api.com/v4/latest/COP`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error('Exchange rate API failed');
    const data = await res.json();
    const rate = data.rates?.[currencyInfo.code] as number | undefined;
    if (!rate) throw new Error('Rate not found');
    return { ...currencyInfo, rate, isCOP: false };
  } catch {
    return { code: 'COP', symbol: '$', rate: 1, isCOP: true };
  }
});

