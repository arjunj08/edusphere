// Demo data + small localStorage persistence helpers for the working demo.
// Shaped so a real API (Supabase/FastAPI) can replace it behind this module.

export type Zone = "red" | "amber" | "green";

export const ZONE_STYLES: Record<
  Zone,
  { label: string; color: string; bg: string; pill: string }
> = {
  red: { label: "Red", color: "#E24B4A", bg: "#FCEBEB", pill: "bg-risk-soft text-risk" },
  amber: { label: "Amber", color: "#EF9F27", bg: "#FAEEDA", pill: "bg-watch-soft text-watch" },
  green: { label: "Green", color: "#1D9E75", bg: "#E1F5EE", pill: "bg-track-soft text-track" },
};

// ---------- Student dashboard ----------

export interface Skill {
  label: string;
  pct: number;
  zone: Zone;
  note?: string;
}

export const STUDENT = {
  readiness: 78,
  readinessLabel: "Internship ready",
  target: "ML Engineer",
  riskZone: "green" as Zone,
  riskLabel: "On track",
  // Plain-language wellbeing/progress signals — also surfaced (read-only) to a
  // consenting parent/guardian. Never raw surveillance, never exact per-test grades.
  attendancePct: 92,
  assignmentsOnTime: 4,
  assignmentsTotal: 5,
  streakDays: 6,
  skills: [
    { label: "DSA progress", pct: 82, zone: "green" },
    { label: "Mock interviews", pct: 64, zone: "amber" },
    { label: "Resume quality", pct: 88, zone: "green" },
    { label: "Projects", pct: 71, zone: "amber" },
    {
      label: "System design",
      pct: 45,
      zone: "red",
      note: "← biggest gap vs. ML Engineer requirements",
    },
  ] as Skill[],
  plan: [
    { id: "p1", day: "Mon–Wed", text: "3 system design problems (graded)" },
    { id: "p2", day: "Thu", text: "1 mock interview — system design round" },
    { id: "p3", day: "Sun", text: "auto re-score → projected 84/100" },
  ],
  interview: {
    title: "Mock interview #7 · SDE-1 · 32 min",
    score: 72,
    dims: [
      { label: "Code correctness", pct: 81, zone: "green" as Zone },
      { label: "Communication", pct: 58, zone: "amber" as Zone },
      { label: "Approach & structure", pct: 76, zone: "green" as Zone },
      { label: "Edge-case handling", pct: 64, zone: "amber" as Zone },
    ],
    feedback:
      "Strong solution, weak narration — you went silent for 4 minutes while coding. Practice thinking aloud: explain your approach BEFORE writing.",
    next: "Next mock scheduled · Tuesday 6 PM",
  },
};

/** Student skill vector (0–100) used by Placement Twin + Reverse Match. */
export const STUDENT_VECTOR = {
  dsa: 82,
  mock: 64,
  resume: 88,
  projects: 71,
  systemDesign: 45,
};

export const MENTOR_EXCHANGES = [
  {
    q: "Why is binary search O(log n)?",
    a: "Each comparison halves the search space: 1000 → 500 → 250 → 125… You can only halve n about log₂(n) times before one element remains. Want a 3-question quiz on this?",
  },
  {
    q: "When should I use a heap instead of sorting?",
    a: "When you only need the top-k elements or a running min/max. A heap gives you the extremes in O(log n) per operation without paying O(n log n) to order everything — exactly the trade-off in Unit 4's priority scheduling example.",
  },
  {
    q: "What's the difference between BFS and DFS for shortest paths?",
    a: "On unweighted graphs BFS explores level by level, so the first time it reaches a node is via a shortest path. DFS dives deep and can find a much longer route first. Your Unit 3 slides cover this under 'graph traversal order'.",
  },
];

// ---------- Faculty dashboard ----------

export interface TriageRow {
  id: string;
  name: string;
  zone: Zone;
  risk: number;
  signal: string;
  action: string;
  approve?: boolean;
  muted?: boolean;
  signals: { label: string; weight: number }[];
}

