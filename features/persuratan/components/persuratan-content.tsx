
import {
  Archive,
  Check,
  FileText,
} from "lucide-react";

import type { PersuratanService } from "../types/persuratan.types";
import { PersuratanServiceCard } from "./persuratan-service-card";
import { SubmissionProcessCard } from "./submission-process-card";

const services: PersuratanService[] = [
  {
    title: "Ajukan Surat Izin Lab",
    description: "Ajukan izin penggunaan laboratorium",
    href: "/dashboard/persuratan/izin-lab",
    icon: FileText,
  },
  {
    title: "Ajukan Surat Bebas Lab",
    description: "Ajukan penyelesaian penggunaan laboratorium",
    href: "/dashboard/persuratan/bebas-lab",
    icon: Check,
  },
  {
    title: "Arsip Surat",
    description: "Lihat dokumen, status, dan riwayat revisi",
    href: "/dashboard/persuratan/arsip",
    icon: Archive,
  },
];

export default function PersuratanContent() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      {/* Page Heading */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">
          Layanan Persuratan
        </h1>

        <p className="text-xs text-muted-foreground">
          Pilih kebutuhan surat yang ingin kamu ajukan
        </p>
      </div>

      {/* Services */}
      <div className="space-y-2.5">
        {services.map((service) => (
          <PersuratanServiceCard
            key={service.href}
            service={service}
          />
        ))}
      </div>

      {/* Submission Information */}
      <SubmissionProcessCard />
    </div>
  );
}
