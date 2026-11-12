
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Check,
  X,
  Search,
  Loader2,
  ChevronsUpDown,
} from "lucide-react";

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

import { api } from "@/lib/axios";

import {
  useCreateTool,
  useCreateToolCategory,
  useToolCategories,
  useUpdateTool,
} from "../hooks/use-equipment";

import { useLabs } from "@/features/laboratory/hooks/use-laboratories";

import type {
  Tool,
  ToolStatus,
  CreateToolPayload,
} from "../types/equipment.types";

// --------------------------------------------------
// Validation
// --------------------------------------------------

const toolSchema = z
  .object({
    ownerType: z.enum(["LAB", "LECTURER"]),

    labId: z.string().optional(),
    lecturerId: z.string().optional(),
    assignedLabId: z.string().optional(),

    name: z.string().min(1, "Nama alat wajib diisi").max(255),

    inventoryCode: z.string().max(100).optional(),

    categoryId: z.string().optional(),

    status: z.enum([
      "AVAILABLE",
      "IN_USE",
      "MAINTENANCE",
      "UNAVAILABLE",
    ]),

    description: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.ownerType === "LAB") {
      if (!values.labId) {
        ctx.addIssue({
          code: "custom",
          path: ["labId"],
          message: "Laboratorium wajib dipilih",
        });
      }
    }

    if (values.ownerType === "LECTURER") {
      if (!values.lecturerId) {
        ctx.addIssue({
          code: "custom",
          path: ["lecturerId"],
          message: "Silakan pilih dosen",
        });
      } else if (
        !z.string().uuid().safeParse(values.lecturerId).success
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["lecturerId"],
          message: "Dosen tidak valid",
        });
      }

      if (!values.assignedLabId) {
        ctx.addIssue({
          code: "custom",
          path: ["assignedLabId"],
          message: "Laboratorium penempatan wajib dipilih",
        });
      } else if (
        !z.string().uuid().safeParse(values.assignedLabId).success
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["assignedLabId"],
          message: "Laboratorium tidak valid",
        });
      }
    }
  });

type ToolFormValues = z.infer<typeof toolSchema>;

// --------------------------------------------------
// Types
// --------------------------------------------------

interface Lecturer {
  id: string;
  name: string;
}

interface ToolFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool?: Tool | null;
}

// --------------------------------------------------
// Default values
// --------------------------------------------------

const defaultValues: ToolFormValues = {
  ownerType: "LAB",
  labId: "",
  lecturerId: "",
  assignedLabId: "",
  name: "",
  inventoryCode: "",
  categoryId: "",
  status: "AVAILABLE",
  description: "",
};

// --------------------------------------------------
// Component
// --------------------------------------------------

