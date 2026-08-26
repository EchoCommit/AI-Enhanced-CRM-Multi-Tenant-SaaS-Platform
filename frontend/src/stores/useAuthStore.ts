import { create } from "zustand";
import { User } from "@/types";
import {
  loginApi,
  signupApi,
  verifyMfaApi,
  LoginParams,
  SignupParams,
  VerifyMfaParams,
} from "@/lib/auth";

interface AuthState {
  // Access token stored in memory ONLY (never localStorage)
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  mfaRequired: boolean;
  mfaToken: string | null;
  isLoading: boolean;
  error: string | null;

  login: (params: LoginParams) => Promise<boolean>;
  verifyMfa: (params: VerifyMfaParams) => Promise<boolean>;
  signup: (params: SignupParams) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  mfaRequired: false,
  mfaToken: null,
  isLoading: false,
  error: null,

  login: async (params: LoginParams) => {
    set({ isLoading: true, error: null, mfaRequired: false, mfaToken: null });
    try {
      const response = await loginApi(params);

      if (response.mfa_required) {
        set({
          mfaRequired: true,
          mfaToken: response.mfa_token,
          isLoading: false,
        });
        return false; // MFA flow required
      }

      set({
        accessToken: response.access_token,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true; // Login success
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  verifyMfa: async (params: VerifyMfaParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyMfaApi(params);
      set({
        accessToken: response.access_token,
        user: response.user,
        isAuthenticated: true,
        mfaRequired: false,
        mfaToken: null,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "MFA verification failed.";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  signup: async (params: SignupParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signupApi(params);
      set({
        accessToken: response.access_token,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Account creation failed.";
      set({ isLoading: false, error: message });
      return false;
    }
  },

  logout: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      mfaRequired: false,
      mfaToken: null,
      isLoading: false,
      error: null,
    }),

  clearError: () => set({ error: null }),
}));
