"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBankAccountAction,
  getWalletBalanceAction,
  getWalletEarningsAction,
  getWalletWithdrawalsAction,
} from "../services/wallet.actions";
import { createWithdrawalAction, updateBankAccountAction } from "../services/wallet.client";
import { BankAccountDto, CreateWithdrawalInput, WalletEarningRole, WalletWithdrawalStatus } from "../types/wallet.types";

export const WALLET_BALANCE_QUERY_KEY = "wallet-balance";
export const WALLET_EARNINGS_QUERY_KEY = "wallet-earnings";
export const WALLET_WITHDRAWALS_QUERY_KEY = "wallet-withdrawals";
export const WALLET_BANK_ACCOUNT_QUERY_KEY = "wallet-bank-account";

export function useWalletBalance() {
  return useQuery({
    queryKey: [WALLET_BALANCE_QUERY_KEY],
    queryFn: () => getWalletBalanceAction(),
  });
}

export function useWalletEarnings(limit = 10, offset = 0, role?: WalletEarningRole) {
  return useQuery({
    queryKey: [WALLET_EARNINGS_QUERY_KEY, limit, offset, role],
    queryFn: () => getWalletEarningsAction(limit, offset, role),
  });
}

export function useWalletWithdrawals(limit = 10, offset = 0, status?: WalletWithdrawalStatus) {
  return useQuery({
    queryKey: [WALLET_WITHDRAWALS_QUERY_KEY, limit, offset, status],
    queryFn: () => getWalletWithdrawalsAction(limit, offset, status),
  });
}

export function useBankAccount() {
  return useQuery({
    queryKey: [WALLET_BANK_ACCOUNT_QUERY_KEY],
    queryFn: () => getBankAccountAction(),
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWithdrawalInput) => createWithdrawalAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WALLET_BALANCE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [WALLET_WITHDRAWALS_QUERY_KEY] });
      toast.success("Solicitud de retiro creada. Te avisaremos cuando sea procesada.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudo crear la solicitud de retiro");
    },
  });
}

export function useUpdateBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BankAccountDto) => updateBankAccountAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [WALLET_BANK_ACCOUNT_QUERY_KEY] });
      toast.success("Datos bancarios actualizados");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "No se pudieron guardar los datos bancarios");
    },
  });
}
