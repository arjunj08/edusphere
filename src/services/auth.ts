// localStorage-backed mock auth, shaped like the Supabase client API so the
// real backend can be swapped in behind these functions without touching UI.

export type Role = "student" | "faculty" | "guardian";

export type Track = "standard" | "accessibility";

export type AccessibilityFlag =
  | "audio_first"
  | "captions"
  | "simplified_reading"
  | "micro_learning"
  | "sign_support"
  | "assistive_nav";

/** A single accommodation the student owns. Shared only with explicit consent. */
export interface Accommodation {
  id: string;
  label: string;
  detail: string;
  shared: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Which onboarding path the student chose. */
  track: Track;
  /** Private learning preferences. Visible only to the student (and their
   *  counselor in the real build) — never to faculty, leaderboards, or any
   *  shared surface. */
  accessibilityProfile: AccessibilityFlag[];
  /** Student-owned accommodation passport. Nothing here is shared unless the
   *  student opts in per item (Accommodation.shared). */
  passport: Accommodation[];
  onboarded: boolean;
  useStandardExperience: boolean;
}

export const DEFAULT_PASSPORT: Accommodation[] = [
  {
    id: "a1",
    label: "Extended time on timed work",
    detail: "+50% on assignments and exams",
    shared: false,
  },
  {
    id: "a2",
    label: "Captions on all media",
    detail: "Auto-enable captions and transcripts",
    shared: false,
  },
  {
    id: "a3",
    label: "Preferred content format",
    detail: "Deliver new material as audio + plain-language first",
    shared: false,
  },
];

interface StoredUser {
  profile: Profile;
  password: string;
}

type AuthResult = { data: Profile | null; error: string | null };

const USERS_KEY = "edusphere.users";
const SESSION_KEY = "edusphere.session";

function readUsers(): Record<string, StoredUser> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const users = readUsers();
  if (users[email]) {
    return { data: null, error: "An account with this email already exists." };
  }
  const profile: Profile = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    role: input.role,
    track: "standard",
    accessibilityProfile: [],
    passport: DEFAULT_PASSPORT.map((a) => ({ ...a })),
    // Only students go through onboarding; faculty and guardians land directly.
    onboarded: input.role !== "student",
    useStandardExperience: false,
  };
  users[email] = { profile, password: input.password };
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, email);
  return { data: profile, error: null };
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  const user = readUsers()[email];
  if (!user || user.password !== input.password) {
    return { data: null, error: "Invalid email or password." };
  }
  localStorage.setItem(SESSION_KEY, email);
  return { data: user.profile, error: null };
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(SESSION_KEY);
}

/** Backfill fields added after a profile was first stored. */
function normalize(profile: Profile): Profile {
  return {
    ...profile,
    track: profile.track ?? "standard",
    accessibilityProfile: profile.accessibilityProfile ?? [],
    passport: profile.passport ?? DEFAULT_PASSPORT.map((a) => ({ ...a })),
    useStandardExperience: profile.useStandardExperience ?? false,
  };
}

export async function getProfile(): Promise<Profile | null> {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  const profile = readUsers()[email]?.profile;
  return profile ? normalize(profile) : null;
}

export async function updateProfile(
  patch: Partial<Omit<Profile, "id" | "email">>
): Promise<AuthResult> {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return { data: null, error: "Not signed in." };
  const users = readUsers();
  const user = users[email];
  if (!user) return { data: null, error: "Account not found." };
  user.profile = { ...user.profile, ...patch };
  writeUsers(users);
  return { data: user.profile, error: null };
}
