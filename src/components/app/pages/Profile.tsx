import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAccessibility } from "@/context/AccessibilityContext";
import { ACCESSIBILITY_OPTIONS } from "@/services/accessibility";
import PageHeading from "@/components/app/PageHeading";
import AccommodationPassport from "@/components/accessibility/AccommodationPassport";

export default function Profile() {
  const { profile } = useAuth();
  const { isAccessibility, savedFlags } = useAccessibility();

  const activeOptions = ACCESSIBILITY_OPTIONS.filter((o) => savedFlags.includes(o.flag));

  return (
    <div>
      <PageHeading
        eyebrow="Account"
        title="My Profile"
        summary="Your details, learning preferences, and accommodation passport — all owned by you."
        narration="My Profile. Your details, learning preferences, and accommodation passport, all owned by you."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg font-medium">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-ink-soft">Name</dt>
                <dd className="font-medium">{profile?.name}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-ink-soft">Email</dt>
                <dd className="font-medium">{profile?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Learning track</dt>
                <dd className="font-medium capitalize">{profile?.track}</dd>
              </div>
            </dl>
          </div>

          {/* Accommodation Passport — only meaningful on the accessibility track */}
          {isAccessibility ? (
            <AccommodationPassport />
          ) : (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-lg font-medium">Accommodation Passport</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Turn on accessibility options in{" "}
                <Link to="/settings" className="text-accent underline-offset-2 hover:underline">
                  Settings
                </Link>{" "}
                to set up a private passport that auto-configures the platform — with your consent.
              </p>
            </div>
          )}
        </div>

        <aside>
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg font-medium">Learning preferences</h2>
            {activeOptions.length ? (
              <ul className="mt-4 space-y-2">
                {activeOptions.map((o) => (
                  <li key={o.flag} className="flex items-center gap-2.5 text-sm">
                    <span aria-hidden="true">{o.icon}</span>
                    {o.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">Standard experience — no preferences set.</p>
            )}
            <Link to="/settings" className="mt-4 inline-block rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-paper">
              Edit in Settings
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
