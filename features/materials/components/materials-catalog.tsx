"use client";

import { useState } from "react";
import { FlaskConical, MapPin, Search, User, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMaterials } from "../hooks/use-materials";
import type { Material, MaterialOwnerType } from "../types/materials.types";

export function MaterialsCatalog() {
  const [search, setSearch] = useState("");
  const [selectedOwnerType, setSelectedOwnerType] = useState<MaterialOwnerType | "">("");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const { data, isLoading } = useMaterials({
    search: search || undefined,
    ownerType: (selectedOwnerType as MaterialOwnerType) || undefined,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Katalog Bahan & Konsumabel
        </h1>
        <p className="text-sm text-neutral-500">
          Daftar ketersediaan reagen, bahan kimia, dan consumable praktikum serta research.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
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

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 p-6" />
          ))}
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((mat) => (
            <Card key={mat.id} className="flex flex-col justify-between hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold leading-tight">
                        {mat.name}
                      </CardTitle>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {parseFloat(mat.quantity).toLocaleString()} {mat.unit}
                      </p>
                    </div>
                  </div>
                  <Badge variant={mat.ownerType === "LAB" ? "default" : "secondary"} className="text-[10px]">
                    {mat.ownerType}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2 text-xs">
                  {mat.description || "Tidak ada rincian spesifikasi tambahan."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    {mat.ownerType === "LAB" ? (
                      <>
                        <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{mat.labName || "Lab Umum"}</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">Dosen: {mat.lecturerName || "Peneliti"}</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1.5"
                  onClick={() => setSelectedMaterial(mat)}
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
          <FlaskConical className="h-10 w-10 text-neutral-400 mb-3" />
          <h3 className="text-base font-semibold text-neutral-800">Bahan tidak ditemukan</h3>
          <p className="mt-1 text-sm text-neutral-500 max-w-sm">
            {search || selectedOwnerType
              ? "Tidak ada bahan yang cocok dengan kriteria pencarian."
              : "Belum ada data bahan yang terdaftar dalam inventaris."}
          </p>
        </div>
      )}

      {/* Material Detail Dialog */}
      <Dialog open={!!selectedMaterial} onOpenChange={(open) => !open && setSelectedMaterial(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FlaskConical className="h-5 w-5 text-primary" />
              {selectedMaterial?.name}
            </DialogTitle>
            <DialogDescription>
              Informasi kuantitas sisa dan kepemilikan bahan.
            </DialogDescription>
          </DialogHeader>

          {selectedMaterial && (
            <div className="space-y-3.5 py-2 text-sm">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="text-xs text-emerald-800 font-medium">Sisa Kuantitas:</span>
                <span className="text-sm font-bold text-emerald-900">
                  {parseFloat(selectedMaterial.quantity).toLocaleString()} {selectedMaterial.unit}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Kepemilikan
                </h4>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Badge variant="outline">{selectedMaterial.ownerType}</Badge>
                  <span className="text-xs">
                    {selectedMaterial.ownerType === "LAB"
                      ? `Tersedia di ${selectedMaterial.labName || "Lab Umum"}`
                      : `Milik Dosen ${selectedMaterial.lecturerName || "-"}`}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Keterangan & Penyimpanan
                </h4>
                <p className="text-neutral-700 bg-neutral-50 rounded-lg p-3 border border-neutral-100 text-xs leading-relaxed">
                  {selectedMaterial.description || "Tidak ada catatan penyimpanan khusus."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
