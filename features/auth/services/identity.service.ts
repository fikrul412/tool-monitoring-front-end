import { api } from "@/lib/axios";
import type { Identity } from "../interfaces/identity.interface";

export const identityService = {
    async getMe(): Promise<Identity> {
        const response = await api.get<Identity>("/identity/me");
        return response.data;
    },
};