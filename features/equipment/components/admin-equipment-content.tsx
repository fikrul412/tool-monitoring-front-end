
"use client";

import { useState } from "react";

import {
  Boxes,
  Edit2,
  Plus,
  Search,
  Trash2,
  User,
  MapPin,
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
  useDeleteTool,
  useToolCategories,
  useTools,
  useUpdateTool,
} from "../hooks/use-equipment";

import { useLabs } from "@/features/laboratory/hooks/use-laboratories";

import type {
  Tool,
  ToolStatus,
  ToolOwnerType,
} from "../types/equipment.types";

import { ToolFormDialog } from "./tool-form-dialog";

export function AdminEquipmentContent() {
  const [search, setSearch] = useState("");
  const [selectedLabId, setSelectedLabId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ToolStatus | "">("");
  const [selectedOwnerType, setSelectedOwnerType] = useState<
    ToolOwnerType | ""
  >("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deletingTool, setDeletingTool] = useState<Tool | null>(null);

  const { data: labsData } = useLabs({ limit: 100 });
  const { data: categories } = useToolCategories();

  const { data, isLoading } = useTools({
    search: search || undefined,
    ownerType: selectedOwnerType || undefined,
    labId: selectedLabId || undefined,
    categoryId: selectedCategoryId || undefined,
    status: selectedStatus || undefined,
    limit: 100,
  });

  const deleteMutation = useDeleteTool();
  const updateMutation = useUpdateTool();

  const handleOpenCreate = () => {
    setEditingTool(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingTool) return;

    try {
      await deleteMutation.mutateAsync(deletingTool.id);
      setDeletingTool(null);
    } catch (error) {
      console.error("Gagal menghapus alat:", error);
    }
  };

  const handleQuickStatusChange = async (
    tool: Tool,
    newStatus: ToolStatus,
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: tool.id,
        payload: { status: newStatus },
      });
    } catch (error) {
      console.error("Gagal mengubah status:", error);
    }
  };

  const getStatusBadge = (status: ToolStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200">
            Tersedia
          </Badge>
        );

      case "IN_USE":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 border-amber-200">
            Dipakai
          </Badge>
        );

      case "MAINTENANCE":
        return (
          <Badge className="bg-orange-500/15 text-orange-700 border-orange-200">
            Perbaikan
          </Badge>
        );

      case "UNAVAILABLE":
        return <Badge variant="secondary">Tidak Tersedia</Badge>;

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOwnerName = (tool: Tool) => {
    if (tool.ownerType === "LAB") {
      return tool.labName || "Laboratorium tidak ditemukan";
    }

    return tool.lecturerName || "Dosen tidak ditemukan";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Manajemen Peralatan
          </h1>

          <p className="text-sm text-neutral-500">
            Kelola inventaris laboratorium dan peralatan milik dosen.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Alat Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col flex-wrap sm:flex-row gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <Input
            placeholder="Cari nama, kode, atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <select
          value={selectedOwnerType}
          onChange={(e) =>
            setSelectedOwnerType(e.target.value as ToolOwnerType | "")
          }
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs"
        >
          <option value="">Semua Kepemilikan</option>
          <option value="LAB">Laboratorium</option>
          <option value="LECTURER">Dosen</option>
        </select>

        <select
          value={selectedLabId}
          onChange={(e) => setSelectedLabId(e.target.value)}
          disabled={selectedOwnerType === "LECTURER"}
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs disabled:bg-neutral-100"
        >
          <option value="">Semua Laboratorium</option>

          {labsData?.data?.map((lab) => (
            <option key={lab.id} value={lab.id}>
              {lab.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs"
        >
          <option value="">Semua Kategori</option>

          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value as ToolStatus | "")
          }
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs"
        >
          <option value="">Semua Status</option>
          <option value="AVAILABLE">Tersedia</option>
          <option value="IN_USE">Sedang Dipakai</option>
          <option value="MAINTENANCE">Perbaikan</option>
          <option value="UNAVAILABLE">Tidak Tersedia</option>
        </select>
      </div>

      {/* Equipment Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Alat & Kode</TableHead>
              <TableHead>Kepemilikan</TableHead>
              <TableHead>Pemilik</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status Operasional</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-neutral-500"
                >
                  Memuat data peralatan...
                </TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((tool) => (
                <TableRow key={tool.id}>
                  {/* Equipment */}
                  <TableCell className="font-medium text-neutral-900">
                    <div className="flex items-center gap-2">
                      <Boxes className="h-4 w-4 text-primary shrink-0" />

                      <div>
                        <p className="text-sm font-semibold">
                          {tool.name}
                        </p>

                        <p className="text-[11px] text-neutral-500">
                          {tool.inventoryCode || "Tanpa Kode Inventaris"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Owner Type */}
                  <TableCell>
                    <Badge variant="outline">
                      {tool.ownerType === "LAB"
                        ? "Laboratorium"
                        : "Dosen"}
                    </Badge>
                  </TableCell>

                  {/* Owner */}
                  <TableCell className="text-xs text-neutral-700">
                    <div className="flex items-center gap-2">
                      {tool.ownerType === "LAB" ? (
                        <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      )}

                      <span>{getOwnerName(tool)}</span>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="outline" className="text-[11px]">
                      {tool.categoryName || "Umum"}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="flex flex-col items-start gap-2">
                      {getStatusBadge(tool.status)}

                      <select
                        value={tool.status}
                        onChange={(e) =>
                          handleQuickStatusChange(
                            tool,
                            e.target.value as ToolStatus,
                          )
                        }
                        disabled={updateMutation.isPending}
                        className="h-6 text-[11px] border border-neutral-200 rounded px-1 bg-neutral-50 hover:bg-white cursor-pointer disabled:opacity-50"
                        title="Ubah status cepat"
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="IN_USE">IN_USE</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                        <option value="UNAVAILABLE">UNAVAILABLE</option>
                      </select>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-600 hover:text-primary"
                        title="Edit Alat"
                        onClick={() => handleOpenEdit(tool)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="Hapus Alat"
                        onClick={() => setDeletingTool(tool)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-neutral-500"
                >
                  Tidak ada peralatan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <ToolFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tool={editingTool}
      />

      {/* Delete Confirmation */}
      <Dialog
        open={!!deletingTool}
        onOpenChange={(open) => !open && setDeletingTool(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Peralatan</DialogTitle>

            <DialogDescription>
              Apakah Anda yakin ingin menghapus alat{" "}
              <span className="font-semibold text-neutral-900">
                {deletingTool?.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setDeletingTool(null)}
            >
              Batal
            </Button>

            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {deleteMutation.isPending
                ? "Menghapus..."
                : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
