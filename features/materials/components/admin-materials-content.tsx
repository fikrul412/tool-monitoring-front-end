"use client";

import { useState } from "react";
import {
  Edit2,
  FlaskConical,
  Plus,
  Search,
  Trash2,
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
  useDeleteMaterial,
  useMaterials,
} from "../hooks/use-materials";
import type { Material, MaterialOwnerType } from "../types/materials.types";
import { MaterialFormDialog } from "./material-form-dialog";

export function AdminMaterialsContent() {
  const [search, setSearch] = useState("");
  const [selectedOwnerType, setSelectedOwnerType] = useState<MaterialOwnerType | "">("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null);

  const { data, isLoading } = useMaterials({
    search: search || undefined,
    ownerType: (selectedOwnerType as MaterialOwnerType) || undefined,
    limit: 100,
  });

  const deleteMutation = useDeleteMaterial();

  const handleOpenCreate = () => {
    setEditingMaterial(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingMaterial) return;
    try {
      await deleteMutation.mutateAsync(deletingMaterial.id);
      setDeletingMaterial(null);
    } catch (error) {
      console.error("Gagal menghapus bahan:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Manajemen Bahan & Konsumabel
          </h1>
          <p className="text-sm text-neutral-500">
            Inventaris bahan kimia, reagen, dan bahan research laboratorium.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Tambah Bahan Baru
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Cari nama bahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <select
          value={selectedOwnerType}
          onChange={(e) => setSelectedOwnerType(e.target.value as MaterialOwnerType | "")}
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Semua Kepemilikan</option>
          <option value="LAB">Milik Laboratorium (LAB)</option>
          <option value="LECTURER">Milik Dosen (LECTURER)</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Bahan</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Kepemilikan</TableHead>
              <TableHead>Pemilik / Lokasi</TableHead>
              <TableHead>Ketersediaan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-neutral-500">
                  Memuat data bahan...
                </TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((mat) => (
                <TableRow key={mat.id}>
                  <TableCell className="font-medium text-neutral-900">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">{mat.name}</p>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">
                          {mat.description || "Tanpa keterangan"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-neutral-900">{mat.unit}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={mat.ownerType === "LAB" ? "default" : "secondary"} className="text-[11px]">
                      {mat.ownerType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-700">
                    {mat.ownerType === "LAB" ? mat.labName || "Lab Umum" : mat.lecturerName || "Dosen"}
                  </TableCell>
                  <TableCell>
                    {mat.isAvailable ? (
                      <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
                        Tersedia
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-neutral-500">
                        Tidak tersedia
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-600 hover:text-primary"
                        title="Edit Bahan"
                        onClick={() => handleOpenEdit(mat)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="Hapus Bahan"
                        onClick={() => setDeletingMaterial(mat)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-neutral-500">
                  Tidak ada data bahan ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Material Form Dialog */}
      <MaterialFormDialog open={formOpen} onOpenChange={setFormOpen} material={editingMaterial} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingMaterial} onOpenChange={(open) => !open && setDeletingMaterial(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Bahan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus bahan{" "}
              <span className="font-semibold text-neutral-900">{deletingMaterial?.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeletingMaterial(null)}>
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
    </div>
  );
}
