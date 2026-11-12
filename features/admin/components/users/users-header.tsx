
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UsersHeaderProps {
  onCreate: () => void;
}

export function UsersHeader({ onCreate }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Users className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Pengguna
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Kelola akun mahasiswa, dosen, dan administrator.
        </p>
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 size-4" />
        Tambah pengguna
      </Button>
    </div>
  );
}
