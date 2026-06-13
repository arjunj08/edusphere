import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as auth from "@/services/auth";
import type { Profile, Role } from "@/services/auth";

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<string | null>;
  signIn: (input: { email: string; password: string }) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (
    patch: Partial<Omit<Profile, "id" | "email">>
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.getProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const signUp: AuthContextValue["signUp"] = useCallback(async (input) => {
    const { data, error } = await auth.signUp(input);
    if (data) setProfile(data);
    return error;
  }, []);

  const signIn: AuthContextValue["signIn"] = useCallback(async (input) => {
    const { data, error } = await auth.signIn(input);
    if (data) setProfile(data);
    return error;
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setProfile(null);
  }, []);

  const updateProfile: AuthContextValue["updateProfile"] = useCallback(
    async (patch) => {
      const { data } = await auth.updateProfile(patch);
      if (data) setProfile(data);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{ profile, loading, signUp, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
