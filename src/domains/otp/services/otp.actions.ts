import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { OtpPurpose, RequestOtpResponse } from "../types/otp.types";

export async function requestOtp(purpose: OtpPurpose, entityId: string): Promise<RequestOtpResponse> {
  const { data } = await apiClient.post<RequestOtpResponse>(apiURLs.otp.request, {
    purpose,
    entityId,
  });
  return data;
}

export async function verifyOtp(purpose: OtpPurpose, entityId: string, code: string): Promise<{ verified: true }> {
  const { data } = await apiClient.post<{ verified: true }>(apiURLs.otp.verify, {
    purpose,
    entityId,
    code,
  });
  return data;
}
