import { useCallback, useEffect, useState } from "react";
import { ApiError, apiClient, type SessionUser } from "../services/apiClient.js";

type AuthStatus = "checking" | "anonymous" | "authenticated";

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const response = await apiClient.me();
      setUser(response.user);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (username: string, password: string) => {
    setError("");
    try {
      const response = await apiClient.login(username, password);
      setUser(response.user);
      setStatus("authenticated");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "No se pudo iniciar sesion");
      throw caught;
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    setError("");
    try {
      const response = await apiClient.register(username, password);
      setUser(response.user);
      setStatus("authenticated");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "No se pudo registrar el usuario");
      throw caught;
    }
  }, []);

  const logout = useCallback(async () => {
    await apiClient.logout().catch(() => undefined);
    setUser(null);
    setStatus("anonymous");
  }, []);

  return { user, status, error, login, register, logout, refresh };
}