'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, FileText } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { persuratanService, type LetterType } from '../services/persuratan.service';

const queryKey = ['persuratan'];
const dateLabel = (value: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));

export function EligibleResearchList({ type }: { type: LetterType }) {
  const query = useQuery({ queryKey: [...queryKey, 'eligible'], queryFn: persuratanService.eligible });
  const items = type === 'LAB_ACCESS' ? query.data?.labAccess : query.data?.labClearance;
  const base = type === 'LAB_ACCESS' ? 'izin-lab' : 'bebas-lab';
  const heading = type === 'LAB_ACCESS' ? 'Ajukan Surat Izin Lab' : 'Ajukan Surat Bebas Lab';
  return <main className="mx-auto max-w-3xl space-y-5 p-6"><Link href="/dashboard/persuratan" className="text-sm text-muted-foreground hover:underline">← Layanan Persuratan</Link><div><h1 className="text-2xl font-semibold">{heading}</h1><p className="mt-1 text-sm text-muted-foreground">Pilih penelitian untuk melihat halaman pengajuan.</p></div>
    {query.isLoading ? <p className="text-sm text-muted-foreground">Memuat penelitian…</p> : query.isError ? <p className="text-sm text-destructive">Penelitian gagal dimuat. Muat ulang halaman untuk mencoba lagi.</p> : items?.length ? <div className="space-y-3">{items.map(item => <Link key={item.id} href={`/dashboard/persuratan/${base}/${item.id}`} className="block rounded-xl border p-4 transition-colors hover:bg-accent/40"><div className="flex items-center gap-3"><FileText className="size-5 text-muted-foreground"/><div><h2 className="font-medium">{item.title}</h2><p className="mt-1 text-xs text-muted-foreground">Status penelitian: {item.status}</p></div></div></Link>)}</div> : <p className="rounded-xl border p-5 text-sm text-muted-foreground">Belum ada penelitian yang memenuhi syarat.</p>}
  </main>;
}

export function LetterApplicationPage({ type }: { type: LetterType }) {
  const params = useParams<{ id: string }>(); const router = useRouter(); const client = useQueryClient();
  const eligible = useQuery({ queryKey: [...queryKey, 'eligible'], queryFn: persuratanService.eligible });
  const items = type === 'LAB_ACCESS' ? eligible.data?.labAccess : eligible.data?.labClearance;
  const research = items?.find(item => item.id === params.id);
  const mutation = useMutation({ mutationFn: () => persuratanService.apply(params.id, type), onSuccess: async () => { await client.invalidateQueries({ queryKey }); router.push('/dashboard/persuratan/arsip'); } });
  const title = type === 'LAB_ACCESS' ? 'Surat Izin Lab' : 'Surat Bebas Lab';
  return <main className="mx-auto max-w-2xl space-y-5 p-6"><Link href={`/dashboard/persuratan/${type === 'LAB_ACCESS' ? 'izin-lab' : 'bebas-lab'}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"><ArrowLeft className="size-4"/>Kembali ke daftar</Link>
    <section className="space-y-4 rounded-xl border p-6"><div><p className="text-sm text-muted-foreground">Halaman pengajuan</p><h1 className="mt-1 text-2xl font-semibold">{title}</h1></div>
      {eligible.isLoading ? <p className="text-sm text-muted-foreground">Memuat penelitian…</p> : research ? <><div className="rounded-lg bg-muted/50 p-4"><p className="text-xs text-muted-foreground">Penelitian</p><p className="mt-1 font-medium">{research.title}</p></div><p className="text-sm leading-relaxed text-muted-foreground">Halaman pengajuan surat ini masih dalam tahap persiapan. Dokumen belum tersedia. Setelah alur surat aktif, ikuti instruksi untuk mencetak surat, meminta tanda tangan dosen, lalu menyerahkan dokumen fisik kepada admin.</p><button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">{mutation.isPending ? 'Mengajukan…' : 'Catat pengajuan'}</button>{mutation.isError && <p className="text-sm text-destructive">Pengajuan gagal. Silakan coba lagi.</p>}</> : <p className="text-sm text-muted-foreground">Penelitian tidak ditemukan atau sudah tidak memenuhi syarat.</p>}
    </section></main>;
}

export function LetterArchive() {
  const query = useQuery({ queryKey: [...queryKey, 'archive'], queryFn: persuratanService.archive });
  return <main className="mx-auto max-w-3xl space-y-5 p-6"><Link href="/dashboard/persuratan" className="text-sm text-muted-foreground hover:underline">← Layanan Persuratan</Link><div><h1 className="text-2xl font-semibold">Arsip Surat</h1><p className="mt-1 text-sm text-muted-foreground">Riwayat pengajuan surat penelitian kamu.</p></div>
    {query.isLoading ? <p className="text-sm text-muted-foreground">Memuat arsip…</p> : query.isError ? <p className="text-sm text-destructive">Arsip gagal dimuat.</p> : query.data?.length ? <div className="space-y-3">{query.data.map(item => <article key={item.id} className="rounded-xl border p-4"><div className="flex flex-wrap justify-between gap-2"><div><h2 className="font-medium">{item.type === 'LAB_ACCESS' ? 'Surat Izin Lab' : 'Surat Bebas Lab'}</h2><p className="mt-1 text-sm text-muted-foreground">{item.researchTitle}</p></div><span className="h-fit rounded-full bg-muted px-3 py-1 text-xs">{item.status === 'SUBMITTED' ? 'Menunggu admin' : item.status === 'RECEIVED' ? 'Diterima admin' : 'Perlu diajukan ulang'}</span></div><p className="mt-3 text-xs text-muted-foreground">Diajukan {dateLabel(item.createdAt)}</p>{item.status === 'REJECTED' && <><p className="mt-2 text-sm text-muted-foreground">{item.reviewComments || 'Silakan periksa kembali dokumen dan ajukan ulang.'}</p><Link className="mt-3 inline-flex rounded-md border px-3 py-2 text-sm hover:bg-accent" href={`/dashboard/persuratan/${item.type === 'LAB_ACCESS' ? 'izin-lab' : 'bebas-lab'}/${item.researchId}`}>Ajukan ulang</Link></>}</article>)}</div> : <p className="rounded-xl border p-5 text-sm text-muted-foreground">Belum ada surat di arsip.</p>}
  </main>;
}
