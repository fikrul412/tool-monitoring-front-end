'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { persuratanService } from '../services/persuratan.service';

export function AdminLetterReview() {
  const client = useQueryClient();
  const [comments, setComments] = useState<Record<string, string>>({});
  const query = useQuery({ queryKey: ['persuratan', 'admin'], queryFn: persuratanService.adminApplications });
  const mutation = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: 'RECEIVED' | 'REJECTED' }) => persuratanService.review(id, decision, comments[id]?.trim()),
    onSuccess: async () => { await Promise.all([client.invalidateQueries({ queryKey: ['persuratan', 'admin'] }), client.invalidateQueries({ queryKey: ['persuratan'] })]); },
  });

  return <main className="mx-auto max-w-5xl space-y-6 p-6">
    <header><h1 className="text-2xl font-semibold">Review Surat Persuratan</h1><p className="mt-1 text-sm text-muted-foreground">Periksa dokumen fisik yang diserahkan mahasiswa, lalu terima atau minta pengajuan ulang.</p></header>
    {query.isLoading ? <p className="text-sm text-muted-foreground">Memuat pengajuan…</p> : query.isError ? <p className="text-sm text-destructive">Pengajuan surat gagal dimuat.</p> : query.data?.length ? <div className="space-y-4">
      {query.data.map(item => <article key={item.id} className="space-y-4 rounded-xl border bg-background p-5">
        <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{item.type === 'LAB_ACCESS' ? 'Surat Izin Lab' : 'Surat Bebas Lab'}</h2><p className="mt-1 text-sm">{item.researchTitle}</p><p className="mt-1 text-xs text-muted-foreground">{item.student.name} · {item.student.nim || 'NIM belum diisi'}</p></div><span className="h-fit rounded-full bg-muted px-3 py-1 text-xs">{item.researchStatus}</span></div>
        {item.type === 'LAB_CLEARANCE' && item.clearanceReport && <section className="grid gap-3 rounded-lg bg-muted/30 p-4 text-sm md:grid-cols-3"><div><h3 className="font-medium">Pemakaian bahan</h3>{item.clearanceReport.materialUsage.map((row, index) => <p key={index}>{row.name}: {row.quantity} {row.unit}</p>)}</div><div><h3 className="font-medium">Kondisi alat</h3>{item.clearanceReport.equipmentConditions.map((row, index) => <p key={index}>{row.name}: {row.condition}{row.notes ? ` — ${row.notes}` : ''}</p>)}</div><div><h3 className="font-medium">Limbah dan penanganan</h3>{item.clearanceReport.wasteHandling.map((row, index) => <p key={index}>{row.name} ({row.phase}): {row.handling}{row.quantity ? ` · ${row.quantity} ${row.unit ?? ''}` : ''}{row.notes ? ` — ${row.notes}` : ''}</p>)}</div></section>}
        <label className="block text-sm" htmlFor={`comments-${item.id}`}>Catatan untuk mahasiswa (opsional)</label><textarea id={`comments-${item.id}`} rows={2} maxLength={1000} value={comments[item.id] ?? ''} onChange={e => setComments(current => ({ ...current, [item.id]: e.target.value }))} className="w-full rounded-md border bg-background p-3 text-sm" placeholder="Contoh: mohon perbaiki tanda tangan dosen" />
        <div className="flex flex-wrap justify-end gap-2"><button disabled={mutation.isPending} onClick={() => mutation.mutate({ id: item.id, decision: 'REJECTED' })} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">Tolak, minta ajukan ulang</button><button disabled={mutation.isPending} onClick={() => mutation.mutate({ id: item.id, decision: 'RECEIVED' })} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">{item.type === 'LAB_CLEARANCE' ? 'Approve & mark completed' : 'Terima dokumen'}</button></div>
      </article>)}
    </div> : <p className="rounded-xl border p-5 text-sm text-muted-foreground">Tidak ada surat yang menunggu review.</p>}
    {mutation.isError && <p className="text-sm text-destructive">Review gagal disimpan. Muat ulang daftar lalu coba lagi.</p>}
  </main>;
}
