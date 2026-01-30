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

import { getCountriesWithColombiaFirst } from "../utils/getCountriesWithColombiaFirst";

export interface CountryCodeSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
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
    [],
  );

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {countriesList.map(([isoCode, country]) => {
            const dialCode = country.phone?.[0];
            if (!dialCode) return null;

            return (
              <SelectItem key={isoCode} value={`+${dialCode}`}>
                {country.name} (+{dialCode})
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
