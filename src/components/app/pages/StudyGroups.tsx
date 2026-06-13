import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DoorOpen, Plus, Radio, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDY_GROUPS } from "@/services/mockData";
import PageHeading from "@/components/app/PageHeading";

/**
 * PRIVACY: groups list focus, cadence, and a room code only. Accessibility
 * status is never exposed to other members.
 */
function makeCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const r = (n: number) => Array.from({ length: n }, () => a[Math.floor(Math.random() * a.length)]).join("");
  return `ROOM-${r(4)}`;
}

export default function StudyGroups() {
  const navigate = useNavigate();
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  const [enterCode, setEnterCode] = useState("");

  const join = (code: string) => {
    setJoined((j) => ({ ...j, [code]: true }));
    navigate(`/app/groups/${code}`);
  };

  const enterRoom = (e: FormEvent) => {
    e.preventDefault();
    const code = enterCode.trim().toUpperCase();
    if (code) navigate(`/app/groups/${code}`);
  };

  return (
    <div>
      <PageHeading
        eyebrow="Together"
        title="Study Groups"
        summary="Join a live room that matches your focus, or spin up your own and share the code."
        narration="Study groups. Join a live room that matches your focus, or create your own and share the code."
      >
        <button
          onClick={() => navigate(`/app/groups/${makeCode()}`)}
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper"
        >
          <Plus size={15} /> Create a room
        </button>
      </PageHeading>

      {/* Enter by code */}
      <form onSubmit={enterRoom} className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-4">
        <DoorOpen size={18} className="text-accent" />
        <span className="text-sm font-medium">Have a room code?</span>
        <input
          value={enterCode}
          onChange={(e) => setEnterCode(e.target.value)}
          placeholder="e.g. DSA-7F3K"
          className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2 font-mono text-sm uppercase placeholder:normal-case sm:max-w-xs"
        />
        <button type="submit" disabled={!enterCode.trim()} className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-paper disabled:opacity-50">
          Enter room
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STUDY_GROUPS.map((group) => (
          <article key={group.id} className="flex flex-col rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-track-soft">
                <Users size={18} className="text-track" />
              </span>
              {group.live && (
                <span className="flex items-center gap-1.5 rounded-full bg-risk-soft px-2.5 py-1 font-mono text-[10px] font-medium text-risk">
                  <Radio size={10} /> Live now
                </span>
              )}
            </div>
            <h2 className="mt-4 font-display text-lg font-medium">{group.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">{group.focus}</p>
            <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-ink-soft">
              <span>{group.members + (joined[group.code] ? 1 : 0)} members</span>
              <span>{group.cadence}</span>
            </div>
            <div className="mt-2 font-mono text-[10px] text-ink-soft">Room {group.code}</div>
            <button
              onClick={() => join(group.code)}
              className={cn(
                "mt-4 flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                joined[group.code] ? "bg-track-soft text-track" : "bg-ink text-paper"
              )}
            >
              {joined[group.code] ? "Re-enter room" : "Join room"} <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
