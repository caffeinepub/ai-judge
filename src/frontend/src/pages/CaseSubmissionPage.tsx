import {
  ChevronLeft,
  Gavel,
  Loader2,
  MessageSquare,
  Mic,
  MicOff,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import type { Verdict } from "../backend.d";
import { useAnalyzeCaseAnonymous } from "../hooks/useQueries";

interface Props {
  onVerdict: (verdict: Verdict, party1: string, party2: string) => void;
  onBack: () => void;
}

type InputMode = "chat" | "voice";
type ActiveField = "description" | "otherDescription" | null;

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

const inputStyle = {
  border: "1.5px solid oklch(var(--judge-border-light))",
  color: "oklch(var(--judge-near-black))",
  background: "white",
  outline: "none",
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  fontSize: "0.875rem",
  transition: "border-color 0.2s",
} as const;

export default function CaseSubmissionPage({ onVerdict, onBack }: Props) {
  const [mode, setMode] = useState<InputMode>("chat");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [otherDescription, setOtherDescription] = useState("");
  const [party1Name, setParty1Name] = useState("You");
  const [party2Name, setParty2Name] = useState("Other Party");
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const voiceSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const titleId = useId();
  const party1Id = useId();
  const party2Id = useId();
  const descId = useId();
  const otherDescId = useId();

  const { mutate: analyze, isPending } = useAnalyzeCaseAnonymous();

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function startListening(field: ActiveField) {
    if (!voiceSupported) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (field === "description") {
        setDescription((prev) => prev + transcript);
      } else {
        setOtherDescription((prev) => prev + transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setActiveField(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveField(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setActiveField(field);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
    setActiveField(null);
  }

  function handleSubmit() {
    if (!description.trim()) {
      toast.error("Please describe your side of the situation.");
      return;
    }
    analyze(
      {
        description: description.trim(),
        otherPartyDescription: otherDescription.trim() || null,
      },
      {
        onSuccess: (verdict) => {
          onVerdict(verdict, party1Name || "You", party2Name || "Other Party");
        },
        onError: (err) => {
          toast.error(err.message || "Analysis failed. Please try again.");
        },
      },
    );
  }

  const descListening = isListening && activeField === "description";
  const otherListening = isListening && activeField === "otherDescription";

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
            data-ocid="submit.back.button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{
              color: "oklch(var(--judge-off-white) / 0.7)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
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
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h1
              className="text-4xl font-bold mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(var(--judge-near-black))",
              }}
            >
              Submit Your Case
            </h1>
            <p style={{ color: "oklch(var(--judge-muted))" }}>
              The AI Judge will analyze all perspectives and deliver an
              impartial verdict
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div
              className="flex rounded-lg p-1"
              style={{
                background: "oklch(var(--judge-dark) / 0.08)",
                border: "1px solid oklch(var(--judge-border-light))",
              }}
            >
              <button
                type="button"
                data-ocid="submit.chat_mode.toggle"
                onClick={() => setMode("chat")}
                className="flex items-center gap-2 px-5 py-2 rounded text-sm font-medium transition-all"
                style={
                  mode === "chat"
                    ? {
                        background: "oklch(var(--judge-gold))",
                        color: "oklch(var(--judge-near-black))",
                      }
                    : { color: "oklch(var(--judge-muted))", background: "none" }
                }
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button
                type="button"
                data-ocid="submit.voice_mode.toggle"
                onClick={() => setMode("voice")}
                className="flex items-center gap-2 px-5 py-2 rounded text-sm font-medium transition-all"
                style={
                  mode === "voice"
                    ? {
                        background: "oklch(var(--judge-gold))",
                        color: "oklch(var(--judge-near-black))",
                      }
                    : { color: "oklch(var(--judge-muted))", background: "none" }
                }
              >
                <Mic className="w-4 h-4" />
                Voice
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-card space-y-6">
            {/* Case Title */}
            <div>
              <label
                htmlFor={titleId}
                className="block text-sm font-semibold mb-2"
                style={{ color: "oklch(var(--judge-near-black))" }}
              >
                Case Title
              </label>
              <input
                id={titleId}
                data-ocid="submit.title.input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Communication dispute with partner"
                style={inputStyle}
              />
            </div>

            {/* Party Names */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor={party1Id}
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  Your Name / Party 1
                </label>
                <input
                  id={party1Id}
                  data-ocid="submit.party1_name.input"
                  type="text"
                  value={party1Name}
                  onChange={(e) => setParty1Name(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  htmlFor={party2Id}
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  Other Party's Name
                </label>
                <input
                  id={party2Id}
                  data-ocid="submit.party2_name.input"
                  type="text"
                  value={party2Name}
                  onChange={(e) => setParty2Name(e.target.value)}
                  placeholder="Other person's name"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Your Side */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={descId}
                  className="text-sm font-semibold"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  Your Side of the Story *
                </label>
                {mode === "voice" && voiceSupported && (
                  <button
                    type="button"
                    data-ocid="submit.description_voice.button"
                    onClick={() =>
                      descListening
                        ? stopListening()
                        : startListening("description")
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={
                      descListening
                        ? { background: "#e74c3c", color: "white" }
                        : {
                            background: "oklch(var(--judge-gold))",
                            color: "oklch(var(--judge-near-black))",
                          }
                    }
                  >
                    {descListening ? (
                      <MicOff className="w-3 h-3" />
                    ) : (
                      <Mic className="w-3 h-3" />
                    )}
                    {descListening ? "Stop" : "Speak"}
                  </button>
                )}
              </div>
              <div className="relative">
                <textarea
                  id={descId}
                  data-ocid="submit.description.textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your perspective on the situation in detail. What happened? How did it affect you? What do you think was unfair?"
                  rows={5}
                  className="resize-none"
                  style={{
                    ...inputStyle,
                    borderColor: descListening
                      ? "oklch(var(--judge-gold))"
                      : "oklch(var(--judge-border-light))",
                  }}
                />
                {descListening && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-red-500 font-medium">
                      Listening...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Other Side */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={otherDescId}
                  className="text-sm font-semibold"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  Other Party's Side{" "}
                  <span style={{ color: "oklch(var(--judge-muted))" }}>
                    (Optional)
                  </span>
                </label>
                {mode === "voice" && voiceSupported && (
                  <button
                    type="button"
                    data-ocid="submit.other_description_voice.button"
                    onClick={() =>
                      otherListening
                        ? stopListening()
                        : startListening("otherDescription")
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={
                      otherListening
                        ? { background: "#e74c3c", color: "white" }
                        : {
                            background: "oklch(var(--judge-gold))",
                            color: "oklch(var(--judge-near-black))",
                          }
                    }
                  >
                    {otherListening ? (
                      <MicOff className="w-3 h-3" />
                    ) : (
                      <Mic className="w-3 h-3" />
                    )}
                    {otherListening ? "Stop" : "Speak"}
                  </button>
                )}
              </div>
              <div className="relative">
                <textarea
                  id={otherDescId}
                  data-ocid="submit.other_description.textarea"
                  value={otherDescription}
                  onChange={(e) => setOtherDescription(e.target.value)}
                  placeholder="If you know the other party's perspective, describe it here. This helps the AI give a fairer verdict. (Optional)"
                  rows={4}
                  className="resize-none"
                  style={{
                    ...inputStyle,
                    borderColor: otherListening
                      ? "oklch(var(--judge-gold))"
                      : "oklch(var(--judge-border-light))",
                  }}
                />
                {otherListening && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-red-500 font-medium">
                      Listening...
                    </span>
                  </div>
                )}
              </div>
            </div>

            {mode === "voice" && !voiceSupported && (
              <div
                data-ocid="submit.voice_unsupported.error_state"
                className="text-sm px-4 py-3 rounded-lg"
                style={{
                  background: "oklch(0.97 0.01 30)",
                  color: "oklch(0.5 0.1 30)",
                  border: "1px solid oklch(0.88 0.05 30)",
                }}
              >
                ⚠️ Voice input is not supported in your browser. Please use
                Chrome or Edge, or switch to Chat mode.
              </div>
            )}

            <button
              type="button"
              data-ocid="submit.analyze.submit_button"
              onClick={handleSubmit}
              disabled={isPending || !description.trim()}
              className="w-full py-4 rounded-lg font-bold text-base transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "oklch(var(--judge-gold))",
                color: "oklch(var(--judge-near-black))",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  The Judge is analyzing...
                </>
              ) : (
                <>
                  <Gavel className="w-5 h-5" />
                  Submit to AI Judge
                </>
              )}
            </button>

            {isPending && (
              <div
                data-ocid="submit.analyzing.loading_state"
                className="text-center"
              >
                <p
                  className="text-sm"
                  style={{ color: "oklch(var(--judge-muted))" }}
                >
                  ⚖️ Reviewing all perspectives and weighing the evidence...
                </p>
              </div>
            )}
          </div>
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
