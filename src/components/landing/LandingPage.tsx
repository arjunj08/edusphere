import Navbar from "./Navbar";
import Hero from "./Hero";
import RiskTimeline from "./RiskTimeline";
import ProblemStats from "./ProblemStats";
import Features from "./Features";
import DashboardPreview from "./DashboardPreview";
import StudentView from "./StudentView";
import MockInterview from "./MockInterview";
import AIMentorStrip from "./AIMentorStrip";
import InclusiveEngine from "./InclusiveEngine";
import InterventionLoop from "./InterventionLoop";
import Impact from "./Impact";
import TechStrip from "./TechStrip";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <RiskTimeline />
        <ProblemStats />
        <Features />
        <DashboardPreview />
        <StudentView />
        <MockInterview />
        <AIMentorStrip />
        <InclusiveEngine />
        <InterventionLoop />
        <Impact />
        <TechStrip />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
