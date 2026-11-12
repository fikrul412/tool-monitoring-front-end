export interface LabManagerItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface Laboratory {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  createdAt: string;
  managers: LabManagerItem[];
}

export interface LaboratoryListResponse {
  data: Laboratory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetLabsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateLabPayload {
  name: string;
  description?: string;
  location?: string;
}

export interface UpdateLabPayload {
  name?: string;
  description?: string;
  location?: string;
}

export interface AssignLabManagerPayload {
  userId: string;
}
