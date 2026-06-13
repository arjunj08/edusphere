import { useNavigate } from "react-router-dom";
import { Accessibility, ArrowRight, LayoutGrid } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import TiltCard from "@/components/ui/tilt-card";
import PageTransition from "@/components/app/PageTransition";

export default function Fork() {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const chooseStandard = async () => {
    await updateProfile({
      track: "standard",
      accessibilityProfile: [],
      onboarded: true,
    });
    navigate("/app/dashboard");
  };

  return (
    <PageTransition className="flex flex-col bg-paper">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-5 py-16">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-track">
            Welcome to EduSphere
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight md:text-5xl">
            How do you want to learn?
          </h1>
          <p className="mt-4 text-ink-soft">
            You can change this anytime. This stays private.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <TiltCard
            as="button"
            ariaLabel="Standard experience"
            onClick={chooseStandard}
            className="flex h-full flex-col p-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1EFE8]">
              <LayoutGrid size={22} className="text-ink" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-medium tracking-tight">
              Standard experience
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-ink-soft">
              The full toolkit — problem bank, mock interviews, readiness,
              planner, and more.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm font-medium text-ink">
              Start here <ArrowRight size={15} />
            </span>
          </TiltCard>

          <TiltCard
            as="button"
            ariaLabel="I'd like accessibility options"
            onClick={() => navigate("/onboarding/options")}
            className="flex h-full flex-col p-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft">
              <Accessibility size={22} className="text-accent" />
            </span>
            <h2 className="mt-5 font-display text-2xl font-medium tracking-tight">
              I'd like accessibility options
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-ink-soft">
              Same toolkit, built around how you learn — plus tools made for
              you.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm font-medium text-accent">
              Choose preferences <ArrowRight size={15} />
            </span>
          </TiltCard>
        </div>

        <p className="mt-10 text-center font-mono text-[11px] text-ink-soft">
          Every feature is available on both paths. The accessibility path only
          changes how things are delivered — and adds tools.
        </p>
      </main>
    </PageTransition>
  );
}
