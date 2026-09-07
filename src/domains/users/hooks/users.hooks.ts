"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/src/shared/hooks/use-debounced-value";
import { usersService } from "../services/users.service";

const USERNAME_FORMAT_REGEX = /^[A-Za-z0-9_]{3,20}$/;

/**
 * Chequea disponibilidad de un username en tiempo real (debounced). Ignora
 * `currentUsername` para no marcar como "no disponible" el propio username
 * de un usuario editando su perfil.
 */
export function useUsernameAvailability(username: string, currentUsername?: string) {
  const normalized = username.trim().replace(/^@/, "");
  const debounced = useDebouncedValue(normalized, 400);

  const isOwnUsername =
    !!currentUsername && debounced.toLowerCase() === currentUsername.toLowerCase();
  const isFormatValid = USERNAME_FORMAT_REGEX.test(debounced);
  const enabled = isFormatValid && !isOwnUsername;

  const query = useQuery({
    queryKey: ["username-availability", debounced.toLowerCase()],
    queryFn: () => usersService.checkUsernameAvailable(debounced),
    enabled,
    staleTime: 30_000,
    retry: false,
  });

  return {
    isChecking: enabled && query.isFetching,
    isAvailable: isOwnUsername ? true : query.data,
    isFormatValid,
  };
}
