import { Suspense } from "react";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import DashboardShell from "@/features/dashboard/components/dashboard-shell";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <ProtectedRoute>
                <DashboardShell>
                    {children}
                </DashboardShell>
            </ProtectedRoute>
        </Suspense>
    );
}
