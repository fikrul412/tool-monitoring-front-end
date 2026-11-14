export const MATERIAL_OWNER_TYPES = ["LAB", "LECTURER"] as const;
export type MaterialOwnerType = (typeof MATERIAL_OWNER_TYPES)[number];

export interface Material {
  id: string;
  name: string;
  description: string | null;
  ownerType: MaterialOwnerType;
  labId: string | null;
  lecturerId: string | null;
  unit: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string | null;
  labName: string | null;
  lecturerName: string | null;
}

export interface MaterialListResponse {
  data: Material[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetMaterialsQueryParams {
  search?: string;
  ownerType?: MaterialOwnerType;
  labId?: string;
  lecturerId?: string;
  page?: number;
  limit?: number;
}

export interface CreateMaterialPayload {
  name: string;
  description?: string;
  ownerType: MaterialOwnerType;
  labId?: string;
  lecturerId?: string;
  unit: string;
  isAvailable?: boolean;
}

export interface UpdateMaterialPayload {
  name?: string;
  description?: string;
  ownerType?: MaterialOwnerType;
  labId?: string;
  lecturerId?: string;
  unit?: string;
  isAvailable?: boolean;
}
