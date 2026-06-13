import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";

export interface Submission {
  id: string;
  kind: "problem" | "daily" | "mock";
  problemId: string;
  title: string;
  score: number;
  points: number;
  createdAt: number;
}

interface ProgressState {
  points: number;
  solvedIds: string[];
  submissions: Submission[];
  streak: number;
  lastDaily: string | null; // YYYY-MM-DD
}

const EMPTY: ProgressState = {
  points: 0,
  solvedIds: [],
  submissions: [],
  streak: 0,
  lastDaily: null,
};

interface ProgressContextValue extends ProgressState {
  isSolved: (id: string) => boolean;
  /** Records a problem solve. First solve of an id awards points; re-solves
   *  keep the best score but don't double-award. Returns points granted. */
  recordSolve: (input: {
    kind: Submission["kind"];
    problemId: string;
    title: string;
    score: number;
    points: number;
  }) => number;
  recordDaily: (input: { problemId: string; title: string; score: number; points: number }) => number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const keyFor = (userId: string) => `edusphere.progress.${userId}`;
const today = () => new Date().toISOString().slice(0, 10);

function load(userId: string): ProgressState {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const userId = profile?.id ?? null;
  const [state, setState] = useState<ProgressState>(EMPTY);

  useEffect(() => {
    setState(userId ? load(userId) : EMPTY);
  }, [userId]);

  const persist = useCallback(
    (next: ProgressState) => {
      setState(next);
      if (userId) localStorage.setItem(keyFor(userId), JSON.stringify(next));
    },
    [userId]
  );

  const recordSolve = useCallback<ProgressContextValue["recordSolve"]>(
    ({ kind, problemId, title, score, points }) => {
      const already = state.solvedIds.includes(problemId);
      const granted = already ? 0 : points;
      const submission: Submission = {
        id: crypto.randomUUID(),
        kind,
        problemId,
        title,
        score,
        points: granted,
        createdAt: Date.now(),
      };
      persist({
        ...state,
        points: state.points + granted,
        solvedIds: already ? state.solvedIds : [...state.solvedIds, problemId],
        submissions: [submission, ...state.submissions].slice(0, 40),
      });
      return granted;
    },
    [state, persist]
  );

  const recordDaily = useCallback<ProgressContextValue["recordDaily"]>(
    ({ problemId, title, score, points }) => {
      const day = today();
      const doneToday = state.lastDaily === day;
      const granted = doneToday ? 0 : points;
      // Continue the streak if the last completion was yesterday; otherwise reset to 1.
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const nextStreak = doneToday
        ? state.streak
        : state.lastDaily === yesterday
          ? state.streak + 1
          : 1;
      const submission: Submission = {
        id: crypto.randomUUID(),
        kind: "daily",
        problemId,
        title,
        score,
        points: granted,
        createdAt: Date.now(),
      };
      persist({
        ...state,
        points: state.points + granted,
        streak: nextStreak,
        lastDaily: day,
        submissions: [submission, ...state.submissions].slice(0, 40),
      });
      return granted;
    },
    [state, persist]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      ...state,
      isSolved: (id) => state.solvedIds.includes(id),
      recordSolve,
      recordDaily,
    }),
    [state, recordSolve, recordDaily]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
