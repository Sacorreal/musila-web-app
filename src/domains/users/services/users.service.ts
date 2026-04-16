"use client";

import { apiClient } from "@/src/shared/libs/axios/axios-client";
import type { CreateUserInput, UpdateUserInput, UserDto } from "@/src/domains/users/types/user.types";

type ServiceResult<T> = {
  data?: T;
  error?: string;
};

export type UpdateUserServiceInput = UpdateUserInput;

export const usersService = {
  async getAuthorById(id: string): Promise<ServiceResult<UserDto>> {
    try {
      const { data } = await apiClient.get<UserDto>(`/users/${id}`);
      return { data };
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al obtener el usuario";
      return { error: message };
    }
  },

  async update(id: string, input: UpdateUserServiceInput): Promise<ServiceResult<null>> {
    try {
      await apiClient.patch(`/users/${id}`, input);
      return {};
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al actualizar el usuario";
      return { error: message };
    }
  },

  async create(input: CreateUserInput): Promise<ServiceResult<UserDto>> {
    try {
      const { data } = await apiClient.post<UserDto>("/users", input);
      return { data };
    } catch (error: any) {
      const message = error.response?.data?.message ?? "Error al crear el usuario";
      return { error: message };
    }
  },
};

