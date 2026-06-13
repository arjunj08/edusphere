import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Profile, Role } from "@/services/auth";
import PageTransition from "@/components/app/PageTransition";

type Mode = "signup" | "login";

function destinationFor(profile: Profile) {
  if (profile.role === "faculty") return "/faculty";
  return profile.onboarded ? "/app/dashboard" : "/onboarding";
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm placeholder:text-ink-soft/50 focus:border-accent/40";

export default function AuthPage() {
  const { profile, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (profile) return <Navigate to={destinationFor(profile)} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const err =
      mode === "signup"
        ? await signUp({ name, email, password, role })
        : await signIn({ email, password });
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    // Read the fresh profile destination from the inputs we just submitted:
    // faculty go straight to triage, students onboard once.
    if (mode === "signup") {
      navigate(role === "faculty" ? "/faculty" : "/onboarding");
    }
    // On login the <Navigate> above takes over after profile state updates.
  };

  return (
    <PageTransition className="flex flex-col bg-paper">
      <header className="px-5 py-5">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight">
          EduSphere<span className="text-track">.</span>AI
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-16 pt-6">
        <div className="w-full max-w-md">
          <h1 className="text-center font-display text-3xl font-medium tracking-tight">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-center text-sm text-ink-soft">
            Live demo — data stays in your browser.
          </p>

          {/* Mode tabs */}
          <div
            role="tablist"
            aria-label="Sign up or log in"
            className="mx-auto mt-7 flex w-fit gap-1 rounded-full border border-line bg-white p-1"
          >
            {(["signup", "login"] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`relative rounded-full px-5 py-2 font-mono text-xs transition-colors ${
                  mode === m ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="auth-tab-pill"
                    className="absolute inset-0 rounded-full bg-paper shadow-sm ring-1 ring-line"
                    transition={{ type: "spring" as const, stiffness: 300, damping: 28 }}
                  />
                )}
                <span className="relative">
                  {m === "signup" ? "Sign up" : "Log in"}
                </span>
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-6 space-y-4 rounded-2xl border border-line bg-white p-6"
          >
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-ink-soft">
                  Name
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="A. Student"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-ink-soft">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@university.edu"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block font-mono text-xs text-ink-soft">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>

            {mode === "signup" && (
              <fieldset>
                <legend className="mb-1.5 block font-mono text-xs text-ink-soft">
                  I am a
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "student", label: "Student", icon: GraduationCap },
                      { value: "faculty", label: "Faculty", icon: Users },
                    ] as const
                  ).map((option) => {
                    const Icon = option.icon;
                    const selected = role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setRole(option.value)}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                          selected
                            ? "border-accent/40 bg-accent-soft text-accent"
                            : "border-line bg-white text-ink-soft hover:text-ink"
                        }`}
                      >
                        <Icon size={16} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {error && (
              <p role="alert" className="rounded-lg bg-risk-soft px-3 py-2 text-sm text-risk">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-ink py-3 text-sm font-medium text-paper disabled:opacity-60"
            >
              {busy
                ? "One moment…"
                : mode === "signup"
                  ? "Create account"
                  : "Log in"}
            </motion.button>
          </form>
        </div>
      </main>
    </PageTransition>
  );
}
