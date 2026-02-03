"use client";

import { UserRoleRegister } from "@domains/users/types/user.type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/UI/select";

interface SelectRoleUserProps {
  value?: UserRoleRegister;
  onValueChange?: (value: UserRoleRegister) => void;
  disabled?: boolean;
}

export function SelectRoleUser({
  value,
  onValueChange,
  disabled,
}: SelectRoleUserProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona tu rol" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {Object.values(UserRoleRegister).map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
