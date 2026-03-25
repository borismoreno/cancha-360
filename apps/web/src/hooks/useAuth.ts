import { useMemo } from "react";
import type { JwtUser } from "../types/auth";

function parseJwt(token: string): JwtUser | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload)) as JwtUser;
  } catch {
    return null;
  }
}

export function useAuth() {
  const user = useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return parseJwt(token);
  }, []);

  const isAuthenticated = !!user && user.type !== "TEMP_AUTH";
  const isSuperAdmin = user?.role?.includes("SUPER_ADMIN") || false;
  const isDirector = user?.role?.includes("DIRECTOR") || false;
  const isCoach = user?.role?.includes("COACH") || false;

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return { user, isAuthenticated, isSuperAdmin, isDirector, isCoach, logout };
}
