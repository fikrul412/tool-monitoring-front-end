'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wasteService, type WasteOptionType } from '../waste.service';

const optionTypes: Array<{ value: WasteOptionType; label: string }> = [
  { value: 'CATEGORY', label: 'Kategori limbah' },
  { value: 'UNIT', label: 'Satuan' },
  { value: 'PHASE', label: 'Fase' },
  { value: 'HANDLING', label: 'Penanganan' },
];

export function AdminWasteContent() {
  const client = useQueryClient();
  const [type, setType] = useState<WasteOptionType>('CATEGORY');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const options = useQuery({ queryKey: ['waste', 'options'], queryFn: wasteService.options });
  const records = useQuery({ queryKey: ['waste', 'admin', 'records'], queryFn: wasteService.adminRecords });
  const create = useMutation({ mutationFn: wasteService.createOption, onSuccess: async () => { setValue(''); setError(''); await client.invalidateQueries({ queryKey: ['waste'] }); } });
  const deactivate = useMutation({ mutationFn: wasteService.deactivateOption, onSuccess: async () => { await client.invalidateQueries({ queryKey: ['waste'] }); } });
  const date = (createdAt: string) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(createdAt));

  return <main className="mx-auto max-w-6xl space-y-8 p-6">
    <header><h1 className="text-2xl font-semibold">Pengelolaan Limbah</h1><p className="mt-1 text-sm text-muted-foreground">Kelola pilihan kategori, satuan, fase, dan penanganan. Pilihan yang dibuat mahasiswa muncul di sini.</p></header>
    <section className="space-y-4 rounded-xl border p-5"><h2 className="font-semibold">Pilihan katalog</h2><form className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]" onSubmit={event => { event.preventDefault(); setError(''); create.mutate({ type, value: value.trim() }, { onError: () => setError('Pilihan gagal dibuat. Periksa apakah nilainya sudah ada.') }); }}><label className="grid gap-1 text-sm">Jenis<select className="rounded-md border bg-background px-3 py-2" value={type} onChange={event => setType(event.target.value as WasteOptionType)}>{optionTypes.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="grid gap-1 text-sm">Nilai baru<input required maxLength={150} className="rounded-md border bg-background px-3 py-2" value={value} onChange={event => setValue(event.target.value)} placeholder="Masukkan nilai katalog" /></label><button disabled={create.isPending} className="self-end rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">Tambah pilihan</button></form>{error && <p className="text-sm text-destructive">{error}</p>}{options.isLoading ? <p className="text-sm text-muted-foreground">Memuat katalog…</p> : options.isError ? <p className="text-sm text-destructive">Katalog gagal dimuat.</p> : <div className="grid gap-4 md:grid-cols-2">{optionTypes.map(group => <section key={group.value} className="space-y-2 rounded-lg bg-muted/30 p-4"><h3 className="text-sm font-medium">{group.label}</h3>{(options.data ?? []).filter(option => option.type === group.value).map(option => <div key={option.id} className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm"><span>{option.value}</span><button type="button" className="text-xs text-destructive hover:underline" disabled={deactivate.isPending} onClick={() => deactivate.mutate(option.id)}>Nonaktifkan</button></div>)}</section>)}</div>}</section>
    <section className="space-y-4"><div><h2 className="text-xl font-semibold">Laporan limbah</h2><p className="mt-1 text-sm text-muted-foreground">Limbah yang dilaporkan melalui pengajuan Surat Bebas Lab.</p></div>{records.isLoading ? <p className="text-sm text-muted-foreground">Memuat laporan…</p> : records.isError ? <p className="text-sm text-destructive">Laporan limbah gagal dimuat.</p> : records.data?.length ? <div className="overflow-x-auto rounded-xl border"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="p-3">Tanggal</th><th className="p-3">Mahasiswa</th><th className="p-3">Penelitian</th><th className="p-3">Kategori</th><th className="p-3">Jumlah</th><th className="p-3">Fase</th><th className="p-3">Penanganan</th><th className="p-3">Catatan</th></tr></thead><tbody>{records.data.map(record => <tr key={record.id} className="border-t"><td className="whitespace-nowrap p-3">{date(record.createdAt)}</td><td className="p-3">{record.student.name}<span className="block text-xs text-muted-foreground">{record.student.nim || 'NIM belum diisi'}</span></td><td className="p-3">{record.researchTitle}</td><td className="p-3">{record.category}</td><td className="p-3">{record.quantity} {record.unit}</td><td className="p-3">{record.phase}</td><td className="p-3">{record.handling}</td><td className="p-3">{record.notes || '—'}</td></tr>)}</tbody></table></div> : <p className="rounded-xl border p-5 text-sm text-muted-foreground">Belum ada laporan limbah.</p>}</section>
  </main>;
}
