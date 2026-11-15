import Link from "next/link";

export default function LaboratoryContactPage() {
    return (
        <main className="mx-auto max-w-3xl space-y-5">
            <header>
                <h1 className="text-2xl font-semibold">Kontak Laboratorium</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Hubungi petugas laboratorium untuk bantuan terkait fasilitas dan kegiatan.
                </p>
            </header>
            <section className="space-y-3 rounded-xl border bg-card p-5 text-sm leading-6">
                <p>
                    Nomor WhatsApp laboratorium belum dicantumkan di aplikasi. Untuk mendapatkan
                    kontak yang benar, tanyakan kepada dosen pembimbing atau petugas laboratorium.
                </p>
                <p>
                    Anda dapat melengkapi nomor WhatsApp pada profil agar informasi kontak akun
                    Anda tersedia saat diperlukan.
                </p>
                <Link className="inline-block text-primary underline underline-offset-4" href="/dashboard/profile">
                    Buka profil
                </Link>
            </section>
            <Link className="text-sm text-primary underline underline-offset-4" href="/dashboard">
                Kembali ke dashboard
            </Link>
        </main>
    );
}
