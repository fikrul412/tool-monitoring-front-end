import { Info } from "lucide-react";

export function SubmissionProcessCard() {
  return (
    <section className="rounded-xl border border-border bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <Info className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Proses pengajuan</h2>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Pilih penelitian yang disetujui, ajukan surat, lalu cetak dokumen dan
        mintakan tanda tangan dosen. Serahkan dokumen fisik kepada admin.
      </p>
    </section>
  );
}
