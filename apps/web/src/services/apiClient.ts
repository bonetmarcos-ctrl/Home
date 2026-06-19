import type { AppState, CollectionName } from "@habitacion/domain";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

export interface SessionUser {
  ownerId: string;
  username: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly payload?: unknown
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${configuredBaseUrl}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = payload?.error?.message ?? payload?.error?.code ?? response.statusText;
    throw new ApiError(response.status, message, payload);
  }

  return payload as T;
}

export const apiClient = {
  health: () => request<{ ok: boolean }>("/api/health"),
  me: () => request<{ user: SessionUser }>("/api/auth/me"),
  login: (username: string, password: string) =>
    request<{ user: SessionUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),
  register: (username: string, password: string) =>
    request<{ user: SessionUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password })
    }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  getState: () => request<AppState>("/api/state"),
  saveState: (state: AppState) =>
    request<AppState>("/api/state", {
      method: "PUT",
      body: JSON.stringify(state)
    }),
  resetState: () => request<AppState>("/api/state/reset", { method: "POST" }),
  createItem: <T>(collection: CollectionName, item: unknown) =>
    request<T>(`/api/${collection}`, {
      method: "POST",
      body: JSON.stringify(item)
    }),
  updateItem: <T>(collection: CollectionName, id: string, item: unknown) =>
    request<T>(`/api/${collection}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(item)
    }),
  deleteItem: (collection: CollectionName, id: string) =>
    request<void>(`/api/${collection}/${encodeURIComponent(id)}`, { method: "DELETE" })
};