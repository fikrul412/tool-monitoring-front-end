
import type {
  AdminUser,
  UserRole,
  UserStatus,
} from "../types/admin-user.types";

export function getUserName(user: AdminUser) {
  return user.profile?.name ?? "—";
}

export function getUserIdentifier(user: AdminUser) {
  if (user.role === "STUDENT" && user.profile && "nim" in user.profile) {
    return user.profile.nim ?? "NIM belum diisi";
  }

  if (user.role === "LECTURER" && user.profile && "nip" in user.profile) {
    return user.profile.nip;
  }

  return "—";
}

export function getRoleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    STUDENT: "Mahasiswa",
    LECTURER: "Dosen",
    ADMIN: "Administrator",
  };

  return labels[role];
}

export function getStatusLabel(status: UserStatus) {
  const labels: Record<UserStatus, string> = {
    ACTIVE: "Aktif",
    PENDING_VERIFICATION: "Menunggu verifikasi",
    SUSPENDED: "Ditangguhkan",
  };

  return labels[status];
}

export function getStatusVariant(status: UserStatus) {
  const variants = {
    ACTIVE: "default",
    PENDING_VERIFICATION: "secondary",
    SUSPENDED: "destructive",
  } as const;

  return variants[status];
}

export function getApiErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = error.response as {
      data?: { message?: string | string[] };
    };

    const message = response.data?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
  }

  return "Terjadi kesalahan. Silakan coba kembali.";
}
