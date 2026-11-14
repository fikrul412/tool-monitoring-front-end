
import { api } from "@/lib/axios";

import type {
  Research,
  ResearchDetail,
  ResearchListResponse,
  ResearchApplicationLog,
  CreateResearchPayload,
  UpdateResearchPayload,
  ReviewResearchPayload,
  UpdateResearchStatusPayload,
  AdminResearchListResponse,
  AdminResearchQuery,
} from "../types/research.types";

export const researchService = {
  // Student: Get own research applications
  getMyResearch: async (
    params: { page?: number; limit?: number; search?: string; status?: "PENDING" | "APPROVED" | "REJECTED" | "ONGOING" | "COMPLETION_REQUESTED" | "COMPLETED" | "ARCHIVED" | "CANCELLED" } = {},
  ): Promise<ResearchListResponse> => {
    const response = await api.get<ResearchListResponse>(
      "/research/me",
      { params },
    );

    return response.data;
  },

  // Admin: Get all research applications
  getAll: async (
    params: AdminResearchQuery = {},
  ): Promise<AdminResearchListResponse> => {
    const response = await api.get<AdminResearchListResponse>(
      "/research/admin",
      { params },
    );

    return response.data;
  },

  // Get research details
  getById: async (id: string): Promise<ResearchDetail> => {
    const response = await api.get<ResearchDetail>(
      `/research/${id}`,
    );

    return response.data;
  },

  // Create research application
  create: async (
    payload: CreateResearchPayload,
  ): Promise<Research> => {
    const response = await api.post<Research>(
      "/research",
      payload,
    );

    return response.data;
  },

  // Update pending research application
  update: async (
    id: string,
    payload: UpdateResearchPayload,
  ): Promise<Research> => {
    const response = await api.patch<Research>(
      `/research/${id}`,
      payload,
    );

    return response.data;
  },

  // Admin: Approve or reject application
  review: async (
    id: string,
    payload: ReviewResearchPayload,
  ): Promise<Research> => {
    const response = await api.patch<Research>(
      `/research/${id}/review`,
      payload,
    );

    return response.data;
  },

  updateStatus: async (id: string, payload: UpdateResearchStatusPayload): Promise<Research> => {
    const response = await api.patch<Research>(`/research/${id}/status`, payload);
    return response.data;
  },

  // Get application history
  getLogs: async (
    id: string,
  ): Promise<ResearchApplicationLog[]> => {
    const response = await api.get<ResearchApplicationLog[]>(
      `/research/${id}/logs`,
    );

    return response.data;
  },
};
