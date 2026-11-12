"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  Edit2,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAssignLabManager,
  useDeleteLab,
  useLabs,
  useRemoveLabManager,
} from "@/features/laboratory/hooks/use-laboratories";
import type { Laboratory } from "@/features/laboratory/types/laboratory.types";
import { adminUserService } from "@/features/admin/service/admin-user.service";
import type { AdminUser } from "@/features/admin/types/admin-user.types";
import { LabFormDialog } from "./lab-form-dialog";

export function AdminLaboratoriesContent() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<Laboratory | null>(null);

  // Delete state
  const [deletingLab, setDeletingLab] = useState<Laboratory | null>(null);

  // Assign manager state
  const [managingLab, setManagingLab] = useState<Laboratory | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<AdminUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);

  const { data, isLoading } = useLabs({ search, limit: 100 });
  const deleteMutation = useDeleteLab();
  const assignMutation = useAssignLabManager();
  const removeMutation = useRemoveLabManager();

  // Search users (lecturers & admins) when typing name/email
  useEffect(() => {
    if (!managingLab) {
      setUserResults([]);
      setUserSearch("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const response = await adminUserService.getUsers({
          page: 1,
          limit: 10,
          search: userSearch.trim() || undefined,
        });

        // Filter to only Lecturers and Admins
        const eligible = (response?.data || []).filter(
          (u) => u.role === "LECTURER" || u.role === "ADMIN"
        );
        setUserResults(eligible);
      } catch (err: unknown) {
        setUserResults([]);
        // Handle gracefully if token expired or unauthenticated
        console.warn("Gagal mencari pengguna (mungkin sesi admin berakhir):", err);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearch, managingLab]);

  const handleOpenCreate = () => {
    setEditingLab(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (lab: Laboratory) => {
    setEditingLab(lab);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingLab) return;
    try {
      await deleteMutation.mutateAsync(deletingLab.id);
      setDeletingLab(null);
    } catch (error) {
      console.error("Gagal menghapus lab:", error);
    }
  };

  const handleAssignManager = async (user: AdminUser) => {
    if (!managingLab) return;
    setAssigningUserId(user.id);
    try {
      await assignMutation.mutateAsync({
        labId: managingLab.id,
        payload: { userId: user.id },
      });

      const newManagerName =
        user.profile && "name" in user.profile && user.profile.name
          ? user.profile.name
          : user.email || "PIC Baru";

      setManagingLab({
        ...managingLab,
        managers: [
          ...managingLab.managers,
          {
            id: `temp-${Date.now()}`,
            userId: user.id,
            name: newManagerName,
            email: user.email || "",
            role: user.role,
          },
        ],
      });
    } catch (error) {
      console.error("Gagal menetapkan manager:", error);
    } finally {
      setAssigningUserId(null);
    }
  };

  const handleRemoveManager = async (labId: string, userId: string) => {
    try {
      await removeMutation.mutateAsync({ labId, userId });
      if (managingLab) {
        setManagingLab({
          ...managingLab,
          managers: managingLab.managers.filter((m) => m.userId !== userId),
        });
      }
    } catch (error) {
      console.error("Gagal mencopot manager:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Manajemen Laboratorium
          </h1>
          <p className="text-sm text-neutral-500">
            Kelola data laboratorium, fasilitas, dan staf penanggung jawab (PIC).
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Tambah Lab Baru
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Cari laboratorium..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Laboratorium</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Penanggung Jawab</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-neutral-500">
                  Memuat data laboratorium...
                </TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium text-neutral-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{lab.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      <span>{lab.location || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-neutral-500">
                    {lab.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {lab.managers && lab.managers.length > 0 ? (
                        lab.managers.map((m) => (
                          <Badge key={m.id} variant="secondary" className="text-[11px]">
                            {m.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-neutral-400 italic">Belum ada</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-600 hover:text-primary"
                        title="Kelola Penanggung Jawab"
                        onClick={() => setManagingLab(lab)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-600 hover:text-primary"
                        title="Edit Laboratorium"
                        onClick={() => handleOpenEdit(lab)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="Hapus Laboratorium"
                        onClick={() => setDeletingLab(lab)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-neutral-500">
                  Tidak ada data laboratorium.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Lab Form Dialog (Create / Edit) */}
      <LabFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        laboratory={editingLab}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingLab} onOpenChange={(open) => !open && setDeletingLab(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Laboratorium</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus laboratorium{" "}
              <span className="font-semibold text-neutral-900">{deletingLab?.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeletingLab(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Managers Dialog (with Name/Email Search) */}
      <Dialog open={!!managingLab} onOpenChange={(open) => !open && setManagingLab(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Penanggung Jawab: {managingLab?.name}
            </DialogTitle>
            <DialogDescription>
              Cari dosen atau admin berdasarkan nama atau email untuk ditugaskan sebagai PIC lab ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* List of current managers */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Manager Saat Ini ({managingLab?.managers?.length || 0})
              </h4>
              {managingLab?.managers && managingLab.managers.length > 0 ? (
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {managingLab.managers.map((m) => (
                    <div
                      key={m.userId}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 p-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-800">{m.name}</p>
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                            {m.role}
                          </Badge>
                        </div>
                        {m.email && <p className="text-neutral-500">{m.email}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="Hapus manager"
                        onClick={() => handleRemoveManager(managingLab.id, m.userId)}
                        disabled={removeMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">
                  Belum ada PIC yang ditugaskan.
                </p>
              )}
            </div>

            {/* Search by Name / Email to Add Manager */}
            <div className="space-y-2 pt-3 border-t border-neutral-100">
              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Cari & Tambah PIC Baru
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <Input
                  placeholder="Ketik nama dosen atau email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 text-xs"
                />
              </div>

              {/* User search results list */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-lg border border-neutral-100 p-1 bg-neutral-50/50">
                {isSearchingUsers ? (
                  <div className="flex items-center justify-center p-4 text-xs text-neutral-400 gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Mencari dosen/admin...</span>
                  </div>
                ) : userResults.length > 0 ? (
                  userResults.map((u) => {
                    const userName =
                      u.profile && "name" in u.profile && u.profile.name
                        ? u.profile.name
                        : u.email || "Tanpa Nama";
                    const isAlreadyManager = managingLab?.managers?.some(
                      (m) => m.userId === u.id
                    );

                    return (
                      <div
                        key={u.id}
                        className="flex items-center justify-between rounded-md bg-white p-2 border border-neutral-100 text-xs hover:border-neutral-200 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-neutral-900">
                              {userName}
                            </span>
                            <Badge variant="secondary" className="text-[10px] py-0 px-1">
                              {u.role}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-neutral-500">{u.email}</p>
                        </div>

                        {isAlreadyManager ? (
                          <Badge variant="outline" className="text-[10px] gap-1 text-green-600 border-green-200 bg-green-50">
                            <Check className="h-3 w-3" /> Ditugaskan
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 border-primary/20 text-primary hover:bg-primary/5"
                            disabled={assigningUserId === u.id || assignMutation.isPending}
                            onClick={() => handleAssignManager(u)}
                          >
                            {assigningUserId === u.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <UserPlus className="h-3 w-3" />
                            )}
                            Pilih
                          </Button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-neutral-400">
                    {userSearch
                      ? `Tidak ditemukan dosen/admin dengan nama "${userSearch}"`
                      : "Ketik nama dosen atau email untuk mencari."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
