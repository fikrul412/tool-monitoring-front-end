export type UserRole = "STUDENT" | "LECTURER" | "ADMIN";

export interface StudentProfile {
    name: string;
    nim: string | null;
    whatsapp: string | null;
    studyProgram?: string | null;
    address?: string | null;
}

export interface LecturerProfile {
    name: string;
    nip: string;
    whatsapp: string | null;
}

export interface Identity {
    id: string;
    email: string;
    role: UserRole;
    status: string;
    profile: StudentProfile | LecturerProfile | null;
}
