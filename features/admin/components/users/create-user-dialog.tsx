
"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  CreateManagedUserPayload,
  UserRole,
} from "../../types/admin-user.types";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateManagedUserPayload) => Promise<void>;
  loading: boolean;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateUserDialogProps) {
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [nip, setNip] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  function resetForm() {
    setRole("STUDENT");
    setEmail("");
    setPassword("");
    setName("");
    setNim("");
    setNip("");
    setWhatsapp("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (loading) return;

    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreateManagedUserPayload = {
      email: email.trim(),
      password,
      role,
      ...(role !== "ADMIN" && { name: name.trim() }),
      ...(role === "STUDENT" && { nim: nim.trim() }),
      ...(role === "LECTURER" && { nip: nip.trim() }),
      ...(whatsapp.trim() && { whatsapp: whatsapp.trim() }),
    };

    try {
      await onSubmit(payload);
      resetForm();
    } catch (error) {
      // Keep the form open so the user can correct or retry.
      throw error;
    }
  }

  const fieldClass = "space-y-2";
  const labelClass = "text-sm font-medium";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          flex w-[calc(100%-2rem)] max-w-md
          max-h-[85dvh] flex-col gap-0
          overflow-hidden p-0
        "
      >
        {/* Fixed header */}
        <DialogHeader className="shrink-0 border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <UserPlus className="size-5 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <DialogTitle>Tambah pengguna</DialogTitle>
              <DialogDescription>
                Buat akun mahasiswa, dosen, atau administrator.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Scrollable form fields */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-5">
            <div className={fieldClass}>
              <label htmlFor="user-role" className={labelClass}>
                Peran
              </label>

              <select
                id="user-role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as UserRole)
                }
                disabled={loading}
                className="
                  h-10 w-full rounded-md border border-input
                  bg-background px-3 text-sm
                  outline-none focus-visible:ring-2
                  focus-visible:ring-ring
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <option value="STUDENT">Mahasiswa</option>
                <option value="LECTURER">Dosen</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            {role !== "ADMIN" && (
              <div className={fieldClass}>
                <label htmlFor="user-name" className={labelClass}>
                  Nama lengkap
                </label>
                <Input
                  id="user-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Masukkan nama lengkap"
                  disabled={loading}
                  required
                />
              </div>
            )}

            {role === "STUDENT" && (
              <div className={fieldClass}>
                <label htmlFor="user-nim" className={labelClass}>
                  NIM
                </label>
                <Input
                  id="user-nim"
                  value={nim}
                  onChange={(event) => setNim(event.target.value)}
                  placeholder="Masukkan NIM"
                  disabled={loading}
                  required
                />
              </div>
            )}

            {role === "LECTURER" && (
              <div className={fieldClass}>
                <label htmlFor="user-nip" className={labelClass}>
                  NIP
                </label>
                <Input
                  id="user-nip"
                  value={nip}
                  onChange={(event) => setNip(event.target.value)}
                  placeholder="Masukkan NIP"
                  disabled={loading}
                  required
                />
              </div>
            )}

            <div className={fieldClass}>
              <label htmlFor="user-email" className={labelClass}>
                Email
              </label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                disabled={loading}
                required
              />
            </div>

            <div className={fieldClass}>
              <label htmlFor="user-password" className={labelClass}>
                Password
              </label>
              <Input
                id="user-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                minLength={8}
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password minimal 8 karakter.
              </p>
            </div>

            <div className={fieldClass}>
              <label htmlFor="user-whatsapp" className={labelClass}>
                WhatsApp{" "}
                <span className="font-normal text-muted-foreground">
                  (opsional)
                </span>
              </label>
              <Input
                id="user-whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="08xxxxxxxxxx"
                disabled={loading}
              />
            </div>
          </div>

          {/* Fixed footer */}
          <DialogFooter className="shrink-0 border-t bg-background px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Membuat akun...
                </>
              ) : (
                "Buat akun"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
