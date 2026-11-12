"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/stores/auth.store";

export function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const status = useAuthStore((state) => state.status);
    const initializeAuth = useAuthStore(
        (state) => state.initializeAuth
    );

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    return (
        <>
            <div style={{ display: status === "authenticated" ? "contents" : "none" }}>
                {children}
            </div>
            {status === "loading" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
                    <p className="text-sm text-muted-foreground">Checking authentication...</p>
                </div>
            )}
            {status === "error" && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background">
                    <p className="text-sm text-muted-foreground">Unable to connect to the server.</p>
                    <button onClick={initializeAuth} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Try Again</button>
                </div>
            )}
        </>
    );
}
