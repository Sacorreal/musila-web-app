"use client";

import { apiClient } from "@/src/shared/libs/axios/axios-client";
import type { CreateUserDTO, UpdateUserDTO, User } from "@/src/domains/users/types/user.types";

type ServiceResult<T> = {
  data?: T;
  error?: string;
};

export type UpdateUserInput = UpdateUserDTO;

export const usersService = {
  async getAuthorById(id: string): Promise<ServiceResult<User>> {
    try {
      const { data } = await apiClient.get<User>(`/users/${id}`);
      return { data };
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al obtener el usuario";
      return { error: message };
    }
  },

  async update(id: string, input: UpdateUserInput): Promise<ServiceResult<null>> {
    try {
      await apiClient.patch(`/users/${id}`, input);
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al actualizar el usuario";
      return { error: message };
    }
  },

  async create(input: CreateUserDTO): Promise<ServiceResult<User>> {
    try {
      const { data } = await apiClient.post<User>("/users", input);
      return { data };
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al crear el usuario";
      return { error: message };
    }
  },
};

