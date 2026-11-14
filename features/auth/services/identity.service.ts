import { api } from "@/lib/axios";
import type { Identity } from "../interfaces/identity.interface";

export const identityService = {
    async getMe(): Promise<Identity> {
        const response = await api.get<Identity>("/identity/me", {
            withCredentials: true,
        });
        return response.data;
    },
    async updateMyProfile(payload: { name: string; whatsapp: string | null; nim?: string | null; studyProgram?: string | null; address?: string | null }): Promise<Identity> {
        return (await api.patch<Identity>('/identity/me/profile', payload)).data;
    },
};
