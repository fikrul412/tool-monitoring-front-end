"use client";

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Activity, ArrowUpRight, BookOpen, Boxes, Building2, ClipboardList, Package, Users } from 'lucide-react';
import { attendanceService } from '@/features/attendance/attendance.service';

const statistics = [
  { title: 'Sedang di laboratorium', key: 'currentlyInLabs', description: 'Pengguna dengan sesi absensi aktif', icon: Users },
  { title: 'Masuk hari ini', key: 'entriesToday', description: 'Log masuk laboratorium hari ini', icon: Building2 },
  { title: 'Pulang hari ini', key: 'exitsToday', description: 'Log keluar laboratorium hari ini', icon: Boxes },
  { title: 'Total log absensi', key: 'totalLogs', description: 'Seluruh catatan kehadiran', icon: Package },
];
const modules = [
  { title: 'Manajemen Pengguna', href: '/admin/users', icon: Users },
  { title: 'Manajemen Laboratorium', href: '/admin/laboratories', icon: Building2 },
  { title: 'Manajemen Peralatan', href: '/admin/equipment', icon: Boxes },
  { title: 'Manajemen Bahan', href: '/admin/materials', icon: Package },
  { title: 'Manajemen Research', href: '/admin/research', icon: BookOpen },
  { title: 'Manajemen Absensi', href: '/admin/attendance', icon: ClipboardList },
  { title: 'Peminjaman Alat dan Bahan', href: '/admin/loans', icon: Activity },
];

export default function AdminDashboardContent() {
  const summary = useQuery({ queryKey: ['admin-attendance-summary'], queryFn: attendanceService.adminSummary });
  return <div className="mx-auto w-full max-w-7xl space-y-8"><section className="space-y-1"><h2 className="text-xl font-semibold tracking-tight">Dashboard Administrator</h2><p className="text-sm text-muted-foreground">Ringkasan aktivitas laboratorium dan akses pengelolaan.</p></section><section className="space-y-4"><div><h3 className="text-sm font-semibold">Ringkasan Absensi</h3><p className="text-xs text-muted-foreground">Data langsung dari catatan kehadiran.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statistics.map(item => { const Icon = item.icon; const key = item.key as 'currentlyInLabs' | 'entriesToday' | 'exitsToday' | 'totalLogs'; const value = summary.data?.[key]; return <div key={item.title} className="rounded-xl border bg-background p-5"><div className="flex items-center justify-between"><p className="text-sm font-medium text-muted-foreground">{item.title}</p><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><Icon className="size-4 text-muted-foreground" /></div></div><p className="mt-4 text-2xl font-semibold tracking-tight">{summary.isLoading ? '…' : summary.isError ? '—' : value}</p><p className="mt-1 text-xs text-muted-foreground">{item.description}</p></div>; })}</div></section><section className="space-y-3"><div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Absensi terbaru</h3><p className="text-xs text-muted-foreground">Aktivitas masuk dan pulang terkini.</p></div><Link className="text-sm text-primary hover:underline" href="/admin/attendance">Lihat semua</Link></div><div className="divide-y rounded-xl border">{summary.data?.recentLogs?.slice(0, 5).map(log => <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm"><div><p className="font-medium">{log.name} · {log.labName}</p><p className="text-xs text-muted-foreground">{log.role} · {new Date(log.recordedAt).toLocaleString('id-ID')}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs">{log.status === 'ENTRY' ? 'Masuk' : 'Pulang'}</span></div>)}{!summary.isLoading && !summary.data?.recentLogs?.length && <p className="p-4 text-sm text-muted-foreground">Belum ada log absensi.</p>}</div></section><section className="space-y-3"><div><h3 className="text-sm font-semibold">Menu Pengelolaan</h3><p className="text-xs text-muted-foreground">Pilih data yang ingin dikelola.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{modules.map(item => { const Icon = item.icon; return <Link key={item.title} href={item.href} className="flex items-center justify-between rounded-xl border p-4 hover:bg-accent"><span className="flex items-center gap-3"><Icon className="size-5 text-primary" /><span className="text-sm font-medium">{item.title}</span></span><ArrowUpRight className="size-4 text-muted-foreground" /></Link>; })}</div></section></div>;
}
