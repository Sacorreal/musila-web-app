"use client";

import { apiClient } from "@/src/shared/libs/axios/axios-client";

type ServiceResult<T> = {
  data?: T;
  error?: string;
};

export interface CreateRequestInput {
  trackId: string;
  message: string;
}

export interface UpdateRequestInput {
  status: "PENDING" | "APPROVED" | "REJECTED";
  response?: string;
}

export const requestsService = {
  async getAll<T = unknown>(): Promise<ServiceResult<T>> {
    try {
      const { data } = await apiClient.get<T>("/requests");
      return { data };
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al obtener las solicitudes";
      return { error: message };
    }
  },

  async create(input: CreateRequestInput): Promise<ServiceResult<null>> {
    try {
      await apiClient.post("/requests", input);
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al crear la solicitud";
      return { error: message };
    }
  },

  async update(id: string, input: UpdateRequestInput): Promise<ServiceResult<null>> {
    try {
      await apiClient.patch(`/requests/${id}`, input);
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al actualizar la solicitud";
      return { error: message };
    }
  },
};

