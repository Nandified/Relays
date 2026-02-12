"use client";

import * as React from "react";
import { type SessionUser, type UserRole } from "@/lib/auth/types";
import { type ProOnboardingData } from "@/lib/types";

type AuthState =
  | { status: "anon"; user: null }
  | { status: "authed"; user: SessionUser };

interface AuthContextValue {
  state: AuthState;
  loginFake: (opts: { email: string; role?: UserRole }) => void;
  logout: () => void;
  updateProOnboarding: (data: Partial<ProOnboardingData>) => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const LS_KEY = "relays_fake_session_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ status: "anon", user: null });

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SessionUser;
      if (parsed?.id && parsed?.email) {
        setState({ status: "authed", user: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  const loginFake = React.useCallback((opts: { email: string; role?: UserRole }) => {
    const user: SessionUser = {
      id: `user_${Math.random().toString(36).slice(2, 10)}`,
      email: opts.email,
      name: opts.email.split("@")[0],
      role: opts.role ?? "consumer",
      proOnboarding: opts.role === "pro" ? {
        category: null,
        companyName: "",
        fullName: "",
        serviceArea: "",
        headshotUploaded: false,
        logoUploaded: false,
        onboardingComplete: false,
      } : undefined,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(user));
    setState({ status: "authed", user });
  }, []);

  const updateProOnboarding = React.useCallback((data: Partial<ProOnboardingData>) => {
    setState((prev) => {
      if (prev.status !== "authed") return prev;
      const updated = {
        ...prev.user,
        proOnboarding: {
          ...(prev.user.proOnboarding ?? {
            category: null,
            companyName: "",
            fullName: "",
            serviceArea: "",
            headshotUploaded: false,
            logoUploaded: false,
            onboardingComplete: false,
          }),
          ...data,
        },
      };
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      return { status: "authed", user: updated };
    });
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setState({ status: "anon", user: null });
  }, []);

  const value = React.useMemo<AuthContextValue>(() => ({ state, loginFake, logout, updateProOnboarding }), [state, loginFake, logout, updateProOnboarding]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
