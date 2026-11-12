import { api } from "@/lib/axios";

import type {
  CreateToolPayload,
  GetToolsQueryParams,
  Tool,
  ToolCategory,
  ToolListResponse,
  UpdateToolPayload,
} from "../types/equipment.types";

export const equipmentService = {
  async getTools(
    params?: GetToolsQueryParams,
  ): Promise<ToolListResponse> {
    const { data } = await api.get<ToolListResponse>("/equipment", {
      params,
    });

    return data;
  },

  async getToolById(id: string): Promise<Tool> {
    const { data } = await api.get<Tool>(`/equipment/${id}`);

    return data;
  },

  async getCategories(): Promise<ToolCategory[]> {
    const { data } = await api.get<ToolCategory[]>(
      "/equipment/categories",
    );

    return data;
  },

  async createCategory(payload: {
    name: string;
    description?: string;
  }): Promise<ToolCategory> {
    const { data } = await api.post<ToolCategory>(
      "/equipment/categories",
      payload,
    );

    return data;
  },

  async createTool(payload: CreateToolPayload): Promise<Tool> {
    const { data } = await api.post<Tool>("/equipment", payload);

    return data;
  },

  async updateTool(
    id: string,
    payload: UpdateToolPayload,
  ): Promise<Tool> {
    const { data } = await api.patch<Tool>(
      `/equipment/${id}`,
      payload,
    );

    return data;
  },

  async deleteTool(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await api.delete<{
      success: boolean;
      message: string;
    }>(`/equipment/${id}`);

    return data;
  },
};