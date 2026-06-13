import { useMemo } from "react";
import { motion } from "framer-motion";
import { Crown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { LEADERBOARD_SEED } from "@/services/mockData";
import TiltCard from "@/components/ui/tilt-card";
import PageHeading from "@/components/app/PageHeading";

/**
 * PRIVACY: ranks on points only. Never reads or shows any accessibility
 * profile, track, or accommodation — those are private to the student.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const PODIUM_COLOR = ["#EF9F27", "#9FB0C3", "#C58B5C"]; // gold / silver / bronze

export default function Leaderboard() {
  const { profile } = useAuth();
  const { points } = useProgress();

  const ranked = useMemo(() => {
    const you = { handle: profile?.name?.split(" ")[0]?.toLowerCase() || "you", points, you: true };
    return [...LEADERBOARD_SEED.map((s) => ({ ...s, you: false })), you]
      .sort((a, b) => b.points - a.points)
      .map((row, i) => ({ ...row, rank: i + 1 }));
  }, [points, profile]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);
  const yourRank = ranked.find((r) => r.you)?.rank ?? ranked.length;

  return (
    <div>
      <PageHeading
        eyebrow="This week"
        title="Leaderboard"
        summary="Ranked by points from problems, daily challenges, and mocks. Solve something and watch yourself climb — live."
        narration="Leaderboard. Ranked by points. Solve a problem to climb in real time."
      >
        <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 font-mono text-xs font-medium text-accent">
          <TrendingUp size={13} /> You're #{yourRank} · {points} pts
        </span>
      </PageHeading>

      {/* 3D podium */}
      <div className="mb-7 grid grid-cols-3 gap-3 sm:gap-5">
        {top3.map((row, i) => (
          <TiltCard
            key={row.handle}
            max={10}
            selected={row.you}
            className={cn("flex flex-col items-center p-5", i === 0 && "sm:-mt-3")}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-medium text-white"
              style={{ backgroundColor: PODIUM_COLOR[i] }}
            >
              {i === 0 ? <Crown size={20} /> : row.rank}
            </span>
            <p className={cn("mt-3 truncate font-medium", row.you && "text-accent")}>
              {row.handle}
              {row.you && <span className="ml-1 font-mono text-[10px]">you</span>}
            </p>
            <motion.p
              key={row.points}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-1 font-mono text-sm text-ink-soft"
            >
              {row.points.toLocaleString()} pts
            </motion.p>
          </TiltCard>
        ))}
      </div>

      {/* The rest */}
      <ul className="space-y-2">
        {rest.map((row) => (
          <li
            key={row.handle}
            className={cn(
              "flex items-center justify-between rounded-2xl border bg-white px-5 py-4",
              row.you ? "border-accent/40 bg-accent-soft" : "border-line"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="w-6 font-mono text-sm text-ink-soft">#{row.rank}</span>
              <span className={cn("font-medium", row.you && "text-accent")}>
                {row.handle}
                {row.you && <span className="ml-2 font-mono text-[11px]">you</span>}
              </span>
            </div>
            <span className="font-mono text-sm text-ink-soft">{row.points.toLocaleString()} pts</span>
          </li>
        ))}
      </ul>

      {points === 0 && (
        <p className="mt-5 rounded-xl border border-line bg-paper p-4 text-sm text-ink-soft">
          You're on the board at 0 points. Head to the{" "}
          <span className="font-medium text-ink">Problem Bank</span> or{" "}
          <span className="font-medium text-ink">Daily Challenge</span>, submit a solution, and your rank updates instantly.
        </p>
      )}
    </div>
  );
}
