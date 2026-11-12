
import { api } from "@/lib/axios";
import { RegisterPayload } from "../interfaces/register.interface";

export const authService = {
  async login(payload: { email: string; password: string }) {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post("/auth/register/student", payload);
    return response.data;
  },

  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  async getIdentity() {
    const response = await api.get("/identity/me");
    return response.data;
  },
};
