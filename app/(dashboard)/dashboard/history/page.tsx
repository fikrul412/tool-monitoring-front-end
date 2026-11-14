"use client";
import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '@/features/attendance/attendance.service';

export default function HistoryPage() {
  const query = useQuery({ queryKey: ['attendance-history'], queryFn: attendanceService.history });
  return <main className="mx-auto max-w-4xl space-y-5"><header><h1 className="text-2xl font-semibold">10 Aktivitas Terbaru</h1><p className="mt-1 text-sm text-muted-foreground">Aktivitas laboratorium terbaru pada akunmu.</p></header>{query.isLoading ? <p className="text-sm text-muted-foreground">Memuat aktivitas…</p> : query.isError ? <p className="rounded-lg border p-4 text-sm text-destructive">Aktivitas gagal dimuat.</p> : query.data?.length ? <ol className="space-y-3">{query.data.slice(0, 10).map(item => <li key={item.id} className="rounded-lg border p-4"><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.detail}</p><time className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString('id-ID')}</time></li>)}</ol> : <p className="rounded-lg border p-5 text-sm text-muted-foreground">Belum ada aktivitas.</p>}</main>;
}
