import { api } from "@/lib/axios";

export interface LecturerOption {
  id: string;
  name: string;
}

export const lecturerService = {
  async getLecturers(params?: {
    search?: string;
    limit?: number;
  }): Promise<LecturerOption[]> {
    const response = await api.get<LecturerOption[]>(
      "/identity/lecturers",
      { params },
    );

    return response.data;
  },
};