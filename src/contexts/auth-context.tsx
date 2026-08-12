"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { provisionPatientAccount } from "@/lib/account.functions";
import type { Role, SessionUser } from "@/types";

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<{ ok: boolean; error?: string; field?: "email" }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function buildSessionUser(session: Session): Promise<SessionUser> {
  const authUser = session.user;
  const metaName = (authUser.user_metadata?.["name"] as string | undefined) ?? "";

  const [{ data: roleRows }, { data: profile }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", authUser.id),
    supabase.from("profiles").select("name").eq("id", authUser.id).maybeSingle(),
  ]);

  const roles = (roleRows ?? []).map((r) => r.role as Role);
  const role: Role = roles.includes("ADMIN")
    ? "ADMIN"
    : roles.includes("DOCTOR")
      ? "DOCTOR"
      : "PATIENT";

  let profileId = authUser.id;
  if (role === "DOCTOR") {
    const { data } = await supabase
      .from("doctors")
      .select("id")
      .eq("user_id", authUser.id)
      .maybeSingle();
    profileId = data?.id ?? "";
  } else if (role === "PATIENT") {
    const { data } = await supabase
      .from("patients")
      .select("id")
      .eq("user_id", authUser.id)
      .maybeSingle();
    profileId = data?.id ?? "";
  }

  return {
    id: authUser.id,
    name: profile?.name || metaName || (authUser.email ?? ""),
    email: authUser.email ?? "",
    role,
    profileId,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async (session: Session | null) => {
    if (!session) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setUser(await buildSessionUser(session));
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "TOKEN_REFRESHED") return;
      void hydrate(session);
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (active) void hydrate(data.session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrate]);

  const login = useCallback<AuthContextValue["login"]>(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { ok: false, error: error.message };
    await hydrate(data.session);
    return { ok: true };
  }, [hydrate]);

  const register = useCallback<AuthContextValue["register"]>(
    async (input) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { name: input.name, phone: input.phone },
        },
      });
      if (error) {
        const field = /registered|exists/i.test(error.message)
          ? ("email" as const)
          : undefined;
        return { ok: false, error: error.message, ...(field ? { field } : {}) };
      }
      if (!data.session) {
        return {
          ok: false,
          error: "Check your email to confirm your account, then sign in.",
        };
      }
      await provisionPatientAccount({ name: input.name, phone: input.phone });
      await hydrate(data.session);
      return { ok: true };
    },
    [hydrate],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function dashboardPath(role: Role) {
  if (role === "ADMIN") return "/admin";
  if (role === "DOCTOR") return "/doctor";
  return "/patient";
}
