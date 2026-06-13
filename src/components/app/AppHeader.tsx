import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AppHeader() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight">
          EduSphere<span className="text-track">.</span>AI
        </Link>
        <div className="flex items-center gap-4">
          {profile?.role === "student" && (
            <Link
              to="/settings"
              className="flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              <Settings2 size={15} />
              <span className="hidden sm:inline">Learning settings</span>
            </Link>
          )}
          <button
            onClick={async () => {
              await signOut();
              navigate("/auth");
            }}
            className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
