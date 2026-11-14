"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { saveAccessToken } from "@/features/auth/services/access-token";

export function AuthInitializer({
    children,
}: {
    children: React.ReactNode;
}) {
    const initializeAuth = useAuthStore(
        (state) => state.initializeAuth
    );

    useEffect(() => {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const token = fragment.get('access_token');
        if (token) {
            saveAccessToken(token);
            window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
        }
        initializeAuth();
    }, [initializeAuth]);

    return <>{children}</>;
}
