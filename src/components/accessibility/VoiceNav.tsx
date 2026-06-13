import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { speak } from "@/lib/speech";

/**
 * R3-A Voice-First Navigation (audio_first / assistive_nav).
 * Web Speech API command listener with graceful fallback when unavailable.
 * Commands: "open my weakest topic", "start a mock", "read this aloud",
 * plus "dashboard / problems / leaderboard".
 */

// SpeechRecognition isn't in TS DOM libs; declare a minimal shape.
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export default function VoiceNav() {
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase().trim();
      setHeard(text);
      handle(text);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handle = (text: string) => {
    if (text.includes("weak")) {
      speak("Opening your weakest topic in the skill report.");
      navigate("/app/skills");
    } else if (text.includes("mock") || text.includes("interview")) {
      speak("Starting a mock interview.");
      navigate("/app/interview");
    } else if (text.includes("problem")) {
      navigate("/app/problems");
    } else if (text.includes("leaderboard")) {
      navigate("/app/leaderboard");
    } else if (text.includes("dashboard") || text.includes("home")) {
      navigate("/app/dashboard");
    } else if (text.includes("read")) {
      const main = document.querySelector("h1");
      speak(main?.textContent || "Nothing to read here.");
    } else {
      speak("Sorry, I didn't catch a command I know.");
    }
  };

  const toggle = () => {
    if (!supported || !recRef.current) return;
    if (listening) {
      recRef.current.stop();
      setListening(false);
    } else {
      setHeard("");
      recRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="fixed bottom-20 right-5 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {(listening || heard) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-[16rem] rounded-2xl border border-line bg-white px-4 py-2.5 text-sm shadow-sm"
          >
            {listening ? (
              <span className="font-mono text-xs text-accent">Listening… try "start a mock"</span>
            ) : (
              <span className="text-ink-soft">Heard: "{heard}"</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={toggle}
        disabled={!supported}
        aria-pressed={listening}
        aria-label={supported ? "Voice navigation" : "Voice navigation unavailable in this browser"}
        title={supported ? "Voice commands" : "Voice not supported in this browser"}
        className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_12px_28px_-10px_rgba(83,74,183,0.55)] ${
          listening ? "bg-risk" : supported ? "bg-accent" : "bg-line"
        }`}
      >
        {supported ? <Mic size={18} /> : <MicOff size={18} />}
      </button>
    </div>
  );
}
