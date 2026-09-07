"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Globe, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/shared/components/UI/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/shared/components/UI/command";
import { cn } from "@/src/shared/libs/cn";
import { getCountriesWithColombiaFirst } from "@/src/domains/auth/utils/get-countries";
import { LicenseTerritoryMode } from "../types/license-contract.types";

interface Props {
  mode: LicenseTerritoryMode;
  countries: string[];
  onModeChange: (mode: LicenseTerritoryMode) => void;
  onCountriesChange: (countries: string[]) => void;
  disabled?: boolean;
}

export function TerritorySelector({ mode, countries, onModeChange, onCountriesChange, disabled }: Props) {
  const [open, setOpen] = React.useState(false);
  const countriesList = React.useMemo(() => getCountriesWithColombiaFirst(), []);

  const toggleCountry = (isoCode: string) => {
    if (countries.includes(isoCode)) {
      onCountriesChange(countries.filter((c) => c !== isoCode));
    } else {
      onCountriesChange([...countries, isoCode]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange(LicenseTerritoryMode.GLOBAL)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border-2 h-11 text-sm font-bold transition-all disabled:opacity-50",
            mode === LicenseTerritoryMode.GLOBAL
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40",
          )}
        >
          <Globe className="h-4 w-4" />
          Mundial
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange(LicenseTerritoryMode.SPECIFIC_COUNTRIES)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border-2 h-11 text-sm font-bold transition-all disabled:opacity-50",
            mode === LicenseTerritoryMode.SPECIFIC_COUNTRIES
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40",
          )}
        >
          <MapPin className="h-4 w-4" />
          Países específicos
        </button>
      </div>

      {mode === LicenseTerritoryMode.SPECIFIC_COUNTRIES && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-sm font-medium disabled:opacity-50"
            >
              <span className="truncate">
                {countries.length > 0 ? `${countries.length} país(es) seleccionados` : "Selecciona países"}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar país..." />
              <CommandList>
                <CommandEmpty>Sin resultados</CommandEmpty>
                <CommandGroup>
                  {countriesList.map(([isoCode, country]) => (
                    <CommandItem key={isoCode} onSelect={() => toggleCountry(isoCode)}>
                      <Check className={cn("h-4 w-4", countries.includes(isoCode) ? "opacity-100" : "opacity-0")} />
                      {country.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {mode === LicenseTerritoryMode.SPECIFIC_COUNTRIES && countries.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {countries.map((isoCode) => {
            const entry = countriesList.find(([code]) => code === isoCode);
            return (
              <span key={isoCode} className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold text-foreground">
                {entry?.[1].name ?? isoCode}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
