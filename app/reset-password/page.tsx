'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { authService } from '@/features/auth/services/auth.service';

function ResetPasswordForm() {
  const token = useSearchParams().get('token') ?? '';
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('');
    if (!token) { setError('Tautan reset tidak valid.'); return; }
    if (password !== confirm) { setError('Konfirmasi password tidak cocok.'); return; }
    setBusy(true);
    try { await authService.resetPassword(token, password); router.replace('/login?passwordReset=1'); }
    catch { setError('Tautan reset tidak valid atau sudah kedaluwarsa. Minta tautan baru.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto mt-16 w-full max-w-md space-y-5 rounded-xl border bg-card p-6"><Link href="/login" className="text-sm text-muted-foreground hover:underline">← Kembali ke login</Link><header><h1 className="text-2xl font-semibold">Buat password baru</h1><p className="mt-1 text-sm text-muted-foreground">Password minimal 8 karakter.</p></header><form onSubmit={submit} className="space-y-4"><label className="grid gap-1 text-sm">Password baru<input required minLength={8} type="password" autoComplete="new-password" className="rounded-md border bg-background px-3 py-2" value={password} onChange={event => setPassword(event.target.value)} /></label><label className="grid gap-1 text-sm">Ulangi password<input required minLength={8} type="password" autoComplete="new-password" className="rounded-md border bg-background px-3 py-2" value={confirm} onChange={event => setConfirm(event.target.value)} /></label>{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">{busy ? 'Menyimpan…' : 'Simpan password baru'}</button></form></main>;
}

export default function ResetPasswordPage() { return <Suspense fallback={<main className="p-8">Memuat…</main>}><ResetPasswordForm /></Suspense>; }