export const FACULTY_ROWS: TriageRow[] = [
  {
    id: "s1",
    name: "R. Sharma",
    zone: "red",
    risk: 82,
    signal: "Attendance −38% in 3 wks",
    action: "Approve intervention →",
    approve: true,
    signals: [
      { label: "Attendance −38% in 3 wks", weight: 0.41 },
      { label: "Submission latency +2.4 days avg", weight: 0.33 },
      { label: "LMS activity −52% vs cohort", weight: 0.19 },
    ],
  },
  {
    id: "s2",
    name: "P. Reddy",
    zone: "amber",
    risk: 58,
    signal: "2 missed submissions",
    action: "Schedule mock →",
    signals: [
      { label: "2 missed submissions", weight: 0.38 },
      { label: "Quiz scores −9% trend", weight: 0.27 },
      { label: "Forum activity −31%", weight: 0.16 },
    ],
  },
  {
    id: "s3",
    name: "K. Iyer",
    zone: "amber",
    risk: 51,
    signal: "Quiz scores −15%",
    action: "Assign DSA set →",
    signals: [
      { label: "Quiz scores −15%", weight: 0.36 },
      { label: "Late submissions ×3 this month", weight: 0.24 },
      { label: "Attendance −8%", weight: 0.14 },
    ],
  },
  {
    id: "s4",
    name: "S. Khan",
    zone: "green",
    risk: 18,
    signal: "On track",
    action: "Monitoring",
    muted: true,
    signals: [
      { label: "All submissions on time", weight: 0.12 },
      { label: "Attendance steady at 91%", weight: 0.08 },
      { label: "Quiz scores +4% trend", weight: 0.05 },
    ],
  },
];

export const INTERVENTION_DRAFT = {
  student: "R. Sharma",
  plan: [
    "Personalized study plan: 2 weeks, focus on Unit 3 (graphs) where quiz scores dropped",
    "Mock interview slot: Thursday 5 PM — technical round, recorded feedback",
    "Mentor pairing: A. Verma (4th year, same elective track) — first session Saturday",
  ],
  note: "Faculty approval sends all three actions and notifies the student. Outcome re-scored in 2 weeks.",
};

export const LEADERSHIP_TILES = [
  { label: "Cohort health", value: 81, suffix: "/100", zone: "green" as Zone },
  { label: "Students in red zone", value: 12, suffix: "", zone: "red" as Zone },
  { label: "Interventions active", value: 27, suffix: "", zone: "indigo" as const },
  { label: "Projected placement rate", value: 71, suffix: "%", zone: "amber" as Zone },
];

// ---------- Persistence helpers ----------

// ---------- Platform feature content ----------

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tag: string;
  summary: string;
  prompt: string;
  hints: string[];
  starter: string;
}

export const PROBLEMS: Problem[] = [
  {
    id: "p-bst",
    title: "Validate a Binary Search Tree",
    difficulty: "Medium",
    tag: "Trees",
    summary: "Check the middle, go left if smaller, right if larger.",
    prompt:
      "Given the root of a binary tree, return true if it is a valid binary search tree (every left node smaller, every right node larger, for the whole subtree).",
    hints: ["left", "right", "min", "max", "node"],
    starter:
      "def is_valid_bst(root, low=float('-inf'), high=float('inf')):\n    # your approach here\n    return True",
  },
  {
    id: "p-2sum",
    title: "Two Sum",
    difficulty: "Easy",
    tag: "Hashing",
    summary: "Store what you've seen; look for the complement.",
    prompt:
      "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
    hints: ["hash", "map", "complement", "seen", "return"],
    starter:
      "def two_sum(nums, target):\n    seen = {}\n    # your approach here\n    return []",
  },
  {
    id: "p-lru",
    title: "LRU Cache",
    difficulty: "Hard",
    tag: "Design",
    summary: "A map plus a doubly linked list keeps recent items fast.",
    prompt:
      "Design a cache with get(key) and put(key, value) in O(1). When it exceeds capacity, evict the least recently used item.",
    hints: ["map", "linked", "recent", "capacity", "evict"],
    starter:
      "class LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        # your approach here\n",
  },
  {
    id: "p-merge",
    title: "Merge Intervals",
    difficulty: "Medium",
    tag: "Sorting",
    summary: "Sort by start, then fold overlapping ranges together.",
    prompt:
      "Given a list of intervals, merge all overlapping intervals and return the non-overlapping result.",
    hints: ["sort", "start", "end", "overlap", "merge"],
    starter:
      "def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    # your approach here\n    return []",
  },
];

