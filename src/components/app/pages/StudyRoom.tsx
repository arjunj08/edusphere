import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Copy, LogOut, Mic, Radio, Send, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { ROOM_PARTICIPANTS, STUDY_GROUPS } from "@/services/mockData";

/** A live study room. Reached by joining a group or entering a room code. */
export default function StudyRoom() {
  const { roomId = "" } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const youName = profile?.name?.split(" ")[0]?.toLowerCase() || "you";

  const group = STUDY_GROUPS.find((g) => g.code === roomId);
  const topic = group?.focus ?? "Open study session";

  const [seconds, setSeconds] = useState(0);
  const [messages, setMessages] = useState<{ who: string; text: string }[]>([
    { who: "kestrel", text: "hey! starting with tree traversals today" },
    { who: "n_iyer", text: "perfect, I had a question on BFS vs DFS" },
  ]);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camError, setCamError] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Stop the camera when leaving the room.
  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const toggleCam = async () => {
    if (camOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCamOn(false);
      return;
    }
    setCamError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      setCamOn(true);
      // Attach after the tile renders.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setCamError(true);
    }
  };

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight });
  }, [messages]);

  const participants = useMemo(
    () => [{ name: youName, role: "You" }, ...ROOM_PARTICIPANTS],
    [youName]
  );

  const clock = `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { who: youName, text }]);
    setDraft("");
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(roomId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/app/groups" className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink">
            <ArrowLeft size={15} /> Study groups
          </Link>
          <h1 className="mt-2 font-display text-2xl font-medium tracking-tight">
            {group?.name ?? "Study room"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{topic}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-risk-soft px-3 py-1.5 font-mono text-xs font-medium text-risk">
            <Radio size={12} /> Live · {clock}
          </span>
          <button onClick={copyCode} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 font-mono text-xs text-ink-soft hover:text-ink">
            <Copy size={12} /> {copied ? "Copied!" : roomId}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main stage */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {participants.map((p) => {
                const isYou = p.role === "You";
                return (
                  <div key={p.name} className="flex flex-col items-center rounded-xl border border-line bg-paper p-4">
                    {isYou && camOn ? (
                      <video ref={videoRef} muted playsInline className="h-12 w-12 -scale-x-100 rounded-full object-cover" />
                    ) : (
                      <span className={cn("flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-medium", isYou ? "bg-accent text-white" : "bg-[#EDEBE3] text-ink")}>
                        {p.name[0].toUpperCase()}
                      </span>
                    )}
                    <span className="mt-2 truncate font-mono text-[11px]">{p.name}</span>
                    <span className="font-mono text-[10px] text-ink-soft">
                      {isYou && camOn ? "Camera on" : p.role}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMicOn((m) => !m)}
                className={cn("flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors", micOn ? "bg-ink text-paper" : "border border-line hover:bg-paper")}
              >
                <Mic size={14} /> Mic {micOn ? "on" : "off"}
              </button>
              <button
                onClick={toggleCam}
                className={cn("flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors", camOn ? "bg-ink text-paper" : "border border-line hover:bg-paper")}
              >
                <Video size={14} /> Camera {camOn ? "on" : "off"}
              </button>
              {camError && <span className="font-mono text-[11px] text-risk">Camera blocked — allow access in your browser.</span>}
              <button
                onClick={() => navigate("/app/groups")}
                className="ml-auto flex items-center gap-1.5 rounded-full bg-risk px-4 py-2 text-sm font-medium text-white"
              >
                <LogOut size={14} /> Leave room
              </button>
            </div>
          </div>

          {/* Shared notes */}
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">Shared notes</p>
            <textarea
              rows={5}
              defaultValue={"# " + topic + "\n- "}
              className="mt-2 w-full resize-y rounded-xl border border-line bg-paper p-3 font-mono text-[13px] leading-relaxed focus:border-accent/40"
            />
            <p className="mt-1.5 font-mono text-[10px] text-ink-soft">Notes are shared with everyone in the room.</p>
          </div>
        </div>

        {/* Chat */}
        <aside className="flex h-[28rem] flex-col rounded-2xl border border-line bg-white">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <Users size={15} className="text-accent" />
            <span className="text-sm font-medium">Room chat</span>
            <span className="ml-auto font-mono text-[11px] text-ink-soft">{participants.length} here</span>
          </div>
          <div ref={feedRef} className="flex-1 space-y-2.5 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("max-w-[85%]", m.who === youName && "ml-auto")}>
                <p className="font-mono text-[10px] text-ink-soft">{m.who === youName ? "you" : m.who}</p>
                <p className={cn("mt-0.5 rounded-2xl px-3 py-2 text-sm", m.who === youName ? "rounded-tr-sm bg-ink text-paper" : "rounded-tl-sm border border-line bg-paper")}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message the room…"
              className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-2 text-sm"
            />
            <button type="submit" aria-label="Send" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
              <Send size={15} />
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
