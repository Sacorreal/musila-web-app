export enum OtpPurpose {
  REQUESTED_TRACK_APPROVAL = "requested-track-approval",
  LICENSE_SIGNING = "license-signing",
  SPLIT_SIGNING = "split-signing",
}

export type OtpChannel = "email" | "sms" | "push";

export interface RequestOtpResponse {
  channel: OtpChannel;
  expiresAt: string;
}
