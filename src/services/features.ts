import {
  Award,
  BookOpen,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  Map,
  MessageSquare,
  FileSearch,
  Handshake,
  Mic,
  Settings2,
  Target,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react";

export interface FeatureRoute {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** The 14 platform features, all available on both tracks. */
export const FEATURES: FeatureRoute[] = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/problems", label: "Problem Bank", icon: BookOpen },
  { to: "/app/daily", label: "Daily Challenge", icon: Zap },
  { to: "/app/interview", label: "Mock Interview", icon: Mic },
  { to: "/app/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/app/forum", label: "Forum", icon: MessageSquare },
  { to: "/app/groups", label: "Study Groups", icon: Users },
  { to: "/app/skills", label: "Skill Report", icon: ClipboardList },
  { to: "/app/readiness", label: "Job Readiness", icon: Briefcase },
  { to: "/app/certifications", label: "Certifications", icon: Award },
  { to: "/app/assignments", label: "Assignments", icon: CalendarCheck },
  { to: "/app/roadmap", label: "Roadmap", icon: Map },
  { to: "/app/profile", label: "My Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings2 },
];

/** Standout "placement edge" features, shown as a second nav group. */
export const EDGE_FEATURES: FeatureRoute[] = [
  { to: "/twin", label: "Placement Twin", icon: Users },
  { to: "/jobs/gap", label: "Reverse Match", icon: Target },
  { to: "/negotiate", label: "Negotiation Sim", icon: Handshake },
  { to: "/resume/recruiter-view", label: "Recruiter View", icon: FileSearch },
];
