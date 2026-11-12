"use client";

import { useEffect } from "react";
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
import { useCreateLab, useUpdateLab } from "@/features/laboratory/hooks/use-laboratories";
import type { Laboratory } from "@/features/laboratory/types/laboratory.types";

const labSchema = z.object({
  name: z.string().min(1, "Nama laboratorium wajib diisi"),
  description: z.string().optional(),
  location: z.string().optional(),
});

type LabFormValues = z.infer<typeof labSchema>;

interface LabFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  laboratory?: Laboratory | null;
}

export function LabFormDialog({
  open,
  onOpenChange,
  laboratory,
}: LabFormDialogProps) {
  const isEditing = !!laboratory;
  const createMutation = useCreateLab();
  const updateMutation = useUpdateLab();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LabFormValues>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
    },
  });

  useEffect(() => {
    if (laboratory) {
      reset({
        name: laboratory.name,
        description: laboratory.description || "",
        location: laboratory.location || "",
      });
    } else {
      reset({
        name: "",
        description: "",
        location: "",
      });
    }
  }, [laboratory, reset]);

  const onSubmit = async (values: LabFormValues) => {
    try {
      if (isEditing && laboratory) {
        await updateMutation.mutateAsync({
          id: laboratory.id,
          payload: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Gagal menyimpan laboratorium:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Laboratorium" : "Tambah Laboratorium Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui detail nama, lokasi, dan deskripsi laboratorium."
              : "Masukkan informasi ruangan dan fasilitas laboratorium baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Laboratorium</Label>
            <Input
              id="name"
              placeholder="Contoh: Lab Komputasi & Jaringan"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Lokasi / Gedung</Label>
            <Input
              id="location"
              placeholder="Contoh: Gedung B, Lantai 3, R.302"
              {...register("location")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              placeholder="Rincian fokus kegiatan, kapasitas atau catatan"
              {...register("description")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {isSubmitting || createMutation.isPending || updateMutation.isPending
                ? "Menyimpan..."
                : isEditing
                ? "Simpan Perubahan"
                : "Buat Laboratorium"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
