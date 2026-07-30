import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import jwtDecode from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      userRole: null,
      userEmail: null,
      isAuthenticated: false,

      setToken: (token) => {
        if (token) {
          try {
            const decoded = jwtDecode(token);
            set({
              token,
              userRole: decoded?.role ?? null,
              userEmail: decoded?.sub ?? null,
              isAuthenticated: true,
            });
          } catch (e) {
            set({
              token,
              isAuthenticated: true,
            });
          }
        }
      },

      logout: () => {
        set({
          token: null,
          userRole: null,
          userEmail: null,
          isAuthenticated: false,
        });
      },

      getToken: () => get().token,
      getUserRole: () => get().userRole,
      getUserEmail: () => get().userEmail,
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;