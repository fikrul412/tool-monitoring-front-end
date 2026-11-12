import { api } from "@/lib/axios";
import type {
  AssignLabManagerPayload,
  CreateLabPayload,
  GetLabsQueryParams,
  Laboratory,
  LaboratoryListResponse,
  UpdateLabPayload,
} from "../types/laboratory.types";

export const laboratoryService = {
  async getLabs(params?: GetLabsQueryParams): Promise<LaboratoryListResponse> {
    const response = await api.get<LaboratoryListResponse>("/laboratories", {
      params,
    });
    return response.data;
  },

  async getLabById(id: string): Promise<Laboratory> {
    const response = await api.get<Laboratory>(`/laboratories/${id}`);
    return response.data;
  },

  async createLab(payload: CreateLabPayload): Promise<Laboratory> {
    const response = await api.post<Laboratory>("/laboratories", payload);
    return response.data;
  },

  async updateLab(id: string, payload: UpdateLabPayload): Promise<Laboratory> {
    const response = await api.patch<Laboratory>(`/laboratories/${id}`, payload);
    return response.data;
  },

  async deleteLab(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/laboratories/${id}`
    );
    return response.data;
  },

  async assignManager(
    labId: string,
    payload: AssignLabManagerPayload
  ): Promise<{ message: string; data?: unknown }> {
    const response = await api.post<{ message: string; data?: unknown }>(
      `/laboratories/${labId}/managers`,
      payload
    );
    return response.data;
  },

  async removeManager(
    labId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/laboratories/${labId}/managers/${userId}`
    );
    return response.data;
  },
};
