"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/UI/select";
import * as React from "react";

import { getCountriesWithColombiaFirst } from "@domains/auth/utils/getCountriesWithColombiaFirst";

export interface CountryCodeSelectProps {
  value?: string; // "+57"
  onValueChange?: (value: string) => void; // "+57"
  placeholder?: string;
  disabled?: boolean;
}

export function CountryCodeSelect({
  value,
  onValueChange,
  placeholder = "Indicativo",
  disabled,
}: CountryCodeSelectProps) {
  const countriesList = React.useMemo(
    () => getCountriesWithColombiaFirst(),
    []
  );

  /**
   * Convertimos el value externo (+57)
   * al value interno (CO|+57)
   */
  const internalValue = React.useMemo(() => {
    if (!value) return undefined;

    const match = countriesList.find(
      ([, country]) => `+${country.phone?.[0]}` === value
    );

    if (!match) return undefined;

    const [isoCode, country] = match;
    return `${isoCode}|+${country.phone?.[0]}`;
  }, [value, countriesList]);

  return (
    <Select
      value={internalValue}
      disabled={disabled}
      onValueChange={(val) => {
        // val = "CO|+57"
        const dialCode = val.split("|")[1];
        onValueChange?.(dialCode);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {countriesList.map(([isoCode, country]) => {
            const dialCode = country.phone?.[0];
            if (!dialCode) return null;

            return (
              <SelectItem
                key={isoCode} // ✅ React
                value={`${isoCode}|+${dialCode}`} // ✅ Radix (único)
              >
                {country.name} (+{dialCode})
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
