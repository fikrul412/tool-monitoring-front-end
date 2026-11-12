import { api } from "@/lib/axios";
import type {
  CreateMaterialPayload,
  GetMaterialsQueryParams,
  Material,
  MaterialListResponse,
  UpdateMaterialPayload,
} from "../types/materials.types";

export const materialsService = {
  async getMaterials(params?: GetMaterialsQueryParams): Promise<MaterialListResponse> {
    const response = await api.get<MaterialListResponse>("/materials", { params });
    return response.data;
  },

  async getMaterialById(id: string): Promise<Material> {
    const response = await api.get<Material>(`/materials/${id}`);
    return response.data;
  },

  async createMaterial(payload: CreateMaterialPayload): Promise<Material> {
    const response = await api.post<Material>("/materials", payload);
    return response.data;
  },

  async updateMaterial(id: string, payload: UpdateMaterialPayload): Promise<Material> {
    const response = await api.patch<Material>(`/materials/${id}`, payload);
    return response.data;
  },

  async deleteMaterial(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/materials/${id}`
    );
    return response.data;
  },
};
