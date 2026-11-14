"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    FlaskConical,
    BookOpen,
    Building2,
    FileText,
    QrCode,
    Wrench,
    Scale,
    MessageCircle,
    Boxes
} from "lucide-react";

import { useAuthStore } from "@/features/auth/stores/auth.store";

const dashboardMenus = [
    {
        title: "Persuratan",
        description: "Izin lab, bebas lab, arsip",
        href: "/dashboard/persuratan",
        icon: FileText,
    },
    {
        title: "Absensi QR",
        description: "Catat kehadiran di lab",
        href: "/dashboard/attendance",
        icon: QrCode,
    },
    {
        title: "Laboratorium",
        description: "Daftar dan informasi fasilitas lab",
        href: "/dashboard/laboratories",
        icon: Building2,
    },
    {
        title: "Research",
        description: "Publikasi, proyek, dan topik riset",
        href: "/dashboard/research",
        icon: BookOpen,
    },
    {
        title: "Peralatan",
        description: "Katalog dan ketersediaan alat lab",
        href: "/dashboard/equipment",
        icon: Boxes,
    },
    {
        title: "Bahan & Reagen",
        description: "Stok bahan kimia dan reagen",
        href: "/dashboard/materials",
        icon: FlaskConical,
    },
    {
        title: "Peminjaman Alat dan Bahan",
        description: "Peminjaman alat, bahan, dan schedule alat",
        href: "/dashboard/loans",
        icon: Wrench,
    },
    {
        title: "Peraturan Lab",
        description: "Panduan dan tata tertib",
        href: "/dashboard/rules",
        icon: Scale,
    },
    {
        title: "Hubungi WhatsApp",
        description: "Kontak laboratorium",
        href: "/dashboard/contact",
        icon: MessageCircle,
    },
];

export default function DashboardContent() {
    const user = useAuthStore((state) => state.user);

    const name = user?.profile?.name ?? "Mahasiswa";

    return (
        <div className="space-y-6">
            {/* Greeting */}
            <section className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Selamat pagi,
                    </p>

                    <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                        {name} 👋
                    </h1>

                    <p className="mt-1 text-xs text-primary">
                        Akses Lab Aktif
                    </p>
                </div>

                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {name.charAt(0).toUpperCase()}
                </div>
            </section>

            {/* Main Menu */}
            <section className="space-y-3">
                <div>
                    <h2 className="text-lg font-semibold">
                        Menu Utama
                    </h2>

                    <p className="text-xs text-muted-foreground">
                        Akses cepat kebutuhan laboratorium
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                    {dashboardMenus.map((menu) => {
                        const Icon = menu.icon;

                        return (
                            <Link
                                key={menu.title}
                                href={menu.href}
                                className="group flex min-h-28 flex-col justify-between rounded-xl border bg-card p-3 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/50"
                            >
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                </div>

                                <div className="mt-3">
                                    <div className="flex items-center justify-between gap-1">
                                        <h3 className="text-sm font-semibold">
                                            {menu.title}
                                        </h3>

                                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {menu.description}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>


        </div>
    );
}
