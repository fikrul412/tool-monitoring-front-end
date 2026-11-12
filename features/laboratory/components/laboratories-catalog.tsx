"use client";

import { useState } from "react";
import { Building2, MapPin, Search, Users, Eye } from "lucide-react";
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
import { useLabs } from "@/features/laboratory/hooks/use-laboratories";
import type { Laboratory } from "@/features/laboratory/types/laboratory.types";

export function LaboratoriesCatalog() {
  const [search, setSearch] = useState("");
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);

  const { data, isLoading } = useLabs({ search, limit: 50 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Daftar Laboratorium
          </h1>
          <p className="text-sm text-neutral-500">
            Jelajahi fasilitas laboratorium, lokasi, dan penanggung jawab lab.
          </p>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Cari nama laboratorium atau lokasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid List */}
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
          {data.data.map((lab) => (
            <Card
              key={lab.id}
              className="flex flex-col justify-between transition-all duration-200 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-semibold leading-tight">
                      {lab.name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Aktif
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2 text-xs">
                  {lab.description || "Tidak ada deskripsi tersedia untuk laboratorium ini."}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{lab.location || "Lokasi belum ditentukan"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {lab.managers && lab.managers.length > 0
                        ? `${lab.managers.length} Penanggung Jawab`
                        : "Belum ada PIC"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1.5"
                  onClick={() => setSelectedLab(lab)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
          <Building2 className="h-10 w-10 text-neutral-400 mb-3" />
          <h3 className="text-base font-semibold text-neutral-800">
            Laboratorium tidak ditemukan
          </h3>
          <p className="mt-1 text-sm text-neutral-500 max-w-sm">
            {search
              ? `Tidak ada hasil pencarian untuk "${search}". Silakan coba kata kunci lain.`
              : "Belum ada data laboratorium yang terdaftar dalam sistem."}
          </p>
        </div>
      )}

      {/* Lab Detail Dialog */}
      <Dialog open={!!selectedLab} onOpenChange={(open) => !open && setSelectedLab(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              {selectedLab?.name}
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap fasilitas dan penanggung jawab laboratorium.
            </DialogDescription>
          </DialogHeader>

          {selectedLab && (
            <div className="space-y-4 py-2 text-sm">
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Deskripsi
                </h4>
                <p className="text-neutral-700 bg-neutral-50 rounded-lg p-3 border border-neutral-100">
                  {selectedLab.description || "Tidak ada rincian deskripsi."}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Lokasi
                </h4>
                <div className="flex items-center gap-2 text-neutral-700">
                  <MapPin className="h-4 w-4 text-neutral-400" />
                  <span>{selectedLab.location || "Lokasi belum ditentukan"}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Penanggung Jawab (PIC / Manager)
                </h4>
                {selectedLab.managers && selectedLab.managers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLab.managers.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between rounded-lg border border-neutral-200 p-2.5 bg-white"
                      >
                        <div>
                          <p className="font-medium text-xs text-neutral-900">{m.name}</p>
                          <p className="text-xs text-neutral-500">{m.email}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {m.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">
                    Belum ada penanggung jawab yang ditugaskan.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
