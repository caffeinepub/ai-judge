import {
  CheckCircle,
  Gavel,
  MessageSquare,
  Mic,
  Scale,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onGetStarted: () => void;
}

const featureCards = [
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Impartial AI Judge",
    description:
      "Our AI analyzes both sides with complete objectivity — no bias, no favoritism.",
    quote: '"Finally, someone who listened to BOTH of us."',
    author: "— Maria T.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Fault Percentage",
    description:
      "Receive a precise breakdown showing each party's share of responsibility.",
    quote: '"The 70/30 breakdown opened my eyes completely."',
    author: "— James K.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Personalised Advice",
    description:
      "Actionable guidance tailored to each party's role in the conflict.",
    quote: '"The advice helped us move forward, not just point fingers."',
    author: "— Priya S.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Voice & Chat",
    description:
      "Speak or type your case. Our AI supports both voice and text input naturally.",
    quote: '"I just talked through my problem — it felt so natural."',
    author: "— Carlos R.",
  },
];

const navLinks = ["Home", "Features", "How It Works"];

export default function LandingPage({ onGetStarted }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(var(--judge-cream))" }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          background: "oklch(var(--judge-dark))",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
        className="sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel
              className="w-6 h-6"
              style={{ color: "oklch(var(--judge-gold))" }}
            />
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                color: "oklch(var(--judge-off-white))",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              AI JUDGE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link}
                type="button"
                data-ocid={`nav.${link.toLowerCase().replace(/ /g, "-")}.link`}
                className="text-sm font-medium transition-colors"
                style={{
                  color: "oklch(var(--judge-off-white) / 0.75)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {link}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-ocid="nav.login.link"
              className="text-sm font-medium transition-colors"
              style={{
                color: "oklch(var(--judge-off-white) / 0.75)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Log In
            </button>
            <button
              type="button"
              data-ocid="nav.submit_case.button"
              onClick={onGetStarted}
              className="px-4 py-2 rounded text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{
                background: "oklch(var(--judge-gold))",
                color: "oklch(var(--judge-near-black))",
              }}
            >
              Submit Case
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-[600px] flex items-center overflow-hidden"
        style={{ background: "oklch(var(--judge-dark))" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-courtroom.dim_1400x800.jpg')",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, oklch(var(--judge-dark)) 40%, transparent 100%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(var(--judge-off-white))",
              }}
            >
              The Truth Has{" "}
              <span style={{ color: "oklch(var(--judge-gold))" }}>
                No Bias.
              </span>
              <br />
              Justice Has{" "}
              <span style={{ color: "oklch(var(--judge-gold))" }}>
                No Favorites.
              </span>
            </h1>
            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: "oklch(var(--judge-off-white) / 0.75)" }}
            >
              AI Judge analyzes relationship conflicts, personal disputes, and
              workplace issues — then delivers an impartial verdict with fault
              percentages and actionable advice for both parties.
            </p>
            <button
              type="button"
              data-ocid="hero.get_started.primary_button"
              onClick={onGetStarted}
              className="px-8 py-4 rounded text-base font-bold transition-all hover:opacity-90 active:scale-95 shadow-card-lg"
              style={{
                background: "oklch(var(--judge-gold))",
                color: "oklch(var(--judge-near-black))",
              }}
            >
              Get Started Free
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="hidden md:block"
          >
            <div
              className="rounded-2xl p-6 shadow-card-lg"
              style={{
                background: "oklch(var(--judge-charcoal))",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span
                  className="ml-2 text-xs"
                  style={{ color: "oklch(var(--judge-off-white) / 0.4)" }}
                >
                  AI Judge · Live Verdict
                </span>
              </div>
              <div className="space-y-3">
                <div
                  className="rounded-lg p-3"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "oklch(var(--judge-gold))" }}
                  >
                    CASE #1042 · Relationship Dispute
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(var(--judge-off-white) / 0.8)" }}
                  >
                    "He never listens to my feelings and dismisses every concern
                    I raise..."
                  </p>
                </div>
                <div className="flex gap-3">
                  <div
                    className="flex-1 rounded-lg p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "oklch(var(--judge-gold))" }}
                    >
                      35%
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(var(--judge-off-white) / 0.5)" }}
                    >
                      Party 1 at fault
                    </p>
                  </div>
                  <div
                    className="flex-1 rounded-lg p-3 text-center"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="text-2xl font-bold text-red-400">65%</p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(var(--judge-off-white) / 0.5)" }}
                    >
                      Party 2 at fault
                    </p>
                  </div>
                </div>
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(199,164,106,0.1)",
                    border: "1px solid rgba(199,164,106,0.2)",
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: "oklch(var(--judge-gold))" }}
                  >
                    ⚖️ VERDICT
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(var(--judge-off-white) / 0.85)" }}
                  >
                    Both parties must improve communication, but dismissiveness
                    is the primary concern.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LIVE ARBITRATION */}
      <section
        className="py-24 px-6"
        style={{ background: "oklch(var(--judge-cream))" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(var(--judge-near-black))",
              }}
            >
              Live Arbitration
            </h2>
            <p
              className="text-lg"
              style={{ color: "oklch(var(--judge-muted))" }}
            >
              Submit your case and receive an impartial AI verdict in seconds
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Chat Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="rounded-2xl p-6 shadow-card bg-white"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--judge-gold))" }}
                />
                <h3
                  className="font-semibold"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  Chat &amp; Voice Input
                </h3>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: "oklch(var(--judge-gold) / 0.2)",
                      color: "oklch(var(--judge-gold))",
                    }}
                  >
                    A
                  </div>
                  <div
                    className="flex-1 rounded-lg rounded-tl-none p-3 text-sm"
                    style={{
                      background: "oklch(var(--judge-cream))",
                      color: "oklch(var(--judge-near-black))",
                    }}
                  >
                    "She promised to come home by 8pm but arrived at midnight
                    without any notice..."
                  </div>
                </div>
                <div className="flex gap-2 flex-row-reverse">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      background: "oklch(var(--judge-dark) / 0.1)",
                      color: "oklch(var(--judge-near-black))",
                    }}
                  >
                    B
                  </div>
                  <div
                    className="flex-1 rounded-lg rounded-tr-none p-3 text-sm"
                    style={{
                      background: "oklch(var(--judge-charcoal))",
                      color: "oklch(var(--judge-off-white))",
                    }}
                  >
                    "I was stuck in traffic and my phone died, I couldn't
                    call..."
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  border: "1px solid oklch(var(--judge-border-light))",
                  color: "oklch(var(--judge-muted))",
                }}
              >
                <span className="text-sm flex-1">
                  Describe your situation...
                </span>
                <Mic
                  className="w-4 h-4"
                  style={{ color: "oklch(var(--judge-gold))" }}
                />
              </div>
            </motion.div>

            {/* Voice Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl p-6 shadow-card flex flex-col items-center justify-center text-center"
              style={{ background: "oklch(var(--judge-dark))" }}
            >
              <Gavel
                className="w-10 h-10 mb-4"
                style={{ color: "oklch(var(--judge-gold))" }}
              />
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "oklch(var(--judge-off-white))",
                }}
              >
                Speak Now
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "oklch(var(--judge-off-white) / 0.6)" }}
              >
                Tell the AI Judge your side of the story using your voice
              </p>
              <button
                type="button"
                onClick={onGetStarted}
                aria-label="Start voice input"
                className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{
                  background: "oklch(var(--judge-gold))",
                  color: "oklch(var(--judge-near-black))",
                }}
              >
                <Mic className="w-8 h-8" />
              </button>
              <p
                className="mt-4 text-xs"
                style={{ color: "oklch(var(--judge-gold) / 0.7)" }}
              >
                Tap to start speaking
              </p>
            </motion.div>

            {/* Verdict Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl p-6 shadow-card bg-white"
            >
              <div className="flex items-center gap-2 mb-4">
                <Scale
                  className="w-5 h-5"
                  style={{ color: "oklch(var(--judge-gold))" }}
                />
                <h3
                  className="font-semibold"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  Verdict Dashboard
                </h3>
              </div>
              <div className="flex justify-around mb-4">
                {(
                  [
                    [35, "Party A"],
                    [65, "Party B"],
                  ] as [number, string][]
                ).map(([pct, label]) => (
                  <div key={label} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-1">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-16 h-16 -rotate-90"
                        role="img"
                        aria-label={`${label}: ${pct}% at fault`}
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke={
                            pct === 65 ? "#e74c3c" : "oklch(var(--judge-gold))"
                          }
                          strokeWidth="3"
                          strokeDasharray={`${pct * 0.94} 94`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span
                        className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                        style={{ color: "oklch(var(--judge-near-black))" }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(var(--judge-muted))" }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-3 mb-3"
                style={{
                  background: "oklch(var(--judge-cream))",
                  border: "1px solid oklch(var(--judge-border-light))",
                }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "oklch(var(--judge-gold))" }}
                >
                  ⚖️ AI VERDICT
                </p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  Communication breakdown is the core issue. Party B must take
                  responsibility for the lack of notification.
                </p>
              </div>
              <div
                className="rounded-lg p-3"
                style={{ background: "oklch(var(--judge-cream))" }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  💡 Recommended Action
                </p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(var(--judge-muted))" }}
                >
                  Establish clear communication agreements and check-in
                  protocols going forward.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="py-24 px-6"
        style={{ background: "oklch(var(--judge-dark))" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(var(--judge-off-white))",
              }}
            >
              How It Works
            </h2>
            <p style={{ color: "oklch(var(--judge-off-white) / 0.6)" }}>
              Three simple steps to impartial resolution
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Submit",
                desc: "Describe your conflict in detail — your side and the other party's perspective. Use voice or text.",
              },
              {
                step: "02",
                icon: <Zap className="w-8 h-8" />,
                title: "Analyze",
                desc: "Our AI analyzes both accounts, weighs the evidence, and evaluates responsibility impartially.",
              },
              {
                step: "03",
                icon: <Scale className="w-8 h-8" />,
                title: "Resolve",
                desc: "Receive a detailed verdict with fault percentages, personalized advice, and resolution steps.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{
                    background: "oklch(var(--judge-gold) / 0.15)",
                    color: "oklch(var(--judge-gold))",
                  }}
                >
                  {item.icon}
                </div>
                <p
                  className="text-xs font-mono tracking-widest mb-2"
                  style={{ color: "oklch(var(--judge-gold) / 0.6)" }}
                >
                  {item.step}
                </p>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "oklch(var(--judge-off-white))",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: "oklch(var(--judge-off-white) / 0.6)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16"
          >
            <button
              type="button"
              data-ocid="how_it_works.get_started.primary_button"
              onClick={onGetStarted}
              className="px-10 py-4 rounded text-base font-bold transition-all hover:opacity-90 active:scale-95 shadow-card"
              style={{
                background: "oklch(var(--judge-gold))",
                color: "oklch(var(--judge-near-black))",
              }}
            >
              Submit Your Case Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="py-24 px-6"
        style={{ background: "oklch(var(--judge-cream))" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "oklch(var(--judge-near-black))",
              }}
            >
              Features
            </h2>
            <p style={{ color: "oklch(var(--judge-muted))" }}>
              Everything you need for fair conflict resolution
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: "oklch(var(--judge-gold) / 0.15)",
                    color: "oklch(var(--judge-gold))",
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{ color: "oklch(var(--judge-near-black))" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "oklch(var(--judge-muted))" }}
                >
                  {card.description}
                </p>
                <blockquote
                  className="text-sm italic p-3 rounded-lg"
                  style={{
                    background: "oklch(var(--judge-cream))",
                    borderLeft: "3px solid oklch(var(--judge-gold))",
                    color: "oklch(var(--judge-near-black))",
                  }}
                >
                  <p>{card.quote}</p>
                  <footer
                    className="mt-1 text-xs"
                    style={{ color: "oklch(var(--judge-muted))" }}
                  >
                    {card.author}
                  </footer>
                </blockquote>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-8 px-6"
        style={{
          background: "oklch(var(--judge-dark))",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
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
            <div className="flex items-center gap-6">
              {["About", "Support", "Contact", "Terms"].map((link) => (
                <button
                  key={link}
                  type="button"
                  className="text-sm transition-colors"
                  style={{
                    color: "oklch(var(--judge-off-white) / 0.5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
          <div
            className="text-center text-xs"
            style={{ color: "oklch(var(--judge-off-white) / 0.35)" }}
          >
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "oklch(var(--judge-gold) / 0.7)" }}
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
