import {
  CheckCircle,
  Gavel,
  Home,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Verdict } from "../backend.d";

interface Props {
  verdict: Verdict;
  party1Name: string;
  party2Name: string;
  onReset: () => void;
  onHome: () => void;
}

function FaultCircle({
  percentage,
  label,
  color,
}: { percentage: number; label: string; color: string }) {
  const [animated, setAnimated] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg
          viewBox="0 0 120 120"
          className="w-36 h-36 -rotate-90"
          role="img"
          aria-label={`${label}: ${percentage}% at fault`}
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(var(--judge-near-black))",
            }}
          >
            {animated}%
          </span>
        </div>
      </div>
      <p
        className="mt-2 font-semibold text-sm"
        style={{ color: "oklch(var(--judge-near-black))" }}
      >
        {label}
      </p>
      <p className="text-xs" style={{ color: "oklch(var(--judge-muted))" }}>
        at fault
      </p>
    </div>
  );
}

export default function VerdictPage({
  verdict,
  party1Name,
  party2Name,
  onReset,
  onHome,
}: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const ttsSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const p1Fault = Number(verdict.party1FaultPercentage);
  const p2Fault = Number(verdict.party2FaultPercentage);
  const culpritName = p1Fault >= p2Fault ? party1Name : party2Name;

  function speakVerdict() {
    if (!ttsSupported) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const text = [
      `Verdict in the case of ${party1Name} versus ${party2Name}.`,
      verdict.verdictStatement,
      `${party1Name} is ${p1Fault} percent at fault.`,
      `${party2Name} is ${p2Fault} percent at fault.`,
      `Advice for ${party1Name}: ${verdict.party1Advice.join(". ")}.`,
      `Advice for ${party2Name}: ${verdict.party2Advice.join(". ")}.`,
      `Recommended resolution: ${verdict.recommendedSolution}.`,
    ].join(" ");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(var(--judge-cream))" }}
    >
      {/* Header */}
      <header
        style={{
          background: "oklch(var(--judge-dark))",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            data-ocid="verdict.home.button"
            onClick={onHome}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{
              color: "oklch(var(--judge-off-white) / 0.7)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <div className="flex items-center gap-2">
            <Gavel
              className="w-5 h-5"
              style={{ color: "oklch(var(--judge-gold))" }}
            />
            <span
              className="font-bold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(var(--judge-off-white))",
              }}
            >
              AI JUDGE
            </span>
          </div>
          <button
            type="button"
            data-ocid="verdict.another_case.button"
            onClick={onReset}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{
              color: "oklch(var(--judge-off-white) / 0.7)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            New Case
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Gavel Animation Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ background: "oklch(var(--judge-gold) / 0.15)" }}
          >
            <span className="animate-gavel text-4xl">⚖️</span>
          </div>
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(var(--judge-near-black))",
            }}
          >
            The Verdict Is In
          </h1>
          <p style={{ color: "oklch(var(--judge-muted))" }}>
            Case of{" "}
            <strong style={{ color: "oklch(var(--judge-near-black))" }}>
              {party1Name}
            </strong>{" "}
            vs.{" "}
            <strong style={{ color: "oklch(var(--judge-near-black))" }}>
              {party2Name}
            </strong>
          </p>
        </motion.div>

        {/* TTS Button */}
        {ttsSupported && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <button
              type="button"
              data-ocid="verdict.read_aloud.button"
              onClick={speakVerdict}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-90"
              style={
                isSpeaking
                  ? { background: "#e74c3c", color: "white" }
                  : {
                      background: "oklch(var(--judge-dark))",
                      color: "oklch(var(--judge-gold))",
                    }
              }
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              {isSpeaking ? "Stop Reading" : "Read Verdict Aloud"}
            </button>
          </motion.div>
        )}

        {/* Fault Percentages */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-card mb-6"
        >
          <h2
            className="text-lg font-bold text-center mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(var(--judge-near-black))",
            }}
          >
            Fault Distribution
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
            <FaultCircle
              percentage={p1Fault}
              label={party1Name}
              color={p1Fault > p2Fault ? "#e74c3c" : "oklch(var(--judge-gold))"}
            />
            <div className="text-center">
              <p
                className="text-4xl font-bold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "oklch(var(--judge-gold))",
                }}
              >
                VS
              </p>
            </div>
            <FaultCircle
              percentage={p2Fault}
              label={party2Name}
              color={p2Fault > p1Fault ? "#e74c3c" : "oklch(var(--judge-gold))"}
            />
          </div>
          {p1Fault !== p2Fault && (
            <div className="mt-6 text-center">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: "oklch(var(--judge-gold) / 0.15)",
                  color: "oklch(var(--judge-gold))",
                }}
              >
                Primary fault: {culpritName}
              </span>
            </div>
          )}
        </motion.div>

        {/* Verdict Statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="rounded-2xl p-6 mb-6 shadow-card"
          style={{ background: "oklch(var(--judge-dark))" }}
        >
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: "oklch(var(--judge-gold))" }}
          >
            ⚖️ AI VERDICT
          </p>
          <p
            className="text-lg leading-relaxed"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "oklch(var(--judge-off-white))",
            }}
          >
            &ldquo;{verdict.verdictStatement}&rdquo;
          </p>
        </motion.div>

        {/* Advice Section */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-card"
          >
            <h3
              className="font-bold mb-4"
              style={{ color: "oklch(var(--judge-near-black))" }}
            >
              Advice for {party1Name}
            </h3>
            <ul className="space-y-2">
              {verdict.party1Advice.map((advice) => (
                <li
                  key={advice}
                  className="flex gap-2 text-sm"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  <CheckCircle
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: "oklch(var(--judge-gold))" }}
                  />
                  {advice}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="bg-white rounded-2xl p-6 shadow-card"
          >
            <h3
              className="font-bold mb-4"
              style={{ color: "oklch(var(--judge-near-black))" }}
            >
              Advice for {party2Name}
            </h3>
            <ul className="space-y-2">
              {verdict.party2Advice.map((advice) => (
                <li
                  key={advice}
                  className="flex gap-2 text-sm"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  <CheckCircle
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    style={{ color: "oklch(var(--judge-gold))" }}
                  />
                  {advice}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Resolution */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="rounded-2xl p-6 mb-8 shadow-card"
          style={{
            background: "oklch(var(--judge-gold) / 0.12)",
            border: "1.5px solid oklch(var(--judge-gold) / 0.3)",
          }}
        >
          <p
            className="text-xs font-semibold tracking-widest mb-3"
            style={{ color: "oklch(var(--judge-gold))" }}
          >
            💡 RECOMMENDED RESOLUTION
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ color: "oklch(var(--judge-near-black))" }}
          >
            {verdict.recommendedSolution}
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            type="button"
            data-ocid="verdict.submit_another.primary_button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "oklch(var(--judge-gold))",
              color: "oklch(var(--judge-near-black))",
            }}
          >
            <Gavel className="w-5 h-5" />
            Submit Another Case
          </button>
          <button
            type="button"
            data-ocid="verdict.home_link.button"
            onClick={onHome}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "oklch(var(--judge-dark))",
              color: "oklch(var(--judge-off-white))",
            }}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>
      </main>

      <footer
        className="py-6 text-center"
        style={{ color: "oklch(var(--judge-muted))" }}
      >
        <p className="text-xs">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
