
import { api } from "@/lib/axios";
import { RegisterPayload } from "../interfaces/register.interface";
import { clearAccessToken, saveAccessToken } from './access-token';

export const authService = {
  async login(payload: { email: string; password: string }) {
    const response = await api.post("/auth/login", payload, {
      withCredentials: true,
    });
    if (response.data.accessToken) saveAccessToken(response.data.accessToken);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post("/auth/register/student", payload);
    return response.data;
  },

  async logout() {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } finally {
      clearAccessToken();
    }
  },

  async getIdentity() {
    const response = await api.get("/identity/me", {
      withCredentials: true,
    });
    return response.data;
  },
};
