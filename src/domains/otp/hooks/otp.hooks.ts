"use client";

import { useMutation } from "@tanstack/react-query";
import { requestOtp, verifyOtp } from "../services/otp.actions";
import { OtpPurpose } from "../types/otp.types";

export function useRequestOtp() {
  return useMutation({
    mutationFn: ({ purpose, entityId }: { purpose: OtpPurpose; entityId: string }) =>
      requestOtp(purpose, entityId),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ purpose, entityId, code }: { purpose: OtpPurpose; entityId: string; code: string }) =>
      verifyOtp(purpose, entityId, code),
  });
}
