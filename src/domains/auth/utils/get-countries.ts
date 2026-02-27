import { countries } from "countries-list";

export function getCountriesWithColombiaFirst() {
    const entries = Object.entries(countries);

    const colombia = entries.find(([code]) => code === "CO");

    const rest = entries
        .filter(([code]) => code !== "CO")
        .sort((a, b) => a[1].name.localeCompare(b[1].name));

    return colombia ? [colombia, ...rest] : rest;
}
