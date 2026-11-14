import axios from "axios";
import { getAccessToken } from "@/features/auth/services/access-token";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
    return config;
});
