import { countries } from "countries-list";

export function getCountriesWithColombiaFirst() {
    const entries = Object.entries(countries);

    const colombia = entries.find(([code]) => code === "CO");

    const rest = entries
        .filter(([code]) => code !== "CO")
        .sort((a, b) => a[1].name.localeCompare(b[1].name));

    return colombia ? [colombia, ...rest] : rest;
}

let spanishRegionNames: Intl.DisplayNames | null = null;
try {
    spanishRegionNames = new Intl.DisplayNames(["es"], { type: "region" });
} catch {
    spanishRegionNames = null;
}

/** Nombre del país en español (Intl.DisplayNames); si el runtime no lo soporta, cae al nombre en inglés. */
export function getSpanishCountryName(isoCode: string, fallbackName: string): string {
    return spanishRegionNames?.of(isoCode) ?? fallbackName;
}

export interface CountryOption {
    isoCode: string;
    name: string;
}

/** Igual que `getCountriesWithColombiaFirst`, pero con el nombre localizado en español y ordenado por ese nombre. */
export function getCountriesInSpanish(): CountryOption[] {
    const entries = Object.entries(countries).map(([isoCode, country]) => ({
        isoCode,
        name: getSpanishCountryName(isoCode, country.name),
    }));

    const colombiaIndex = entries.findIndex((entry) => entry.isoCode === "CO");
    const colombia = colombiaIndex >= 0 ? entries.splice(colombiaIndex, 1)[0] : null;

    entries.sort((a, b) => a.name.localeCompare(b.name, "es"));

    return colombia ? [colombia, ...entries] : entries;
}
