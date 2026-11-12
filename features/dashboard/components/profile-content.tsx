
"use client";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
    UserRound,
    Mail,
    ShieldCheck,
    GraduationCap,
    BriefcaseBusiness,
    Phone,
} from "lucide-react";

export default function ProfileContent() {
    const user = useAuthStore((state) => state.user);

    if (!user) return null;

    const profile = user.profile;
    const isStudent = user.role === "STUDENT";

    const name = profile?.name ?? "Unknown User";
    const initial = name.charAt(0).toUpperCase();

    const profileFields = [
        {
            label: isStudent ? "NIM" : "NIP",
            value: profile
                ? isStudent && "nim" in profile
                    ? profile.nim
                    : "nip" in profile
                        ? profile.nip
                        : "-"
                : "-",
            icon: isStudent ? GraduationCap : BriefcaseBusiness,
        },
        {
            label: "WhatsApp",
            value: profile?.whatsapp || "Not provided",
            icon: Phone,
        },
    ];

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Page Heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Profil
                </h1>
                <p className="text-sm text-muted-foreground">
                    Informasi akun dan data pribadi Anda.
                </p>
            </div>

            {/* Profile Header */}
            <section className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-center">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                    {initial}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold">
                        {name}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {user.email}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {user.role}
                        </span>

                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                            {user.status}
                        </span>
                    </div>
                </div>
            </section>

            {/* Account Information */}
            <section className="space-y-4 rounded-xl border bg-card p-5">
                <div>
                    <h2 className="font-semibold">
                        Informasi Akun
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Informasi dasar akun Tool Monitor.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-muted p-2">
                            <UserRound className="size-4" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Nama Lengkap
                            </p>
                            <p className="text-sm font-medium">
                                {name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-muted p-2">
                            <Mail className="size-4" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Email
                            </p>
                            <p className="break-all text-sm font-medium">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-muted p-2">
                            <ShieldCheck className="size-4" />
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Status Akun
                            </p>
                            <p className="text-sm font-medium">
                                {user.status}
                            </p>
                        </div>
                    </div>

                    {profileFields.map((field) => {
                        const Icon = field.icon;

                        return (
                            <div
                                key={field.label}
                                className="flex items-start gap-3"
                            >
                                <div className="rounded-lg bg-muted p-2">
                                    <Icon className="size-4" />
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {field.label}
                                    </p>
                                    <p className="text-sm font-medium">
                                        {field.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Account Details */}
            <section className="rounded-xl border bg-card p-5">
                <h2 className="font-semibold">
                    Detail Keanggotaan
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                    Informasi jenis keanggotaan laboratorium.
                </p>

                <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                    {isStudent ? (
                        <GraduationCap className="size-6 text-muted-foreground" />
                    ) : (
                        <BriefcaseBusiness className="size-6 text-muted-foreground" />
                    )}

                    <div>
                        <p className="text-sm font-medium">
                            {isStudent ? "Mahasiswa" : "Dosen"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {isStudent
                                ? "Akun mahasiswa Tool Monitor"
                                : "Akun dosen Tool Monitor"}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
