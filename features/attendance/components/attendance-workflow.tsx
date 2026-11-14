"use client";

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { attendanceService } from '../attendance.service';

const field = 'w-full rounded-md border bg-background px-3 py-2 text-sm';
const button = 'rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50';

export default function AttendanceWorkflow() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['attendance-options'], queryFn: attendanceService.options });
  const [labId, setLabId] = useState('');
  const [researchId, setResearchId] = useState('');
  const [challenge, setChallenge] = useState<{ labId: string; researchId?: string | null; type: 'ENTRY' | 'EXIT'; qrPayload: string } | null>(null);
  const confirm = useMutation({ mutationFn: attendanceService.confirm, onSuccess: async () => { setChallenge(null); await Promise.all([client.invalidateQueries({ queryKey: ['attendance-options'] }), client.invalidateQueries({ queryKey: ['attendance-history'] })]); } });
  const request = useMutation({ mutationFn: attendanceService.request, onSuccess: data => { confirm.reset(); if (data.result === 'QR_REQUIRED') setChallenge(data); } });
  const current = query.data?.current;

  return <main className="mx-auto max-w-2xl space-y-6">
    <header><h1 className="text-2xl font-semibold">Absensi QR</h1><p className="mt-1 text-sm text-muted-foreground">Pilih laboratorium dan research (opsional), lalu autentikasi QR untuk masuk. Scan kembali saat pulang.</p></header>
    {query.isLoading ? <p className="text-sm text-muted-foreground">Memuat pilihan…</p> : query.isError ? <p className="rounded-lg border p-4 text-sm text-destructive">Informasi absensi gagal dimuat.</p> : current ? <section className="space-y-4 rounded-xl border p-5"><div><h2 className="font-semibold">Kamu sedang berada di laboratorium</h2><p className="text-sm text-muted-foreground">{current.labName}{current.location ? ` · ${current.location}` : ''}</p>{current.researchTitle && <p className="text-sm text-muted-foreground">Research: {current.researchTitle}</p>}</div><button className={button} disabled={request.isPending || Boolean(challenge)} onClick={() => request.mutate({ labId: current.labId })}>Ajukan pulang</button></section> : <form className="space-y-4 rounded-xl border p-5" onSubmit={event => { event.preventDefault(); request.mutate({ labId, ...(researchId ? { researchId } : {}) }); }}><label className="block space-y-1 text-sm font-medium">Laboratorium<select className={field} required value={labId} onChange={event => setLabId(event.target.value)}><option value="">Pilih laboratorium</option>{query.data?.labs?.map((lab: { id: string; name: string; location: string | null }) => <option key={lab.id} value={lab.id}>{lab.name}{lab.location ? ` · ${lab.location}` : ''}</option>)}</select></label><label className="block space-y-1 text-sm font-medium">Research (opsional)<select className={field} value={researchId} onChange={event => setResearchId(event.target.value)}><option value="">Tanpa research</option>{query.data?.researches?.map((research: { id: string; title: string }) => <option key={research.id} value={research.id}>{research.title}</option>)}</select></label><button className={button} disabled={request.isPending || !labId || Boolean(challenge)}>Ajukan kehadiran</button></form>}
    {request.isError && <p className="text-sm text-destructive">Pengajuan absensi gagal. Periksa pilihan dan coba lagi.</p>}
    {confirm.data?.changed === false && <p className="text-sm text-muted-foreground">Autentikasi gagal. Tidak ada log absensi yang dibuat.</p>}
    {challenge && <section className="flex flex-col items-center gap-4 rounded-xl border p-6 text-center"><h2 className="font-semibold">QR autentikasi {challenge.type === 'ENTRY' ? 'masuk' : 'pulang'}</h2><QRCodeSVG value={challenge.qrPayload} size={220} level="M" /><p className="max-w-sm text-sm text-muted-foreground">Belum ada perubahan pada absensi. Gunakan tombol dummy berikut untuk simulasi hasil scan.</p><div className="flex gap-3"><button className={button} disabled={confirm.isPending} onClick={() => confirm.mutate({ labId: challenge.labId, researchId: challenge.researchId ?? undefined, type: challenge.type, result: 'OK' })}>Okay · terautentikasi</button><button className="rounded-md border px-4 py-2 text-sm" disabled={confirm.isPending} onClick={() => confirm.mutate({ labId: challenge.labId, researchId: challenge.researchId ?? undefined, type: challenge.type, result: 'FAILED' })}>Failed</button></div></section>}
  </main>;
}
