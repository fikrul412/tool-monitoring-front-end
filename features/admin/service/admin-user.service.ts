
import { api } from "@/lib/axios"; 

import type {
  AdminUser,
  CreateManagedUserPayload,
  UsersQuery,
  UsersResponse,
  UserStatus,
  Lecturer
} from "../types/admin-user.types";

export const adminUserService = {
  async getUsers(query: UsersQuery) {
    const { data } = await api.get<UsersResponse>(
      "/identity/admin/users",
      { params: query },
    );

    return data;
  },

  async getUserById(id: string) {
    const { data } = await api.get<AdminUser>(
      `/identity/admin/users/${id}`,
    );

    return data;
  },

  async createUser(payload: CreateManagedUserPayload) {
    const { data } = await api.post<AdminUser>(
      "/identity/admin/users",
      payload,
    );

    return data;
  },

  async updateUserStatus(
    id: string,
    status: Extract<UserStatus, "ACTIVE" | "SUSPENDED">,
  ) {
    const { data } = await api.patch<AdminUser>(
      `/identity/admin/users/${id}/status`,
      { status },
    );

    return data;
  },
};

export const identityService = {
  async getLecturers(search: string): Promise<Lecturer[]> {
    const response = await api.get<Lecturer[]>("/identity/lecturers", {
      params: {
        search,
        limit: 10,
      },
    });

    return response.data;
  },
};