export const DAILY_PROBLEM = {
  id: "daily-rev-k",
  title: "Reverse a linked list in groups of k",
  difficulty: "Medium" as const,
  prompt:
    "Given the head of a linked list, reverse the nodes k at a time and return the modified list. Nodes left over at the end stay as-is.",
  hints: ["reverse", "k", "group", "next", "node"],
  starter:
    "def reverse_k_group(head, k):\n    # count k nodes, reverse the block, recurse on the rest\n    return head",
};

/** Seeded competitors. The signed-in student's live points are merged in and
 *  the whole board is re-ranked, so solving problems moves you up in realtime. */
export const LEADERBOARD_SEED = [
  { handle: "kestrel", points: 980 },
  { handle: "n_iyer", points: 845 },
  { handle: "byteme", points: 690 },
  { handle: "p_reddy", points: 540 },
  { handle: "arc_dev", points: 410 },
  { handle: "lambda_li", points: 300 },
  { handle: "z3ro_cool", points: 180 },
];

export const FORUM_THREADS = [
  {
    id: "t1",
    title: "Why does quicksort degrade to O(n²)?",
    author: "kestrel",
    replies: 12,
    summary: "Already-sorted input + a bad pivot means each partition removes only one element.",
    body: "I keep seeing quicksort described as O(n log n) but my benchmark on sorted data was way slower. What's going on, and how do people fix it in practice with pivot selection?",
  },
  {
    id: "t2",
    title: "Resume: how many projects is enough?",
    author: "byteme",
    replies: 7,
    summary: "Two or three deep projects beat a long list of shallow ones.",
    body: "Recruiters keep saying 'depth over breadth' — does that mean I should cut my smaller projects entirely, or just move them lower?",
  },
];

export interface StudyGroup {
  id: string;
  name: string;
  members: number;
  focus: string;
  cadence: string;
  code: string;
  live: boolean;
}

export const STUDY_GROUPS: StudyGroup[] = [
  { id: "g1", name: "DSA dawn club", members: 8, focus: "Trees & graphs", cadence: "Mon/Thu 7 AM", code: "DSA-7F3K", live: true },
  { id: "g2", name: "System design circle", members: 5, focus: "Scalability basics", cadence: "Sat 5 PM", code: "SYS-2QX9", live: false },
  { id: "g3", name: "Mock interview pairs", members: 12, focus: "Peer mocks", cadence: "Rolling", code: "MOCK-K8D2", live: true },
  { id: "g4", name: "SQL & data jam", members: 6, focus: "Joins, windows, indexing", cadence: "Wed 8 PM", code: "SQL-M4VT", live: false },
];

export const ROOM_PARTICIPANTS = [
  { name: "kestrel", role: "Host" },
  { name: "n_iyer", role: "Member" },
  { name: "byteme", role: "Member" },
];

export type CertStatus = "earned" | "in_progress" | "locked";

export interface Certification {
  id: string;
  name: string;
  status: CertStatus;
  date: string;
  issuer: string;
  hours: number;
  skills: string[];
  credentialId?: string;
  modules: { name: string; done: boolean }[];
  unlockNote?: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: "c1",
    name: "DSA Foundations",
    status: "earned",
    date: "Mar 2026",
    issuer: "EduSphere Academy",
    hours: 40,
    skills: ["Arrays", "Hashing", "Trees", "Recursion", "Big-O analysis"],
    credentialId: "ES-DSA-2026-1A7F",
    modules: [
      { name: "Complexity & Big-O", done: true },
      { name: "Arrays & hashing", done: true },
      { name: "Trees & recursion", done: true },
      { name: "Capstone assessment", done: true },
    ],
  },
  {
    id: "c2",
    name: "SQL & Data Modeling",
    status: "earned",
    date: "Apr 2026",
    issuer: "EduSphere Academy",
    hours: 28,
    skills: ["SQL joins", "Indexing", "Normalization", "Window functions"],
    credentialId: "ES-SQL-2026-9C3B",
    modules: [
      { name: "Relational basics", done: true },
      { name: "Joins & subqueries", done: true },
      { name: "Indexing & performance", done: true },
      { name: "Capstone assessment", done: true },
    ],
  },
  {
    id: "c3",
    name: "System Design Basics",
    status: "in_progress",
    date: "62% complete",
    issuer: "EduSphere Academy",
    hours: 36,
    skills: ["Scalability", "Caching", "Load balancing", "Data partitioning"],
    modules: [
      { name: "Scaling fundamentals", done: true },
      { name: "Caching strategies", done: true },
      { name: "Load balancing", done: false },
      { name: "Capstone: design a URL shortener", done: false },
    ],
  },
  {
    id: "c4",
    name: "Behavioral Interviewing",
    status: "locked",
    date: "Unlock at readiness 80",
    issuer: "EduSphere Academy",
    hours: 12,
    skills: ["STAR method", "Storytelling", "Reflection"],
    modules: [
      { name: "STAR framework", done: false },
      { name: "Crafting your stories", done: false },
      { name: "Mock behavioral round", done: false },
    ],
    unlockNote: "Reach a placement readiness of 80 to unlock this track.",
  },
];

