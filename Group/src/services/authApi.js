import { apiGet, apiPost } from "./apiClient";

export const authApi = {
  register(payload) {
    return apiPost("/auth/register", payload);
  },

  login(payload) {
    return apiPost("/auth/login", payload);
  },

  logout() {
    return apiPost("/auth/logout");
  },

  me() {
    return apiGet("/auth/me");
  },
};
