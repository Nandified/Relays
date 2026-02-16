"use client";

import * as React from "react";
import { type SessionUser, type UserRole } from "@/lib/auth/types";
import { type ProOnboardingData } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Session, User, AuthError } from "@supabase/supabase-js";

/* ── State shapes ────────────────────────────────────────── */

type AuthState =
  | { status: "loading"; user: null }
  | { status: "anon"; user: null }
  | { status: "authed"; user: SessionUser };

interface AuthResult {
  error: AuthError | Error | null;
}

interface AuthContextValue {
  state: AuthState;
  /** Mock-mode login (localStorage). Active when Supabase is not configured. */
  loginFake: (opts: { email: string; role?: UserRole }) => void;
  /** Real Supabase email+password sign-in */
  signIn: (email: string, password: string) => Promise<AuthResult>;
  /** Real Supabase email+password sign-up */
  signUp: (email: string, password: string, meta?: { role?: UserRole }) => Promise<AuthResult>;
  /** Sign in with magic link (Supabase OTP) */
  signInWithMagicLink: (email: string) => Promise<AuthResult>;
  /** Sign in with OAuth provider */
  signInWithOAuth: (provider: "google" | "apple") => Promise<AuthResult>;
  /** Sign out (works for both mock and real) */
  logout: () => void;
  updateProOnboarding: (data: Partial<ProOnboardingData>) => void;
  /** Whether we're using real Supabase auth */
  isSupabase: boolean;
  /** Raw Supabase session (null in mock mode) */
  session: Session | null;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const LS_KEY = "relays_fake_session_v1";

/* ── Helper: Supabase User → SessionUser ─────────────────── */

function supabaseUserToSession(user: User): SessionUser {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? "",
    name: meta.display_name ?? meta.full_name ?? meta.name ?? user.email?.split("@")[0] ?? "",
    role: (meta.role as UserRole) ?? "consumer",
    avatarUrl: meta.avatar_url ?? null,
    proOnboarding: meta.pro_onboarding ?? undefined,
  };
}

/* ── Provider ─────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const usingSupabase = isSupabaseConfigured();
  const [state, setState] = React.useState<AuthState>(
    usingSupabase ? { status: "loading", user: null } : { status: "anon", user: null },
  );
  const [session, setSession] = React.useState<Session | null>(null);

  /* ── Supabase init ───── */
  React.useEffect(() => {
    if (!usingSupabase) {
      // Mock mode: restore from localStorage
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
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s?.user) {
        setSession(s);
        setState({ status: "authed", user: supabaseUserToSession(s.user) });
      } else {
        setState({ status: "anon", user: null });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setState({ status: "authed", user: supabaseUserToSession(s.user) });
      } else {
        setState({ status: "anon", user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [usingSupabase]);

  /* ── Mock login ───── */
  const loginFake = React.useCallback(
    (opts: { email: string; role?: UserRole }) => {
      const user: SessionUser = {
        id: `user_${Math.random().toString(36).slice(2, 10)}`,
        email: opts.email,
        name: opts.email.split("@")[0],
        role: opts.role ?? "consumer",
        proOnboarding:
          opts.role === "pro"
            ? {
                category: null,
                companyName: "",
                fullName: "",
                serviceArea: "",
                headshotUploaded: false,
                logoUploaded: false,
                onboardingComplete: false,
              }
            : undefined,
      };
      localStorage.setItem(LS_KEY, JSON.stringify(user));
      setState({ status: "authed", user });
    },
    [],
  );

  /* ── Supabase sign-in (email/password) ───── */
  const signIn = React.useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const supabase = createClient();
      if (!supabase) {
        // Fallback: mock sign-in
        loginFake({ email });
        return { error: null };
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    },
    [loginFake],
  );

  /* ── Supabase sign-up ───── */
  const signUp = React.useCallback(
    async (
      email: string,
      password: string,
      meta?: { role?: UserRole },
    ): Promise<AuthResult> => {
      const supabase = createClient();
      if (!supabase) {
        loginFake({ email, role: meta?.role });
        return { error: null };
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: meta?.role ?? "consumer",
          },
        },
      });
      return { error };
    },
    [loginFake],
  );

  /* ── Magic link ───── */
  const signInWithMagicLink = React.useCallback(
    async (email: string): Promise<AuthResult> => {
      const supabase = createClient();
      if (!supabase) {
        // Mock: auto-login after a tick
        loginFake({ email });
        return { error: null };
      }
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error };
    },
    [loginFake],
  );

  /* ── OAuth ───── */
  const signInWithOAuth = React.useCallback(
    async (provider: "google" | "apple"): Promise<AuthResult> => {
      const supabase = createClient();
      if (!supabase) {
        loginFake({ email: `user@${provider}.com` });
        return { error: null };
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error };
    },
    [loginFake],
  );

  /* ── Logout ───── */
  const logout = React.useCallback(() => {
    if (usingSupabase) {
      const supabase = createClient();
      supabase?.auth.signOut();
    }
    localStorage.removeItem(LS_KEY);
    setSession(null);
    setState({ status: "anon", user: null });
  }, [usingSupabase]);

  /* ── Update pro onboarding ───── */
  const updateProOnboarding = React.useCallback(
    (data: Partial<ProOnboardingData>) => {
      setState((prev) => {
        if (prev.status !== "authed") return prev;
        const updated: SessionUser = {
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

        // Also persist to Supabase user metadata if connected
        if (usingSupabase) {
          const supabase = createClient();
          supabase?.auth.updateUser({
            data: { pro_onboarding: updated.proOnboarding },
          });
        }

        return { status: "authed", user: updated };
      });
    },
    [usingSupabase],
  );

  /* ── Context value ───── */
  const value = React.useMemo<AuthContextValue>(
    () => ({
      state: state.status === "loading" ? { status: "anon", user: null } : state,
      loginFake,
      signIn,
      signUp,
      signInWithMagicLink,
      signInWithOAuth,
      logout,
      updateProOnboarding,
      isSupabase: usingSupabase,
      session,
    }),
    [state, loginFake, signIn, signUp, signInWithMagicLink, signInWithOAuth, logout, updateProOnboarding, usingSupabase, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
