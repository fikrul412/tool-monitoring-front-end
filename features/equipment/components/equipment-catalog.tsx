
"use client";

import { useState } from "react";
import {
  Boxes,
  MapPin,
  Search,
  Tag,
  Eye,
  User,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useToolCategories,
  useTools,
} from "../hooks/use-equipment";

import { useLabs } from "@/features/laboratory/hooks/use-laboratories";

import type {
  Tool,
  ToolStatus,
  ToolOwnerType,
  ToolCategory,
} from "../types/equipment.types";

export function EquipmentCatalog() {
  const [search, setSearch] = useState("");
  const [selectedLabId, setSelectedLabId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedOwnerType, setSelectedOwnerType] = useState<
    ToolOwnerType | ""
  >("");

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const { data: labsData } = useLabs({ limit: 100 });
  const { data: categories } = useToolCategories();

  // Determine which laboratory field should be filtered.
  const labFilterParams =
    selectedOwnerType === "LAB"
      ? { labId: selectedLabId || undefined }
      : selectedOwnerType === "LECTURER"
        ? { assignedLabId: selectedLabId || undefined }
        : {};

  const { data, isLoading } = useTools({
    search: search || undefined,
    ownerType: selectedOwnerType || undefined,
    categoryId: selectedCategoryId || undefined,
    ...labFilterParams,
    limit: 50,
  });

  const getStatusBadge = (status: ToolStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="border-emerald-200 bg-emerald-500/15 text-emerald-700">
            Tersedia
          </Badge>
        );

      case "IN_USE":
        return (
          <Badge className="border-amber-200 bg-amber-500/15 text-amber-700">
            Sedang Dipakai
          </Badge>
        );

      case "MAINTENANCE":
        return (
          <Badge className="border-orange-200 bg-orange-500/15 text-orange-700">
            Perbaikan
          </Badge>
        );

      case "UNAVAILABLE":
        return <Badge variant="secondary">Tidak Tersedia</Badge>;

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOwnerName = (tool: Tool): string => {
    if (tool.ownerType === "LAB") {
      return tool.labName || "Laboratorium tidak ditemukan";
    }

    return tool.lecturerName || "Dosen tidak ditemukan";
  };

  const getAssignedLabName = (tool: Tool): string => {
    if (tool.ownerType === "LAB") {
      return tool.labName || "Laboratorium tidak ditemukan";
    }

    return tool.assignedLabName || "Laboratorium belum ditentukan";
  };

  const handleOwnerTypeChange = (value: string) => {
    setSelectedOwnerType(value as ToolOwnerType | "");
    setSelectedLabId("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Katalog Peralatan
        </h1>

        <p className="text-sm text-neutral-500">
          Jelajahi ketersediaan alat, instrumen, dan perlengkapan
          laboratorium maupun milik dosen.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <Input
            placeholder="Cari nama, kode, atau kategori alat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Ownership filter */}
        <select
          value={selectedOwnerType}
          onChange={(e) => handleOwnerTypeChange(e.target.value)}
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs"
        >
          <option value="">Semua Kepemilikan</option>
          <option value="LAB">Laboratorium</option>
          <option value="LECTURER">Dosen</option>
        </select>

        {/* Laboratory filter */}
        <select
          value={selectedLabId}
          onChange={(e) => setSelectedLabId(e.target.value)}
          disabled={!selectedOwnerType}
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {selectedOwnerType === "LAB"
              ? "Semua Laboratorium Pemilik"
              : selectedOwnerType === "LECTURER"
                ? "Semua Laboratorium Penempatan"
                : "Pilih Kepemilikan Dahulu"}
          </option>

          {labsData?.data?.map((lab) => (
            <option key={lab.id} value={lab.id}>
              {lab.name}
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs"
        >
          <option value="">Semua Kategori</option>

          {categories?.map((cat: ToolCategory) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Equipment Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 p-6"
            />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((tool: Tool) => (
            <Card
              key={tool.id}
              className="flex flex-col justify-between transition-all hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Boxes className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="truncate text-base font-semibold leading-tight">
                        {tool.name}
                      </CardTitle>

                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {tool.inventoryCode || "Tanpa Kode"}
                      </p>
                    </div>
                  </div>

                  {getStatusBadge(tool.status)}
                </div>

                <CardDescription className="mt-2 line-clamp-2 text-xs">
                  {tool.description ||
                    "Tidak ada deskripsi spesifikasi tambahan."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2 text-xs text-neutral-600">
                  {/* Equipment owner */}
                  <div className="flex items-center gap-2">
                    {tool.ownerType === "LAB" ? (
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                    ) : (
                      <User className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                    )}

                    <span className="truncate">
                      Pemilik: {getOwnerName(tool)}
                    </span>
                  </div>

                  {/* Physical location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />

                    <span className="truncate">
                      Lokasi: {getAssignedLabName(tool)}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 shrink-0 text-neutral-400" />

                    <span>
                      {tool.categoryName || "Umum"}
                    </span>
                  </div>

                  {/* Ownership badge */}
                  <Badge variant="outline">
                    {tool.ownerType === "LAB"
                      ? "Milik Laboratorium"
                      : "Milik Dosen"}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-xs"
                  onClick={() => setSelectedTool(tool)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Lihat Rincian
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
          <Boxes className="mb-3 h-10 w-10 text-neutral-400" />

          <h3 className="text-base font-semibold text-neutral-800">
            Peralatan tidak ditemukan
          </h3>

          <p className="mt-1 max-w-sm text-sm text-neutral-500">
            {search ||
            selectedLabId ||
            selectedCategoryId ||
            selectedOwnerType
              ? "Tidak ada alat yang cocok dengan filter atau kata kunci pencarian Anda."
              : "Belum ada inventaris alat yang terdaftar."}
          </p>
        </div>
      )}

      {/* Equipment Detail Dialog */}
      <Dialog
        open={!!selectedTool}
        onOpenChange={(open) => !open && setSelectedTool(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Boxes className="h-5 w-5 text-primary" />
              {selectedTool?.name}
            </DialogTitle>

            <DialogDescription>
              Kode: {selectedTool?.inventoryCode || "Tidak ada"}
            </DialogDescription>
          </DialogHeader>

          {selectedTool && (
            <div className="space-y-3.5 py-2 text-sm">
              {/* Status */}
              <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 p-2.5">
                <span className="text-xs font-medium text-neutral-600">
                  Status Ketersediaan:
                </span>

                {getStatusBadge(selectedTool.status)}
              </div>

              {/* Ownership type */}
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Jenis Kepemilikan
                </h4>

                <Badge variant="outline">
                  {selectedTool.ownerType === "LAB"
                    ? "Laboratorium"
                    : "Dosen"}
                </Badge>
              </div>

              {/* Owner */}
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Pemilik
                </h4>

                <div className="flex items-center gap-2 text-neutral-700">
                  {selectedTool.ownerType === "LAB" ? (
                    <MapPin className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <User className="h-4 w-4 text-neutral-400" />
                  )}

                  <span>{getOwnerName(selectedTool)}</span>
                </div>
              </div>

              {/* Physical location */}
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Lokasi Laboratorium
                </h4>

                <div className="flex items-center gap-2 text-neutral-700">
                  <MapPin className="h-4 w-4 text-neutral-400" />

                  <span>{getAssignedLabName(selectedTool)}</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Kategori
                </h4>

                <Badge variant="outline" className="text-xs">
                  {selectedTool.categoryName || "Umum"}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Deskripsi / Spesifikasi
                </h4>

                <p className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-700">
                  {selectedTool.description ||
                    "Tidak ada rincian tambahan untuk alat ini."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
