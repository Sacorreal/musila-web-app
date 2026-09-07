"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import {
  getMyLegalIdentityAction,
  updateMyLegalIdentityAction,
} from "../services/legal-identity.actions";
import { LegalIdentityFormValues } from "../schema/legal-identity.schema";

export const LEGAL_IDENTITY_QUERY_KEY = "legal-identity";

export function useLegalIdentity() {
  return useQuery({
    queryKey: [LEGAL_IDENTITY_QUERY_KEY],
    queryFn: getMyLegalIdentityAction,
  });
}

export function useUpdateLegalIdentity() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: LegalIdentityFormValues) => updateMyLegalIdentityAction(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [LEGAL_IDENTITY_QUERY_KEY] });
      setUser({ identidadLegalVerificada: result.identidadLegalVerificada } as any);
      toast.success("Identidad legal verificada correctamente");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo guardar tu identidad legal");
    },
  });
}
