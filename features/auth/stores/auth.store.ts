import { create } from "zustand";
import axios from "axios";

import { identityService } from "../services/identity.service";  
import type { Identity } from "../interfaces/identity.interface";
type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | "error";

interface AuthState {
    user: Identity | null;
    status: AuthStatus;

    initializeAuth: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    setUser: (user: Identity) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    const fetchIdentity = async () => {
        set({ status: "loading" });

        try {
            const user = await identityService.getMe();

            set({
                user,
                status: "authenticated",
            });
        } catch (error) {
            if (
                axios.isAxiosError(error) &&
                error.response?.status === 401
            ) {
                set({
                    user: null,
                    status: "unauthenticated",
                });

                return;
            }

            set({
                user: null,
                status: "error",
            });
        }
    };

    return {
        user: null,
        status: "loading",

        initializeAuth: fetchIdentity,
        refreshAuth: fetchIdentity,

        setUser: (user) => {
            set({
                user,
                status: "authenticated",
            });
        },

        clearUser: () => {
            set({
                user: null,
                status: "unauthenticated",
            });
        },
    };
});