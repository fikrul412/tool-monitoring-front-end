
export type UserRole = "STUDENT" | "LECTURER" | "ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "PENDING_VERIFICATION"
  | "SUSPENDED";

export interface StudentProfile {
  name: string;
  nim: string | null;
  whatsapp: string | null;
}

export interface LecturerProfile {
  name: string;
  nip: string;
  whatsapp: string | null;
}

export type UserProfile = StudentProfile | LecturerProfile | null;

export interface AdminUser {
  id: string;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string | null;
}

export interface UsersQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UsersResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateManagedUserPayload {
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  nim?: string;
  nip?: string;
  whatsapp?: string;
}


export interface Lecturer {
  id: string;
  name: string;
}
