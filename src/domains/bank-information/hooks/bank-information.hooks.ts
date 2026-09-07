"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyBankInformationAction,
  getPendingBankInformationStatusAction,
  getTransferOptionsAction,
} from "../services/bank-information.actions";
import { saveColombiaBankInformationAction, saveForeignBankInformationAction } from "../services/bank-information.client";
import { PendingBankInformationStatusDto } from "../types/bank-information.types";
import { ColombiaBankInformationFormValues, ForeignBankInformationFormValues } from "../bank-information.schema";

export const BANK_INFORMATION_PENDING_QUERY_KEY = "bank-information-pending";
export const BANK_INFORMATION_TRANSFER_OPTIONS_QUERY_KEY = "bank-information-transfer-options";
export const BANK_INFORMATION_ME_QUERY_KEY = "bank-information-me";

/**
 * Estado "pendiente" de configuración bancaria. Fail-open (Flow 4 del
 * requerimiento): si la consulta falla, se asume que el usuario aún no
 * completó el registro y se sigue mostrando el componente, en vez de
 * arriesgarse a dejarlo sin configurar por un error transitorio.
 */
export function useBankInformationPendingStatus() {
  return useQuery({
    queryKey: [BANK_INFORMATION_PENDING_QUERY_KEY],
    queryFn: async (): Promise<PendingBankInformationStatusDto> => {
      try {
        return await getPendingBankInformationStatusAction();
      } catch {
        return { pending: true };
      }
    },
    refetchOnWindowFocus: true,
  });
}

export function useTransferOptions(enabled: boolean) {
  return useQuery({
    queryKey: [BANK_INFORMATION_TRANSFER_OPTIONS_QUERY_KEY],
    queryFn: () => getTransferOptionsAction(),
    enabled,
    retry: 1,
  });
}

export function useMyBankInformation() {
  return useQuery({
    queryKey: [BANK_INFORMATION_ME_QUERY_KEY],
    queryFn: () => getMyBankInformationAction(),
  });
}

function useInvalidateBankInformation() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [BANK_INFORMATION_PENDING_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [BANK_INFORMATION_ME_QUERY_KEY] });
  };
}

export function useSaveColombiaBankInformation() {
  const invalidate = useInvalidateBankInformation();

  return useMutation({
    mutationFn: (data: ColombiaBankInformationFormValues) => saveColombiaBankInformationAction(data),
    onSuccess: () => {
      invalidate();
      toast.success("Información bancaria guardada");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo guardar la información bancaria");
    },
  });
}

export function useSaveForeignBankInformation() {
  const invalidate = useInvalidateBankInformation();

  return useMutation({
    mutationFn: (data: ForeignBankInformationFormValues) => saveForeignBankInformationAction(data),
    onSuccess: () => {
      invalidate();
      toast.success("Información bancaria guardada");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo guardar la información bancaria");
    },
  });
}
