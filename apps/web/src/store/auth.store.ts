import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JwtUser } from '../types/auth';
import type { Academy } from '../types/academy';

interface AuthState {
  user: JwtUser | null;
  academy: Academy | null;
  token: string | null;
  roles: string[];
  _hasHydrated: boolean;
  setSession: (user: JwtUser | null, academy: Academy | null, token: string) => void;
  logout: () => void;
  _setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      academy: null,
      token: null,
      roles: [],
      _hasHydrated: false,
      setSession: (user, academy, token) =>
        set({ user, academy, token, roles: user?.role ?? [] }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, academy: null, token: null, roles: [] });
        window.location.href = '/login';
      },
      _setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    }
  )
);