export const ASSIGNMENTS = [
  {
    id: "as1",
    title: "Graph traversal problem set",
    due: "Fri",
    subtasks: ["Read BFS vs DFS notes", "Solve 4 traversal problems", "Submit reflection"],
  },
  {
    id: "as2",
    title: "System design write-up: URL shortener",
    due: "Next Tue",
    subtasks: ["Sketch the data model", "Pick a hashing scheme", "Draft 1-page design", "Self-review with rubric"],
  },
];

export const ROADMAP_STEPS = [
  { phase: "Now", title: "Close the system design gap", detail: "3 problems + 1 mock this week.", done: false },
  { phase: "Weeks 2–3", title: "Resume polish & 2 projects deep", detail: "Tighten to depth over breadth.", done: false },
  { phase: "Weeks 4–6", title: "Behavioral interview reps", detail: "Two mocks a week, recorded.", done: false },
];

export const ROADMAP_COMING = [
  { title: "AI Sign Classroom", detail: "Sign-language avatar for recorded lectures." },
  { title: "Live speech → caption → notes", detail: "Real-time captions and auto-notes in class." },
];

export const READINESS_ROLES = [
  {
    role: "ML Engineer",
    match: 78,
    note: "Strong DSA & projects align; system design is the gap to close.",
    inclusive: true,
  },
  {
    role: "Data Engineer",
    match: 84,
    note: "Your SQL and pipeline projects map directly here.",
    inclusive: true,
  },
  {
    role: "Backend Engineer (SDE-1)",
    match: 73,
    note: "Solid fundamentals; add one scalable-service project.",
    inclusive: false,
  },
];

/**
 * FEATURE 3 — Early Learning-Pattern Signals (counselor-only).
 * These are SUGGESTIONS for a supportive conversation, never labels, never
 * diagnoses, and are never shown to the student as a verdict. The risk engine
 * notices behavior patterns (reading speed, error patterns, attention) and
 * privately surfaces them to a counselor for a professional assessment.
 */
export const LEARNING_SUPPORT_SIGNALS = [
  {
    id: "ls1",
    student: "Student A",
    observation: "Reading speed consistently well below cohort on text-heavy items",
    suggestion: "May benefit from a learning-support conversation about format options.",
  },
  {
    id: "ls2",
    student: "Student B",
    observation: "Repeated letter-order patterns in typed answers; strong verbally",
    suggestion: "Worth a friendly check-in; audio-first tools may help.",
  },
];

const PLAN_KEY = (userId: string) => `edusphere.plan.${userId}`;
const INTERVENTIONS_KEY = "edusphere.interventions";

export function getPlanState(userId: string): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(PLAN_KEY(userId)) ?? "{}");
  } catch {
    return {};
  }
}

export function setPlanState(userId: string, state: Record<string, boolean>) {
  localStorage.setItem(PLAN_KEY(userId), JSON.stringify(state));
}

export function getApprovedInterventions(): string[] {
  try {
    return JSON.parse(localStorage.getItem(INTERVENTIONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function approveIntervention(studentId: string) {
  const approved = getApprovedInterventions();
  if (!approved.includes(studentId)) {
    approved.push(studentId);
    localStorage.setItem(INTERVENTIONS_KEY, JSON.stringify(approved));
  }
}
