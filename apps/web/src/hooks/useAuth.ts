import type { JwtUser } from '../types/auth';
import { useAuthStore } from '../store/auth.store';

export function parseJwt(token: string): JwtUser | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as JwtUser;
  } catch {
    return null;
  }
}

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isAuthenticated = !!user && user.type !== 'TEMP_AUTH';
  const isSuperAdmin = user?.role?.includes('SUPER_ADMIN') || false;
  const isDirector = user?.role?.includes('DIRECTOR') || false;
  const isCoach = user?.role?.includes('COACH') || false;

  return { user, isAuthenticated, isSuperAdmin, isDirector, isCoach, logout };
}
