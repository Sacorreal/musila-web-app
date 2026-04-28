import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import type { CreateRequestedTrackInput } from "@/src/domains/tracks/types/track.types";
import { TrackRequest } from "../types/request.types";
import axios from "axios";

export interface RequestedTrackResponse {
  id: string;
  status: string;
  licenseType: string;
  chat: {
    id: string;
  };
  [key: string]: any;
}

/** Error tipado para solicitudes duplicadas (409 del backend) */
export interface ConflictErrorDetails {
  trackId: string;
  currentStatus: string;
  requestId: string;
}

export class ConflictRequestError extends Error {
  readonly statusCode = 409;
  readonly details: ConflictErrorDetails;

  constructor(message: string, details: ConflictErrorDetails) {
    super(message);
    this.name = "ConflictRequestError";
    this.details = details;
  }
}

export async function createRequestedTrack(input: CreateRequestedTrackInput): Promise<RequestedTrackResponse> {
  try {
    const { data } = await apiClient.post<RequestedTrackResponse>(
      apiURLs.requestedTracks.base,
      input
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      const body = error.response.data as {
        message: string;
        details: ConflictErrorDetails;
      };
      throw new ConflictRequestError(body.message, body.details);
    }
    throw error;
  }
}

export async function updateRequestedTrack(id: string, input: Partial<TrackRequest>): Promise<RequestedTrackResponse> {
  try {
    const { data } = await apiClient.put<RequestedTrackResponse>(
      apiURLs.requestedTracks.byId(id),
      input
    );
    return data;
  } catch (error) {
    throw error;
  }
}
