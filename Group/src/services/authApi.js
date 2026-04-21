// Auth API Client - Uses direct backend URL, not the admin/punishment API
const AUTH_BASE_URL = "http://localhost:5050";

async function authFetch(path, options = {}) {
  try {
    const response = await fetch(`${AUTH_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export const authApi = {
  register(payload) {
    return authFetch("/auth/register", {
      method: "POST",
      body: payload,
    });
  },

  login(payload) {
    return authFetch("/auth/login", {
      method: "POST",
      body: payload,
    });
  },

  logout() {
    return authFetch("/auth/logout", {
      method: "POST",
    });
  },

  me() {
    return authFetch("/auth/me", {
      method: "GET",
    });
  },
};
