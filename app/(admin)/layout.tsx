import { Suspense } from "react";
import AdminShell from "@/features/admin/components/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="min-h-screen" />}><AdminShell>{children}</AdminShell></Suspense>;
}
