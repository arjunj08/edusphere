import { useState } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { FORUM_THREADS } from "@/services/mockData";
import { speak } from "@/lib/speech";
import PageHeading from "@/components/app/PageHeading";

interface Thread {
  id: string;
  title: string;
  author: string;
  replies: number;
  summary: string;
  body: string;
}

/**
 * PRIVACY: posts show handles only. No accessibility profile is ever attached
 * to a user in the forum.
 */
export default function Forum() {
  const { isSimplified, isAudioFirst } = useAccessibility();
  const { profile } = useAuth();
  const [threads, setThreads] = useState<Thread[]>(FORUM_THREADS);
  const [draft, setDraft] = useState("");

  const post = () => {
    const text = draft.trim();
    if (!text) return;
    const title = text.length > 70 ? text.slice(0, 70) + "…" : text;
    setThreads((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        author: profile?.name?.split(" ")[0]?.toLowerCase() || "you",
        replies: 0,
        summary: text,
        body: text,
      },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <div className={cn(isSimplified && "simplified")}>
      <PageHeading
        eyebrow="Community"
        title="Forum"
        summary="Ask questions, help others, learn in public. AI summarizes long threads."
        narration="Forum. Ask questions and help others. The AI summarizes long threads for you."
      />

      <div className="space-y-3">
        {threads.map((thread) => (
          <article key={thread.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-medium">{thread.title}</h2>
              {isAudioFirst && (
                <button
                  onClick={() => speak(`${thread.title}. ${thread.body}`)}
                  aria-label={`Read aloud: ${thread.title}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft hover:text-ink"
                >
                  <Volume2 size={15} />
                </button>
              )}
            </div>
            <p className="mt-1 font-mono text-[11px] text-ink-soft">
              {thread.author} · {thread.replies} replies
            </p>

            {isSimplified ? (
              <p className="mt-3 rounded-xl border border-accent/20 bg-accent-soft p-3 text-[15px] leading-relaxed">
                <span className="font-mono text-[11px] uppercase tracking-wider text-accent">Thread summary · </span>
                {thread.summary}
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{thread.body}</p>
            )}
          </article>
        ))}
      </div>

      {/* simplified composer */}
      <div className="mt-5 rounded-2xl border border-line bg-white p-5">
        <label htmlFor="post" className="mb-1.5 block font-mono text-xs text-ink-soft">
          {isSimplified ? "Ask in a sentence" : "Start a thread"}
        </label>
        <textarea
          id="post"
          rows={isSimplified ? 2 : 3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What do you want to ask?"
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm"
        />
        <button
          onClick={post}
          disabled={!draft.trim()}
          className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  );
}
