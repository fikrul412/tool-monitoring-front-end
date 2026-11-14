'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { authService } from '@/features/auth/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { await authService.requestPasswordReset(email); setSent(true); }
    catch { setError('Permintaan gagal dikirim. Coba lagi.'); }
    finally { setBusy(false); }
  }
  return <main className="mx-auto mt-16 w-full max-w-md space-y-5 rounded-xl border bg-card p-6"><Link href="/login" className="text-sm text-muted-foreground hover:underline">← Kembali ke login</Link><header><h1 className="text-2xl font-semibold">Lupa password</h1><p className="mt-1 text-sm text-muted-foreground">Masukkan email akun untuk menerima tautan reset.</p></header>{sent ? <p className="rounded-lg bg-muted p-4 text-sm">Jika akun cocok, tautan reset akan dikirim ke email tersebut.</p> : <form onSubmit={submit} className="space-y-4"><label className="grid gap-1 text-sm">Email<input required type="email" autoComplete="email" className="rounded-md border bg-background px-3 py-2" value={email} onChange={event => setEmail(event.target.value)} /></label>{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">{busy ? 'Mengirim…' : 'Kirim tautan reset'}</button></form>}</main>;
}
