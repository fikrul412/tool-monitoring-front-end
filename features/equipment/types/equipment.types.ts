
export type ToolStatus =
  | "AVAILABLE"
  | "IN_USE"
  | "MAINTENANCE"
  | "UNAVAILABLE";

export type ToolOwnerType = "LAB" | "LECTURER";

export interface Tool {
  id: string;
  ownerType: ToolOwnerType;

  // Ownership
  labId: string | null;
  lecturerId: string | null;

  // Physical laboratory assignment
  assignedLabId: string | null;

  categoryId: string | null;

  name: string;
  inventoryCode: string | null;
  status: ToolStatus;
  description: string | null;

  // Relations
  labName: string | null;
  labLocation?: string | null;
  assignedLabName: string | null;
  assignedLabLocation?: string | null;
  lecturerName: string | null;
  categoryName: string | null;

  createdAt: string;
  updatedAt: string | null;
}

interface CommonToolPayload {
  name: string;
  inventoryCode?: string;
  categoryId?: string;
  status?: ToolStatus;
  description?: string;
}

export type CreateToolPayload =
  | (CommonToolPayload & {
      ownerType: "LAB";
      labId: string;
      lecturerId?: never;
      assignedLabId?: never;
    })
  | (CommonToolPayload & {
      ownerType: "LECTURER";
      lecturerId: string;
      assignedLabId: string;
      labId?: never;
    });

export type UpdateToolPayload = Partial<CommonToolPayload> & {
  assignedLabId?: string;
};

export interface UpdateToolVariables {
  id: string;
  payload: UpdateToolPayload;
}

export interface GetToolsQueryParams {
  search?: string;
  ownerType?: ToolOwnerType;
  labId?: string;
  lecturerId?: string;
  assignedLabId?: string;
  categoryId?: string;
  status?: ToolStatus;
  page?: number;
  limit?: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface ToolListResponse {
  data: Tool[];
  total: number;
  page: number;
  limit: number;
}
