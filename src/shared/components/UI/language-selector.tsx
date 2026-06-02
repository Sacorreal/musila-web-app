'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation, type Locale } from '@/src/shared/libs/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/components/UI/dropdown-menu';
import { cn } from '@/src/shared/libs/cn';

// ─── SVG flags ────────────────────────────────────────────────────────────────

function FlagES() {
  return (
    <svg viewBox="0 0 3 2" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10" aria-hidden="true">
      <rect width="3" height="2" fill="#c60b1e" />
      <rect y=".5" width="3" height="1" fill="#ffc400" />
    </svg>
  );
}

function FlagEN() {
  return (
    <svg viewBox="0 0 60 40" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10" aria-hidden="true">
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} y={i * (40 / 13)} width="60" height={40 / 13} fill={i % 2 === 0 ? '#b22234' : '#fff'} />
      ))}
      <rect width="24" height={40 * (7 / 13)} fill="#3c3b6e" />
    </svg>
  );
}

function FlagPT() {
  return (
    <svg viewBox="0 0 4 3" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10" aria-hidden="true">
      <rect width="4" height="3" fill="#009c3b" />
      <polygon points="2,0.3 3.65,1.5 2,2.7 0.35,1.5" fill="#fedf00" />
      <circle cx="2" cy="1.5" r="0.68" fill="#002776" />
    </svg>
  );
}

const FLAGS: Record<Locale, React.FC> = { es: FlagES, en: FlagEN, pt: FlagPT };

// ─── Language data ─────────────────────────────────────────────────────────────

const LANGUAGES: { locale: Locale; label: string; short: string }[] = [
  { locale: 'es', label: 'Español', short: 'ES' },
  { locale: 'en', label: 'English', short: 'EN' },
  { locale: 'pt', label: 'Português', short: 'PT' },
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { locale, setLocale } = useTranslation();
  const current = LANGUAGES.find((l) => l.locale === locale) ?? LANGUAGES[0];
  const CurrentFlag = FLAGS[current.locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Cambiar idioma / Change language"
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium',
            'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.locale}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <CurrentFlag />
              {!compact && <span>{current.label}</span>}
              {compact && <span className="text-xs font-semibold">{current.short}</span>}
            </motion.span>
          </AnimatePresence>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[160px] p-1">
        {LANGUAGES.map(({ locale: l, label }) => {
          const Flag = FLAGS[l];
          return (
            <DropdownMenuItem
              key={l}
              onClick={() => setLocale(l)}
              className={cn(
                'flex items-center gap-2.5 cursor-pointer rounded-md px-3 py-2 text-sm transition-colors',
                l === locale
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground hover:bg-muted',
              )}
            >
              <Flag />
              <span>{label}</span>
              {l === locale && (
                <motion.span
                  layoutId="lang-active"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
