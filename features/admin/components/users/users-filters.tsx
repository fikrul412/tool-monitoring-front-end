
import { RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  UserRole,
  UserStatus,
} from "../../types/admin-user.types";

interface UsersFiltersProps {
  search: string;
  role: UserRole | "ALL";
  status: UserStatus | "ALL";
  loading: boolean;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | "ALL") => void;
  onStatusChange: (value: UserStatus | "ALL") => void;
  onRefresh: () => void;
}

export function UsersFilters({
  search,
  role,
  status,
  loading,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onRefresh,
}: UsersFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama, email, NIM, atau NIP..."
          className="pl-9"
        />
      </div>

      <select
        value={role}
        onChange={(event) =>
          onRoleChange(event.target.value as UserRole | "ALL")
        }
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        aria-label="Filter berdasarkan peran"
      >
        <option value="ALL">Semua peran</option>
        <option value="STUDENT">Mahasiswa</option>
        <option value="LECTURER">Dosen</option>
        <option value="ADMIN">Administrator</option>
      </select>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as UserStatus | "ALL")
        }
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        aria-label="Filter berdasarkan status"
      >
        <option value="ALL">Semua status</option>
        <option value="ACTIVE">Aktif</option>
        <option value="PENDING_VERIFICATION">
          Menunggu verifikasi
        </option>
        <option value="SUSPENDED">Ditangguhkan</option>
      </select>

      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={loading}
        aria-label="Muat ulang"
      >
        <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
