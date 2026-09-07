"use client";

import { MusicRole, MUSIC_ROLE_LABELS } from "@/src/domains/users/types/user.types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/UI/select";

interface SelectMusicRoleProps {
  value?: MusicRole;
  onValueChange?: (value: MusicRole) => void;
  disabled?: boolean;
}

export function SelectMusicRole({
  value,
  onValueChange,
  disabled,
}: SelectMusicRoleProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona tu rol" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {Object.values(MusicRole).map((role) => (
            <SelectItem key={role} value={role}>
              {MUSIC_ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
