'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { es } from './translations/es';
import { en } from './translations/en';
import { pt } from './translations/pt';

export type Locale = 'es' | 'en' | 'pt';
export type Translations = typeof es;

const translations: Record<Locale, Translations> = { es, en, pt };

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: 'es',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'musila-locale' },
  ),
);

export function useTranslation() {
  const { locale, setLocale } = useLanguageStore();
  return { t: translations[locale], locale, setLocale };
}
