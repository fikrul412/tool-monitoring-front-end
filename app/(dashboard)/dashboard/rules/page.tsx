import Link from "next/link";

export default function LaboratoryRulesPage() {
    return (
        <main className="mx-auto max-w-3xl space-y-5">
            <header>
                <h1 className="text-2xl font-semibold">Peraturan Laboratorium</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Ikuti SOP dan arahan petugas yang berlaku di laboratorium Anda.
                </p>
            </header>
            <section className="space-y-3 rounded-xl border bg-card p-5 text-sm leading-6">
                <p>
                    Sebelum bekerja, pastikan Anda sudah mendapat izin, memahami SOP untuk
                    kegiatan dan peralatan yang digunakan, serta memakai alat pelindung diri
                    sesuai arahan petugas laboratorium.
                </p>
                <p>
                    Untuk aturan khusus, prosedur keselamatan, atau penanganan keadaan darurat,
                    minta panduan langsung dari petugas laboratorium. Informasi resmi dapat
                    berbeda untuk setiap laboratorium dan jenis kegiatan.
                </p>
            </section>
            <Link className="text-sm text-primary underline underline-offset-4" href="/dashboard">
                Kembali ke dashboard
            </Link>
        </main>
    );
}
