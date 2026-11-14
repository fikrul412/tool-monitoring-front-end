'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export function StudentPublicProfile() {
  const { id } = useParams<{ id: string }>();
  const profile = useQuery({ queryKey: ['student-profile', id], queryFn: async () => (await api.get<{ id: string; name: string; nim: string | null; whatsapp: string | null }>(`/identity/students/${id}/profile`)).data, enabled: Boolean(id) });
  const whatsappDigits = profile.data?.whatsapp?.replace(/\D/g, '');
  return <main className="mx-auto max-w-2xl space-y-5"><Link className="text-sm text-muted-foreground hover:underline" href="/dashboard/loans?tab=schedule">← Kembali ke schedule alat</Link><header><h1 className="text-2xl font-semibold">Profil mahasiswa</h1><p className="mt-1 text-sm text-muted-foreground">Informasi kontak penjadwal alat.</p></header>{profile.isLoading ? <p className="text-sm text-muted-foreground">Memuat profil…</p> : profile.isError || !profile.data ? <p className="rounded-lg border p-4 text-sm text-destructive">Profil mahasiswa tidak dapat dimuat.</p> : <section className="space-y-4 rounded-xl border p-5"><div><p className="text-xs text-muted-foreground">Nama</p><p className="font-medium">{profile.data.name}</p></div><div><p className="text-xs text-muted-foreground">NIM</p><p className="font-medium">{profile.data.nim}</p></div><div><p className="text-xs text-muted-foreground">WhatsApp</p>{profile.data.whatsapp ? <a className="font-medium text-primary underline" href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer">{profile.data.whatsapp} · Hubungi</a> : <p className="text-sm text-muted-foreground">Nomor WhatsApp belum dicantumkan.</p>}</div></section>}</main>;
}