export function ToolFormDialog({
  open,
  onOpenChange,
  tool,
}: ToolFormDialogProps) {
  const isEditing = !!tool;

  const createMutation = useCreateTool();
  const updateMutation = useUpdateTool();
  const createCategoryMutation = useCreateToolCategory();

  // Laboratories
  const {
    data: labsData,
    isLoading: isLoadingLabs,
  } = useLabs({ limit: 100 });

  // Categories
  const { data: categories } = useToolCategories();

  // Category creation state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Lecturer search state
  const [lecturerSearch, setLecturerSearch] = useState("");
  const [selectedLecturerName, setSelectedLecturerName] = useState("");
  const [isLecturerDropdownOpen, setIsLecturerDropdownOpen] =
    useState(false);

  // Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues,
  });

  const ownerType = watch("ownerType");
  const lecturerId = watch("lecturerId");

  // --------------------------------------------------
  // Lecturer search API
  // --------------------------------------------------

  const {
    data: lecturers,
    isLoading: isLoadingLecturers,
    isFetching: isFetchingLecturers,
  } = useQuery({
    queryKey: ["lecturers", lecturerSearch],
    queryFn: async () => {
      const response = await api.get<Lecturer[]>(
        "/identity/lecturers",
        {
          params: {
            search: lecturerSearch.trim(),
            limit: 10,
          },
        },
      );

      return response.data;
    },
    enabled:
      ownerType === "LECTURER" &&
      lecturerSearch.trim().length >= 2 &&
      isLecturerDropdownOpen &&
      !isEditing,
    staleTime: 60_000,
  });

  // --------------------------------------------------
  // Reset form when dialog opens
  // --------------------------------------------------

  useEffect(() => {
    if (!open) return;

    if (tool) {
      reset({
        ownerType: tool.ownerType,
        labId: tool.labId ?? "",
        lecturerId: tool.lecturerId ?? "",
        assignedLabId: tool.assignedLabId ?? "",
        name: tool.name,
        inventoryCode: tool.inventoryCode ?? "",
        categoryId: tool.categoryId ?? "",
        status: tool.status,
        description: tool.description ?? "",
      });

      setSelectedLecturerName(tool.lecturerName ?? "");
    } else {
      reset({
        ...defaultValues,
        labId: labsData?.data?.[0]?.id ?? "",
      });

      setSelectedLecturerName("");
    }

    setLecturerSearch("");
    setIsLecturerDropdownOpen(false);
    setIsAddingCategory(false);
    setNewCategoryName("");
  }, [open, tool, labsData?.data, reset]);

  // --------------------------------------------------
  // Select lecturer
  // --------------------------------------------------

  const handleSelectLecturer = (lecturer: Lecturer) => {
    setValue("lecturerId", lecturer.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedLecturerName(lecturer.name);
    setLecturerSearch("");
    setIsLecturerDropdownOpen(false);
  };

  // --------------------------------------------------
  // Submit form
  // --------------------------------------------------

  const handleSubmitForm = async (values: ToolFormValues) => {
    try {
      const commonPayload = {
        name: values.name.trim(),
        inventoryCode: values.inventoryCode?.trim() || undefined,
        categoryId: values.categoryId || undefined,
        status: values.status as ToolStatus,
        description: values.description?.trim() || undefined,
      };

      if (isEditing && tool) {
        // Update existing equipment
        await updateMutation.mutateAsync({
          id: tool.id,
          payload: {
            ...commonPayload,
            ...(values.ownerType === "LECTURER"
              ? {
                  assignedLabId: values.assignedLabId!,
                }
              : {}),
          },
        });
      } else {
        // Create new equipment
        const payload: CreateToolPayload =
          values.ownerType === "LAB"
            ? {
                ...commonPayload,
                ownerType: "LAB",
                labId: values.labId!,
              }
            : {
                ...commonPayload,
                ownerType: "LECTURER",
                lecturerId: values.lecturerId!,
                assignedLabId: values.assignedLabId!,
              };

        await createMutation.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Gagal menyimpan peralatan:", error);
    }
  };

  // --------------------------------------------------
  // Create category
  // --------------------------------------------------

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();

    if (!name) return;

    try {
      const newCategory =
        await createCategoryMutation.mutateAsync({ name });

      setValue("categoryId", newCategory.id, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Gagal menambah kategori:", error);
    }
  };

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  const isPending =
    isSubmitting ||
    createMutation.isPending ||
    updateMutation.isPending;

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Peralatan" : "Tambah Peralatan Baru"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Perbarui rincian alat atau status ketersediaan peralatan."
              : "Daftarkan peralatan baru dan tentukan pemilik serta laboratorium penempatannya."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="space-y-4 py-2"
        >
          {/* Ownership */}
          <div className="space-y-1.5">
            <Label htmlFor="ownerType">Jenis Kepemilikan</Label>

            <select
              id="ownerType"
              {...register("ownerType")}
              disabled={isEditing}
              className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs disabled:bg-neutral-100 disabled:cursor-not-allowed"
            >
              <option value="LAB">Laboratorium</option>
              <option value="LECTURER">Dosen</option>
            </select>

            {isEditing && (
              <p className="text-[11px] text-neutral-500">
                Jenis kepemilikan tidak dapat diubah melalui formulir edit.
              </p>
            )}
          </div>

          {/* LAB-owned equipment */}
          {ownerType === "LAB" && (
            <div className="space-y-1.5">
              <Label htmlFor="labId">Laboratorium Pemilik</Label>

              <select
                id="labId"
                {...register("labId")}
                disabled={isEditing || isLoadingLabs}
                className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs disabled:bg-neutral-100"
              >
                <option value="">
                  {isLoadingLabs
                    ? "Memuat laboratorium..."
                    : "Pilih Laboratorium..."}
                </option>

                {labsData?.data?.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name}
                    {lab.location ? ` (${lab.location})` : ""}
                  </option>
                ))}
              </select>

              {errors.labId && (
                <p className="text-xs text-red-500">
                  {errors.labId.message}
                </p>
              )}

              {!labsData?.data?.length && !isLoadingLabs && (
                <p className="text-xs text-amber-600">
                  Belum ada laboratorium terdaftar.
                </p>
              )}
            </div>
          )}

          {/* LECTURER-owned equipment */}
          {ownerType === "LECTURER" && (
            <>
              {/* Lecturer search */}
              <div className="space-y-1.5">
                <Label htmlFor="lecturerSearch">
                  Pemilik Peralatan (Dosen)
                </Label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                  <Input
                    id="lecturerSearch"
                    placeholder="Cari nama dosen..."
                    value={
                      isLecturerDropdownOpen
                        ? lecturerSearch
                        : selectedLecturerName
                    }
                    disabled={isEditing}
                    className="pl-9 pr-9"
                    onFocus={() => {
                      if (isEditing) return;

                      setIsLecturerDropdownOpen(true);
                      setLecturerSearch("");
                    }}
                    onChange={(e) => {
                      setLecturerSearch(e.target.value);
                      setIsLecturerDropdownOpen(true);

                      if (lecturerId) {
                        setValue("lecturerId", "", {
                          shouldValidate: true,
                        });

                        setSelectedLecturerName("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsLecturerDropdownOpen(false);
                      }
                    }}
                  />

                  <ChevronsUpDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 pointer-events-none" />

                  {isLecturerDropdownOpen && !isEditing && (
                    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
                      <div className="max-h-52 overflow-y-auto p-1">
                        {lecturerSearch.trim().length < 2 ? (
                          <p className="px-3 py-4 text-center text-xs text-neutral-500">
                            Ketik minimal 2 karakter untuk mencari dosen.
                          </p>
                        ) : isLoadingLecturers || isFetchingLecturers ? (
                          <div className="flex items-center justify-center gap-2 py-4 text-xs text-neutral-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Mencari dosen...
                          </div>
                        ) : lecturers && lecturers.length > 0 ? (
                          lecturers.map((lecturer) => (
                            <button
                              key={lecturer.id}
                              type="button"
                              onClick={() =>
                                handleSelectLecturer(lecturer)
                              }
                              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left hover:bg-neutral-100"
                            >
                              <span className="text-sm font-medium text-neutral-800">
                                {lecturer.name}
                              </span>

                              {lecturerId === lecturer.id && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-4 text-center text-xs text-neutral-500">
                            Dosen tidak ditemukan.
                          </p>
                        )}
                      </div>

                      <div className="border-t border-neutral-100 p-2">
                        <button
                          type="button"
                          onClick={() =>
                            setIsLecturerDropdownOpen(false)
                          }
                          className="w-full text-center text-xs text-neutral-500 hover:text-neutral-900"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {lecturerId && selectedLecturerName && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-emerald-600">
                      Dosen dipilih: {selectedLecturerName}
                    </p>

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setValue("lecturerId", "", {
                            shouldValidate: true,
                          });

                          setSelectedLecturerName("");
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                )}

                {errors.lecturerId && (
                  <p className="text-xs text-red-500">
                    {errors.lecturerId.message}
                  </p>
                )}
              </div>

              {/* Assigned laboratory */}
              <div className="space-y-1.5">
                <Label htmlFor="assignedLabId">
                  Laboratorium Penempatan
                </Label>

                <select
                  id="assignedLabId"
                  {...register("assignedLabId")}
                  disabled={isLoadingLabs}
                  className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs disabled:bg-neutral-100"
                >
                  <option value="">
                    {isLoadingLabs
                      ? "Memuat laboratorium..."
                      : "Pilih Laboratorium..."}
                  </option>

                  {labsData?.data?.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                      {lab.location ? ` (${lab.location})` : ""}
                    </option>
                  ))}
                </select>

                {errors.assignedLabId && (
                  <p className="text-xs text-red-500">
                    {errors.assignedLabId.message}
                  </p>
                )}

                {!labsData?.data?.length && !isLoadingLabs && (
                  <p className="text-xs text-amber-600">
                    Belum ada laboratorium terdaftar.
                  </p>
                )}

                <p className="text-[11px] text-neutral-500">
                  Laboratorium tempat peralatan milik dosen ini ditempatkan.
                </p>
              </div>
            </>
          )}

          {/* Equipment name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Peralatan / Alat</Label>

            <Input
              id="name"
              placeholder="Contoh: Mikroskop Binokuler Olympus"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Inventory and status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="inventoryCode">Kode Inventaris</Label>

              <Input
                id="inventoryCode"
                placeholder="INV-001"
                {...register("inventoryCode")}
              />

              {errors.inventoryCode && (
                <p className="text-xs text-red-500">
                  {errors.inventoryCode.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>

              <select
                id="status"
                {...register("status")}
                className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs"
              >
                <option value="AVAILABLE">Tersedia</option>
                <option value="IN_USE">Sedang Digunakan</option>
                <option value="MAINTENANCE">Perbaikan</option>
                <option value="UNAVAILABLE">Tidak Tersedia</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="categoryId">
                Kategori Alat (Opsional)
              </Label>

              {!isAddingCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Tambah Kategori
                </button>
              )}
            </div>

            {isAddingCategory ? (
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="Nama kategori baru..."
                  value={newCategoryName}
                  onChange={(e) =>
                    setNewCategoryName(e.target.value)
                  }
                  className="h-9 text-xs"
                />

                <Button
                  type="button"
                  size="sm"
                  className="h-9 px-2.5 text-xs gap-1"
                  disabled={
                    !newCategoryName.trim() ||
                    createCategoryMutation.isPending
                  }
                  onClick={handleCreateCategory}
                >
                  <Check className="h-3.5 w-3.5" />
                  Simpan
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2 text-xs text-neutral-500"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryName("");
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <select
                id="categoryId"
                {...register("categoryId")}
                className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs"
              >
                <option value="">Tanpa Kategori</option>

                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Deskripsi & Spesifikasi
            </Label>

            <Input
              id="description"
              placeholder="Catatan kondisi fisik atau petunjuk penggunaan"
              {...register("description")}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Daftarkan Alat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
