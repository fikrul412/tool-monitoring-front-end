
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { identityService } from '@/features/auth/services/identity.service';
import { useMutation } from '@tanstack/react-query';

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
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const [draft, setDraft] = useState<{ userId: string; name: string; nim: string; whatsapp: string; studyProgram: string; address: string } | null>(null);
    const canEdit = user?.role === 'STUDENT' || user?.role === 'LECTURER';
    const editName = user && draft?.userId === user.id ? draft.name : user?.profile?.name ?? '';
    const studentProfile = user?.profile && 'nim' in user.profile ? user.profile : null;
    const editNim = user && draft?.userId === user.id ? draft.nim : studentProfile?.nim ?? '';
    const editWhatsapp = user && draft?.userId === user.id ? draft.whatsapp : user?.profile?.whatsapp ?? '';
    const editStudyProgram = user && draft?.userId === user.id ? draft.studyProgram : studentProfile?.studyProgram ?? '';
    const editAddress = user && draft?.userId === user.id ? draft.address : studentProfile?.address ?? '';
    const updateDraft = (values: { name?: string; nim?: string; whatsapp?: string; studyProgram?: string; address?: string }) => {
        if (!user) return;
        setDraft({ userId: user.id, name: values.name ?? editName, nim: values.nim ?? editNim, whatsapp: values.whatsapp ?? editWhatsapp, studyProgram: values.studyProgram ?? editStudyProgram, address: values.address ?? editAddress });
    };
    const saveProfile = useMutation({ mutationFn: identityService.updateMyProfile, onSuccess: identity => { setUser(identity); const nim = identity.profile && 'nim' in identity.profile ? identity.profile.nim : null; if (isStudent && !studentProfile?.nim && nim) router.replace('/dashboard'); } });

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
                    ? profile.nim || "Belum diisi"
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
        ...(isStudent ? [
            { label: "Program Studi", value: studentProfile?.studyProgram || "Belum diisi", icon: GraduationCap },
            { label: "Alamat", value: studentProfile?.address || "Belum diisi", icon: UserRound },
        ] : []),
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
                {isStudent && !studentProfile?.nim && <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900">Lengkapi NIM Anda sebelum menggunakan fitur mahasiswa.</p>}
                {canEdit && <form className="mt-4 grid max-w-xl gap-3 rounded-lg border p-4" onSubmit={event => { event.preventDefault(); saveProfile.mutate({ name: editName, whatsapp: editWhatsapp.trim() || null, ...(isStudent ? { nim: editNim.trim(), studyProgram: editStudyProgram || null, address: editAddress || null } : {}) }); }}><label className="grid gap-1 text-sm">Nama<input required maxLength={255} className="rounded-md border bg-background px-3 py-2" value={editName} onChange={event => updateDraft({ name: event.target.value })} /></label>{isStudent && <label className="grid gap-1 text-sm">NIM<input required maxLength={30} className="rounded-md border bg-background px-3 py-2" value={editNim} onChange={event => updateDraft({ nim: event.target.value })} placeholder="Masukkan NIM untuk melanjutkan" /></label>}<label className="grid gap-1 text-sm">Nomor WhatsApp<input maxLength={30} className="rounded-md border bg-background px-3 py-2" value={editWhatsapp} onChange={event => updateDraft({ whatsapp: event.target.value })} /></label>{isStudent && <><label className="grid gap-1 text-sm">Program Studi<input maxLength={150} className="rounded-md border bg-background px-3 py-2" value={editStudyProgram} onChange={event => updateDraft({ studyProgram: event.target.value })} /></label><label className="grid gap-1 text-sm">Alamat<textarea maxLength={2000} className="rounded-md border bg-background px-3 py-2" value={editAddress} onChange={event => updateDraft({ address: event.target.value })} /></label></>}<button className="w-fit rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50" disabled={saveProfile.isPending}>Simpan profil</button>{saveProfile.isError && <p className="text-sm text-destructive">Profil gagal disimpan. NIM mungkin sudah digunakan.</p>}{saveProfile.isSuccess && <p className="text-sm text-muted-foreground">Profil berhasil diperbarui.</p>}</form>}
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
