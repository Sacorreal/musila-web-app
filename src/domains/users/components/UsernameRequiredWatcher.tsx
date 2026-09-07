"use client";

import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { UsernameRequiredModal } from "./UsernameRequiredModal";

export function UsernameRequiredWatcher() {
  const usernameIsTemporary = useAuthStore((s) => s.user?.usernameIsTemporary);

  return <UsernameRequiredModal open={!!usernameIsTemporary} />;
}
