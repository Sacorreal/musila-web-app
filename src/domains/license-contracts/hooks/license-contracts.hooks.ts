"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelLicenseContractAction,
  confirmLicenseRecordingAction,
  generateLicenseContractPreviewAction,
  getLicenseContractByRequestedTrackAction,
  getLicenseContractInstallmentsAction,
  rejectLicenseContractSignatoryAction,
  signLicenseContractAction,
  upsertLicenseContractTermsAction,
} from "../services/license-contracts.actions";
import { UpsertLicenseContractTermsInput } from "../types/license-contract.types";

export const LICENSE_CONTRACT_QUERY_KEY = "license-contract";
export const LICENSE_CONTRACT_INSTALLMENTS_QUERY_KEY = "license-contract-installments";

export function useLicenseContract(requestedTrackId: string | undefined) {
  return useQuery({
    queryKey: [LICENSE_CONTRACT_QUERY_KEY, requestedTrackId],
    queryFn: () => getLicenseContractByRequestedTrackAction(requestedTrackId!),
    enabled: !!requestedTrackId,
  });
}

export function useLicenseContractInstallments(contractId: string | undefined) {
  return useQuery({
    queryKey: [LICENSE_CONTRACT_INSTALLMENTS_QUERY_KEY, contractId],
    queryFn: () => getLicenseContractInstallmentsAction(contractId!),
    enabled: !!contractId,
  });
}

export function useUpsertLicenseContractTerms(requestedTrackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertLicenseContractTermsInput) =>
      upsertLicenseContractTermsAction(requestedTrackId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LICENSE_CONTRACT_QUERY_KEY, requestedTrackId] });
      toast.success("Términos de la licencia guardados");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudieron guardar los términos");
    },
  });
}

export function useGenerateLicenseContractPreview(requestedTrackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) => generateLicenseContractPreviewAction(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LICENSE_CONTRACT_QUERY_KEY, requestedTrackId] });
      toast.success("Documento generado. Cada parte debe revisarlo y firmarlo.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo generar el documento");
    },
  });
}

export function useSignLicenseContract(requestedTrackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, signatoryId }: { contractId: string; signatoryId: string }) =>
      signLicenseContractAction(contractId, signatoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LICENSE_CONTRACT_QUERY_KEY, requestedTrackId] });
      toast.success("Firmaste el contrato de licencia");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo registrar tu firma");
    },
  });
}

export function useRejectLicenseContractSignatory(requestedTrackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, signatoryId, reason }: { contractId: string; signatoryId: string; reason: string }) =>
      rejectLicenseContractSignatoryAction(contractId, signatoryId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LICENSE_CONTRACT_QUERY_KEY, requestedTrackId] });
      toast.success("Rechazaste el contrato. El compositor debe ajustar los términos.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo rechazar el contrato");
    },
  });
}

export function useConfirmLicenseRecording(requestedTrackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, isrc }: { contractId: string; isrc: string }) =>
      confirmLicenseRecordingAction(contractId, isrc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LICENSE_CONTRACT_QUERY_KEY, requestedTrackId] });
      toast.success("ISRC confirmado. La licencia quedó cumplida.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo confirmar el ISRC");
    },
  });
}

export function useCancelLicenseContract(requestedTrackId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) => cancelLicenseContractAction(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LICENSE_CONTRACT_QUERY_KEY, requestedTrackId] });
      toast.success("Borrador cancelado");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo cancelar el borrador");
    },
  });
}
