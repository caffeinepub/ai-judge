import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { Verdict } from "./backend.d";
import CaseSubmissionPage from "./pages/CaseSubmissionPage";
import LandingPage from "./pages/LandingPage";
import VerdictPage from "./pages/VerdictPage";

export type AppPage = "landing" | "submit" | "verdict";

export default function App() {
  const [page, setPage] = useState<AppPage>("landing");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [party1Name, setParty1Name] = useState("You");
  const [party2Name, setParty2Name] = useState("Other Party");

  function goToSubmit() {
    setPage("submit");
    window.scrollTo(0, 0);
  }

  function handleVerdict(v: Verdict, p1: string, p2: string) {
    setVerdict(v);
    setParty1Name(p1);
    setParty2Name(p2);
    setPage("verdict");
    window.scrollTo(0, 0);
  }

  function goHome() {
    setPage("landing");
    setVerdict(null);
    window.scrollTo(0, 0);
  }

  return (
    <>
      {page === "landing" && <LandingPage onGetStarted={goToSubmit} />}
      {page === "submit" && (
        <CaseSubmissionPage onVerdict={handleVerdict} onBack={goHome} />
      )}
      {page === "verdict" && verdict && (
        <VerdictPage
          verdict={verdict}
          party1Name={party1Name}
          party2Name={party2Name}
          onReset={goToSubmit}
          onHome={goHome}
        />
      )}
      <Toaster richColors position="top-right" />
    </>
  );
}
