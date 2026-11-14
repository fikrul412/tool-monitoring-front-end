"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMaterial, useUpdateMaterial } from "../hooks/use-materials";
import { useLabs } from "@/features/laboratory/hooks/use-laboratories";
import { adminUserService } from "@/features/admin/service/admin-user.service";
import type { AdminUser } from "@/features/admin/types/admin-user.types";
import type { Material, MaterialOwnerType } from "../types/materials.types";

const materialSchema = z.object({
  name: z.string().min(1, "Nama bahan wajib diisi"),
  description: z.string().optional(),
  ownerType: z.enum(["LAB", "LECTURER"]),
  labId: z.string().optional(),
  lecturerId: z.string().optional(),
  unit: z.string().min(1, "Satuan wajib diisi (contoh: ml, gram, pcs)"),
  isAvailable: z.boolean(),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

interface MaterialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: Material | null;
}

export function MaterialFormDialog({
  open,
  onOpenChange,
  material,
}: MaterialFormDialogProps) {
  const isEditing = !!material;
  const createMutation = useCreateMaterial();
  const updateMutation = useUpdateMaterial();
  const { data: labsData } = useLabs({ limit: 100 });

  const [lecturers, setLecturers] = useState<AdminUser[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      description: "",
      ownerType: "LAB",
      labId: "",
      lecturerId: "",
      unit: "pcs",
      isAvailable: true,
    },
  });

  const ownerType = watch("ownerType");

  useEffect(() => {
    async function fetchLecturers() {
      try {
        const res = await adminUserService.getUsers({
          page: 1,
          limit: 100,
          role: "LECTURER",
        });
        setLecturers(res?.data || []);
      } catch (err) {
        console.error("Gagal memuat dosen:", err);
      }
    }
    fetchLecturers();
  }, []);

  useEffect(() => {
    if (material) {
      reset({
        name: material.name,
        description: material.description || "",
        ownerType: material.ownerType,
        labId: material.labId || "",
        lecturerId: material.lecturerId || "",
        unit: material.unit,
        isAvailable: material.isAvailable,
      });
    } else {
      reset({
        name: "",
        description: "",
        ownerType: "LAB",
        labId: labsData?.data?.[0]?.id || "",
        lecturerId: "",
        unit: "pcs",
        isAvailable: true,
      });
    }
  }, [material, labsData, reset]);

  const onSubmit = async (values: MaterialFormValues) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || undefined,
        ownerType: values.ownerType as MaterialOwnerType,
        labId: values.ownerType === "LAB" ? values.labId : undefined,
        lecturerId: values.ownerType === "LECTURER" ? values.lecturerId : undefined,
        unit: values.unit,
        isAvailable: values.isAvailable,
      };

      if (isEditing && material) {
        await updateMutation.mutateAsync({ id: material.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Gagal menyimpan bahan:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Bahan / Konsumabel" : "Tambah Bahan Baru"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui satuan atau kepemilikan bahan."
              : "Daftarkan bahan kimia, reagen, atau material konsumabel baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Bahan</Label>
            <Input id="name" placeholder="Contoh: Etanol 96%, Asam Sulfat 1M" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="unit">Satuan</Label>
            <Input id="unit" placeholder="ml, liter, gram, botol" {...register("unit")} />
            {errors.unit && <p className="text-xs text-red-500">{errors.unit.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ownerType">Tipe Kepemilikan</Label>
            <select
              id="ownerType"
              {...register("ownerType")}
              className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="LAB">Milik Laboratorium (LAB)</option>
              <option value="LECTURER">Milik Dosen Peneliti (LECTURER)</option>
            </select>
          </div>

          {ownerType === "LAB" ? (
            <div className="space-y-1.5">
              <Label htmlFor="labId">Pilih Laboratorium</Label>
              <select
                id="labId"
                {...register("labId")}
                className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Lab...</option>
                {labsData?.data?.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="lecturerId">Pilih Dosen Pemilik</Label>
              <select
                id="lecturerId"
                {...register("lecturerId")}
                className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Dosen...</option>
                {lecturers.map((lec) => (
                  <option key={lec.id} value={lec.id}>
                    {lec.profile && "name" in lec.profile ? lec.profile.name : lec.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="description">Catatan / Deskripsi</Label>
            <Input id="description" placeholder="Catatan penyimpanan, tanggal kedaluwarsa, dsb." {...register("description")} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAvailable"
              {...register("isAvailable")}
              className="rounded border-neutral-300 text-primary focus:ring-primary/20 h-4 w-4"
            />
            <Label htmlFor="isAvailable" className="text-xs font-normal text-neutral-700 cursor-pointer">
              Material tersedia
            </Label>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
              {isSubmitting || createMutation.isPending || updateMutation.isPending
                ? "Menyimpan..."
                : isEditing
                ? "Simpan Perubahan"
                : "Daftarkan Bahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
