
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UsersPaginationProps {
  page: number;
  totalPages: number;
  totalUsers: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function UsersPagination({
  page,
  totalPages,
  totalUsers,
  loading,
  onPageChange,
}: UsersPaginationProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages} · {totalUsers} pengguna
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="mr-1 size-4" />
          Sebelumnya
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Berikutnya
          <ChevronRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}
