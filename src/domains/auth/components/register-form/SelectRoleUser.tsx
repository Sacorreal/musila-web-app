import { UserRoleRegister } from "@domains/users/types/user.type";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/UI/select";

export function SelectRoleUser() {
  const roleOptions = Object.entries(UserRoleRegister).map(([key, value]) => (
    <SelectItem value={key} key={key}>
      {value}
    </SelectItem>
  ));

  return (
    <Select>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Selecciona un rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{roleOptions}</SelectGroup>
      </SelectContent>
    </Select>
  );
}
