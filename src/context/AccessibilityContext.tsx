import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AccessibilityFlag, Track } from "@/services/auth";

/**
 * Adaptation flags STACK — e.g. captions + micro_learning both apply at once.
 * "Use standard experience" disables adaptations without deleting the profile.
 *
 * PRIVACY RULE: this context is consumed only by student-facing surfaces.
 * Leaderboard, Forum, Study Groups, and any faculty/shared surface must never
 * read accessibilityProfile or the Accommodation Passport. Faculty/counselor
 * views see risk signals only. Nothing here appears in leaderboards.
 */
interface AccessibilityContextValue {
  track: Track;
  /** Active flags after the standard-experience toggle is applied. */
  flags: AccessibilityFlag[];
  /** Saved flags regardless of the toggle (for the settings screen). */
  savedFlags: AccessibilityFlag[];
  useStandard: boolean;
  has: (flag: AccessibilityFlag) => boolean;
  // Derived convenience booleans (respect the standard-experience toggle).
  isAccessibility: boolean;
  isAudioFirst: boolean;
  isSimplified: boolean;
  isMicro: boolean;
  needsCaptions: boolean;
  signSupport: boolean;
  assistiveNav: boolean;
  setFlags: (flags: AccessibilityFlag[]) => Promise<void>;
  setTrack: (track: Track) => Promise<void>;
  setUseStandard: (value: boolean) => Promise<void>;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { profile, updateProfile } = useAuth();

  const value = useMemo<AccessibilityContextValue>(() => {
    const track = profile?.track ?? "standard";
    const savedFlags = profile?.accessibilityProfile ?? [];
    const useStandard = profile?.useStandardExperience ?? false;
    const flags = useStandard ? [] : savedFlags;
    const has = (flag: AccessibilityFlag) => flags.includes(flag);
    return {
      track,
      flags,
      savedFlags,
      useStandard,
      has,
      isAccessibility: track === "accessibility" && !useStandard,
      isAudioFirst: has("audio_first"),
      isSimplified: has("simplified_reading"),
      isMicro: has("micro_learning"),
      needsCaptions: has("captions"),
      signSupport: has("sign_support"),
      assistiveNav: has("assistive_nav"),
      setFlags: (next) => updateProfile({ accessibilityProfile: next }),
      setTrack: (next) => updateProfile({ track: next }),
      setUseStandard: (next) => updateProfile({ useStandardExperience: next }),
    };
  }, [profile, updateProfile]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx)
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
