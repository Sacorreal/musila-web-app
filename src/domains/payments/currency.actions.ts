'use server';

import { cache } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  isCOP: boolean;
}

async function detectCountryCode(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
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

