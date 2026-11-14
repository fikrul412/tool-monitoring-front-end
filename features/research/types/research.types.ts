export type ResearchStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ONGOING"
  | "COMPLETION_REQUESTED"
  | "COMPLETED"
  | "ARCHIVED"
  | "CANCELLED";

export interface Research {
  id: string;
  studentId: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  status: ResearchStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface ResearchDetail extends Research {
  student?: { id: string; name: string; nim: string };
  supervisors: Array<{ id: string; name: string; nip: string }>;
  laboratories: Array<{ id: string; name: string; location: string | null }>;
  equipment: Array<{
    id: string;
    name: string;
    inventoryCode: string | null;
    status: string;
  }>;
  materials: Array<{ id: string; name: string; unit: string }>;
}
export interface AdminResearch extends Research {
  student: {
    id: string;
    name: string;
    nim: string;
  };
}

export interface AdminResearchQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ResearchStatus;
}

export interface AdminResearchListResponse {
  data: AdminResearch[];
  total: number;
  page: number;
  limit: number;
}
export interface ResearchSupervisor {
  researchId: string;
  lecturerId: string;
}

export interface ResearchLab {
  researchId: string;
  labId: string;
}

export interface ResearchTool {
  researchId: string;
  toolId: string;
}

export interface ResearchApplicationLog {
  id: string;
  researchId: string;
  status: ResearchStatus;
  comments: string | null;
  createdAt: string;
}

// API response types

export interface ResearchListResponse {
  data: Research[];
  total: number;
  page: number;
  limit: number;
}

// Request payloads

export interface CreateResearchPayload {
  title: string;
  startDate?: string;
  endDate?: string;
  supervisorIds: string[];
  labIds: string[];
  toolIds: string[];
  materialIds: string[];
}

export interface UpdateResearchPayload {
  title?: string;
  startDate?: string | null;
  endDate?: string | null;
  supervisorIds?: string[];
  labIds?: string[];
  toolIds?: string[];
  materialIds?: string[];
}

export interface ReviewResearchPayload {
  status: Extract<ResearchStatus, "APPROVED" | "REJECTED">;
  comments?: string;
}

export interface UpdateResearchStatusPayload {
  status: Extract<ResearchStatus, "ONGOING" | "CANCELLED">;
  comments?: string;
}
