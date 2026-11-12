
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AdminUser } from "../../types/admin-user.types";
import {
  getRoleLabel,
  getStatusLabel,
  getStatusVariant,
  getUserIdentifier,
  getUserName,
} from "../../utils/user.utils";

interface UsersTableProps {
  users: AdminUser[];
  loading: boolean;
  updatingId: string | null;
  onStatusChange: (user: AdminUser) => void;
}

export function UsersTable({
  users,
  loading,
  updatingId,
  onStatusChange,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pengguna</TableHead>
            <TableHead>Identitas</TableHead>
            <TableHead>Peran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Memuat pengguna...
                </p>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                Tidak ada pengguna ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{getUserName(user)}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.email ?? "Email tidak tersedia"}
                  </div>
                </TableCell>

                <TableCell className="text-sm">
                  {getUserIdentifier(user)}
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>
                    {getStatusLabel(user.status)}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  {user.status !== "PENDING_VERIFICATION" && (
                    <Button
                      size="sm"
                      variant={
                        user.status === "ACTIVE" ? "destructive" : "outline"
                      }
                      disabled={updatingId === user.id}
                      onClick={() => onStatusChange(user)}
                    >
                      {updatingId === user.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : user.status === "ACTIVE" ? (
                        "Tangguhkan"
                      ) : (
                        "Aktifkan"
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
