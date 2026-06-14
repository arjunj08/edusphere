# EduSphere AI

**Predictive student-success intelligence + inclusive learning platform.**
Built for the 2026 Cintana Alliance AI Challenge — Student Success Track.

EduSphere reads the signals universities already collect (grades, attendance, LMS
activity, submission patterns), predicts which students are heading toward failure
**3–5 weeks early**, and intervenes automatically — study plans, mock interviews,
mentor pairing, and faculty alerts. It is inclusive by design: the experience
adapts to how each student learns, and ships placement-edge tools that competitors
structurally don't have.

> ⚠️ All data in this build is **synthetic and illustrative**. Projected impact
> numbers are labeled as projections; the live pilot at Anurag University runs
> July–August 2026.

---

## ✨ Highlights

- **Marketing landing page** — 15 editorial sections with an animated student-risk
  timeline, problem framing, and a projected-impact panel.
- **14 product features** — Dashboard, Problem Bank, Daily Challenge, Mock
  Interview, Leaderboard, Forum, Study Groups, Skill Report, Job Readiness,
  Certifications, Assignments, Roadmap, Profile, Settings.
- **Faculty / counselor view** — risk triage with explainable (SHAP-style) signals
  and one-click agentic interventions.

### Three rings of adaptivity

| Ring | Who | What |
|------|-----|------|
| **Ring 1 — Core** | Everyone | The 14 features, full toolkit, never gated. |
| **Ring 2 — Universal Adaptive** | Every user, no setup | Explain-It-My-Way, **Cognitive Cam** (on-device load sensing + break prompts), Silent-Struggle detector, Adaptive Difficulty, Multimodal Notes. |
| **Ring 3 — Accessibility** | Activated by onboarding preference | Screen-reader / voice nav, captions + Live Lecture Companion, reading ruler / dyslexia mode, focus-session companion, sign-language roadmap, Accommodation Passport. |

### Placement-edge features

- **Placement Twin** (`/twin`) — k-NN matches you to past students with similar
  starting points and surfaces the moves that most separated those who placed.
- **Reverse Job Matching** (`/jobs/gap`) — you vs. a company's typical hire, with a
  dated 4-week closing plan.
- **Live Interview Co-pilot** — real-time pacing / filler / "approach-before-coding"
  nudges during a mock.
- **Offer Negotiation Simulator** (`/negotiate`) — branching recruiter dialog with a
  scored debrief.
- **Readiness Countdown** — live "% ready · ~N weeks to target" in the header.
- **Recruiter-View Resume** (`/resume/recruiter-view`) — ATS auto-reject flags with
  one-tap fixes.

### Functional, not mocked

A real heuristic **code-evaluation engine** scores submissions, awards **points**,
and updates a **live leaderboard**; streaks, plan checkboxes, and the accommodation
passport persist in `localStorage`.

---

## 🛠 Tech stack

- **React 18** + **TypeScript** + **Vite**
- **React Router v6**
- **Tailwind CSS** (shadcn-style structure: `@/components/ui`, `@/lib/utils`)
- **Framer Motion** for all animation (respects `prefers-reduced-motion`)
- **Lucide React** icons
- Mock backend behind `src/services/*` (Supabase-shaped, swappable for a real API)

**Design system:** warm paper `#FAFAF7`, ink `#101B2D`, signal colors
(red `#E24B4A` · amber `#EF9F27` · green `#1D9E75` · indigo `#534AB7`); Fraunces
for headings, Instrument Sans for body, JetBrains Mono for labels/data.

---

## 🚀 Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

**Demo accounts:** sign up as a **Student** (walk the onboarding fork → 14 features)
or as **Faculty** (triage + counselor signals). Data lives in your browser, so use
an incognito window to reset.

> 📷 The **Cognitive Cam** and **Study Room camera** request webcam access. Browsers
> only allow this over `localhost` or **HTTPS** — both the dev server and the Vercel
> deploy qualify. Click **Allow** when prompted.

---

## 📁 Project structure

```
src/
  components/
    landing/        Marketing site (15 sections)
    app/            App shell, pages, faculty view, modals
    universal/      Ring 2: AdaptSheet, CognitiveCam, ExplainItMyWay, …
    accessibility/  Ring 3: ReadingSupport, FocusSession, VoiceNav, …
    twin/ jobs/ negotiate/ resume/   Placement-edge features
    ui/             Book, TiltCard, ReadinessRing, StatBar
  context/          Auth, Accessibility, Progress, Sensing
  hooks/            useCounter, useAttentionSignal, useStruggleSignal, useInterviewCoach
  services/         auth, mockData, evaluate, twin, companyMatch, atsParse, …
  data/             cohort.json, companies.json, negotiation.json (synthetic)
```

---

## 🔒 Privacy & responsible AI

- Camera/behavioral sensing is **on-device, opt-in, stores nothing** — and says so
  on screen.
- A student's accessibility preferences and **Accommodation Passport** are
  student-owned and never exposed in Leaderboard, Forum, Study Groups, or any
  faculty surface without explicit per-item consent.
- Learning-pattern signals are **suggestions for a counselor conversation**, never a
  label or verdict, and never shown to the student as one.

---

## ☁️ Deployment

Deployed on **Vercel** (Vite preset, output `dist`). `vercel.json` adds an SPA
rewrite so client-side routes resolve on refresh, and Open Graph tags + a theme
color ship in `index.html`. Every push to `main` triggers an automatic deploy.

---

## 📄 License

MIT · Built for the Cintana Alliance AI Challenge · Anurag University, Hyderabad.
