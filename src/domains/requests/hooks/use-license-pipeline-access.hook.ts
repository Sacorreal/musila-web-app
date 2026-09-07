"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { useMyMemberships } from "@/src/domains/organizations/organizations.hooks";
import { UserPlanType, isAdminPlanType } from "@/src/domains/users/types/user.types";

/** Planes de usuario con acceso al pipeline de licencias. */
const PIPELINE_PLAN_TYPES: readonly string[] = [
  UserPlanType.PLAN_AUTOR,
  UserPlanType.PLAN_360,
];

/** Tipo de organización con acceso al pipeline de licencias. */
const PIPELINE_ORGANIZATION_TYPE = "PUBLISHER";

/**
 * Determina si el usuario actual puede ver el pipeline de licencias.
 *
 * Habilitado para:
 * - Usuarios con plan Autor o 360 (y planes administrativos, que ven todo).
 * - Miembros de una organización de tipo Publisher.
 *
 * La consulta de membresías se comparte vía React Query, por lo que invocar
 * este hook en múltiples filas no genera peticiones adicionales.
 */
export function useCanUseLicensePipeline(): boolean {
  const planType = useAuthStore((s) => s.user?.planType);
  const { data: memberships } = useMyMemberships();

  return useMemo(() => {
    if (isAdminPlanType(planType)) return true;
    if (planType && PIPELINE_PLAN_TYPES.includes(planType)) return true;

    return !!memberships?.organizationMemberships?.some(
      (membership) => membership.organization?.type === PIPELINE_ORGANIZATION_TYPE,
    );
  }, [planType, memberships]);
}
