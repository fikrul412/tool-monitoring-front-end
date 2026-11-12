
import Link from "next/link";

import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Building2,
  ClipboardList,
  Package,
  Users,
} from "lucide-react";

const statistics = [
  {
    title: "Total Pengguna",
    description: "Mahasiswa dan dosen terdaftar",
    icon: Users,
  },
  {
    title: "Laboratorium",
    description: "Laboratorium terdaftar",
    icon: Building2,
  },
  {
    title: "Peralatan",
    description: "Total peralatan laboratorium",
    icon: Boxes,
  },
  {
    title: "Bahan",
    description: "Total bahan laboratorium",
    icon: Package,
  },
];

const managementModules = [
  {
    title: "Manajemen Pengguna",
    description: "Kelola akun mahasiswa, dosen, dan administrator.",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Manajemen Laboratorium",
    description: "Kelola informasi dan data laboratorium.",
    href: "/admin/laboratories",
    icon: Building2,
  },
  {
    title: "Manajemen Peralatan",
    description: "Kelola inventaris dan kondisi peralatan.",
    href: "/admin/equipment",
    icon: Boxes,
  },
  {
    title: "Manajemen Bahan",
    description: "Kelola stok dan informasi bahan laboratorium.",
    href: "/admin/materials",
    icon: Package,
  },
  {
    title: "Manajemen Research",
    description: "Pantau research yang sedang berjalan.",
    href: "/admin/research",
    icon: BookOpen,
  },
  {
    title: "Manajemen Absensi",
    description: "Lihat dan kelola riwayat kehadiran laboratorium.",
    href: "/admin/attendance",
    icon: ClipboardList,
  },
];

export default function AdminDashboardContent() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Welcome */}
      <section className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Dashboard Administrator
        </h2>

        <p className="text-sm text-muted-foreground">
          Ringkasan dan pengelolaan sistem monitoring laboratorium.
        </p>
      </section>

      {/* Statistics */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">
            Ringkasan Sistem
          </h3>
          <p className="text-xs text-muted-foreground">
            Statistik keseluruhan sistem.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border bg-background p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>

                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-semibold tracking-tight">
                  —
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
