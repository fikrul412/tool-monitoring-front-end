
import Link from "next/link";
import {
  FlaskConical,
  ArrowRight,
  Microscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <FlaskConical className="size-5 text-primary" />
          Tool Monitor
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-sm hover:bg-accent"
          >
            Login
          </Link>

          <Button
            nativeButton={false}
            size="sm"
            className="rounded-full"
            render={<Link href="/register" />}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-8">

          {/* Introduction */}
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Microscope className="size-8 text-primary" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Laboratory Management System
              </h1>

              <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">
                A centralized platform for managing laboratory
                research, equipment, materials, reservations,
                attendance, and borrowing activities.
              </p>
            </div>
          </div>

          {/* Login Action */}
          <div className="flex flex-col items-center gap-3">
            <Button
              nativeButton={false}
              size="lg"
              className="w-full max-w-xs rounded-full"
              render={<Link href="/login" />}
            >
              Access Tool Monitor
              <ArrowRight className="ml-2 size-4" />
            </Button>

            <p className="text-xs text-muted-foreground">
              For students, lecturers, and laboratory personnel.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 Tool Monitor
      </footer>
    </div>
  );
}
