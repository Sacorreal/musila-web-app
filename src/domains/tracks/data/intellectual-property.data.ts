import copyrightCmoData from "./global_copyright_cmo.json";

// ─────────────────────────────────────────────────────────
// Tipos derivados del JSON
// ─────────────────────────────────────────────────────────

export interface CopyrightOfficeOption {
  /** Código ISO del país (ej: "CO", "US") */
  countryCode: string;
  /** Nombre del país en español */
  countryName: string;
  /** Emoji flag code (código ISO) */
  flag: string;
  /** Nombre oficial de la Copyright Office */
  officeName: string;
}

export interface CmoOption {
  /** Siglas de la CMO (ej: "SAYCO") */
  acronym: string;
  /** Nombre completo */
  originalName: string;
  /** Código ISO del país */
  country: string;
  /** URL del logo */
  logo: string;
}

// ─────────────────────────────────────────────────────────
// Listas procesadas y ordenadas
// ─────────────────────────────────────────────────────────

const countriesMap = copyrightCmoData.countries as Record<
  string,
  { name: string; flag: string; copyrightOffice: { name: string } }
>;

const cmosMap = copyrightCmoData.cmos as Record<
  string,
  { acronym: string; originalName: string; country: string; logo: string }
>;

/** Lista de Copyright Offices ordenadas por nombre de país */
export const copyrightOfficeOptions: CopyrightOfficeOption[] = Object.entries(
  countriesMap
)
  .map(([code, data]) => ({
    countryCode: code,
    countryName: data.name,
    flag: data.flag,
    officeName: data.copyrightOffice.name,
  }))
  .sort((a, b) => a.countryName.localeCompare(b.countryName, "es"));

/** Lista de CMOs ordenadas por sigla */
export const cmoOptions: CmoOption[] = Object.values(cmosMap)
  .map((cmo) => ({
    acronym: cmo.acronym,
    originalName: cmo.originalName,
    country: cmo.country,
    logo: cmo.logo,
  }))
  .sort((a, b) => a.acronym.localeCompare(b.acronym));
