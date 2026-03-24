import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Terminal, LogIn, Loader2, ShieldCheck, Zap, Lock } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { PORTFOLIO_CONFIG } from "@/lib/config";

const FEATURES = [
  { icon: ShieldCheck, label: "Secure authentication" },
  { icon: Zap,         label: "Instant access"        },
  { icon: Lock,        label: "Private sessions"       },
];

export function SignIn() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [, setLocation] = useLocation();

  // If already signed in, redirect to home
  useEffect(() => {
    if (!isLoading && isAuthenticated) setLocation("/");
  }, [isAuthenticated, isLoading, setLocation]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden"
      style={{ background: "hsl(222, 47%, 5%)" }}
    >
      {/* ── Background ambient glows ────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 18% 20%, rgba(0,210,170,0.09) 0%, transparent 70%)," +
            "radial-gradient(ellipse 55% 45% at 80% 75%, rgba(55,35,190,0.13) 0%, transparent 65%)," +
            "radial-gradient(ellipse 40% 35% at 60% 10%, rgba(0,80,200,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,210,170,1) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(0,210,170,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Card ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Outer glow ring */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,210,170,0.25) 0%, rgba(55,35,190,0.20) 50%, rgba(0,80,200,0.15) 100%)",
            filter: "blur(1px)",
          }}
        />

        {/* Glass card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, rgba(0,210,170,0.06) 0%, rgba(55,35,180,0.10) 40%, rgba(4,8,18,0.92) 100%)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            boxShadow:
              "0 0 0 1px rgba(0,210,170,0.14), 0 32px 80px rgba(0,0,0,0.7), 0 8px 32px rgba(0,50,200,0.12)",
          }}
        >
          {/* Top gloss line */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(0,210,170,0.45) 35%, rgba(80,50,220,0.35) 65%, transparent)",
            }}
          />

          <div className="px-8 pt-10 pb-10 flex flex-col gap-8">

            {/* ── Logo + brand ──────────────────────────────── */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(170,90%,38%) 0%, hsl(210,90%,48%) 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(0,210,170,0.30), 0 0 28px rgba(0,210,170,0.35), 0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <Terminal className="w-6 h-6 text-black" strokeWidth={2.2} />
              </motion.div>

              <div className="text-center">
                <h1
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "linear-gradient(135deg, #fff 30%, hsl(170,80%,72%) 80%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Sign in
                </h1>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
                  Welcome back to{" "}
                  <span style={{ color: "rgba(255,255,255,0.60)" }}>
                    {PORTFOLIO_CONFIG.name.split(" ")[0]}'s portfolio
                  </span>
                </p>
              </div>
            </div>

            {/* ── Divider ───────────────────────────────────── */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(0,210,170,0.18) 40%, rgba(80,50,220,0.14) 60%, transparent)",
              }}
            />

            {/* ── Feature pills ─────────────────────────────── */}
            <div className="flex flex-col gap-3">
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.08, duration: 0.38 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(0,210,170,0.09)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,210,170,0.18) 0%, rgba(55,35,190,0.18) 100%)",
                      border: "1px solid rgba(0,210,170,0.15)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "hsl(170,80%,60%)" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* ── CTA button ────────────────────────────────── */}
            <motion.button
              onClick={login}
              disabled={isLoading}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              className="relative w-full overflow-hidden rounded-2xl py-3.5 flex items-center justify-center gap-2.5 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, hsl(170,88%,36%) 0%, hsl(195,85%,44%) 50%, hsl(215,80%,48%) 100%)",
                color: "rgba(0,0,0,0.85)",
                fontFamily: "var(--font-display)",
                boxShadow:
                  "0 0 0 1px rgba(0,210,170,0.30), 0 8px 28px rgba(0,150,130,0.25), 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              {/* Gloss overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
                }}
              />
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin relative z-10" />
              ) : (
                <LogIn className="w-4 h-4 relative z-10" />
              )}
              <span className="relative z-10">
                {isLoading ? "Checking session…" : "Continue"}
              </span>
            </motion.button>

            {/* ── Divider with "or" ─────────────────────────── */}
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.22)" }}>
                or
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
            </div>

            {/* ── Social icons row ──────────────────────────── */}
            <div className="flex items-center justify-center gap-3">
              {/* GitHub */}
              <motion.a
                href={PORTFOLIO_CONFIG.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                title="GitHub"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="rgba(255,255,255,0.75)">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                href={PORTFOLIO_CONFIG.socials.linkedin ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                title="LinkedIn"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="rgba(10,102,194,0.9)">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>

              {/* X / Twitter */}
              <motion.a
                href={PORTFOLIO_CONFIG.socials.twitter ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                title="X (Twitter)"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="rgba(255,255,255,0.80)">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>

              {/* Email */}
              <motion.a
                href={PORTFOLIO_CONFIG.socials.email ?? "#"}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                title="Email"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="rgba(0,210,170,0.80)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </motion.a>
            </div>

            {/* ── Footer note ───────────────────────────────── */}
            <p className="text-center text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.22)" }}>
              By signing in, you agree to keep things{" "}
              <span style={{ color: "rgba(0,210,170,0.55)" }}>respectful</span>.
              <br />
              Sessions are encrypted and stored securely.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
