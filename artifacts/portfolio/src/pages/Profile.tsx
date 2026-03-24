import { motion } from "framer-motion";
import {
  Mail, Github, Linkedin, Twitter, MapPin,
  Code2, Database, Layers, Terminal, Wrench,
  Zap, Calendar, ExternalLink, Star, GitBranch, Package,
  LogOut, LogIn,
} from "lucide-react";
import { Link } from "wouter";
import { PORTFOLIO_CONFIG } from "@/lib/config";
import { useAuth } from "@workspace/replit-auth-web";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] },
});

const SKILLS = [
  {
    icon: Terminal,
    label: "Backend",
    color: "hsl(170,90%,42%)",
    bg: "rgba(0,210,170,0.08)",
    border: "rgba(0,210,170,0.18)",
    items: ["Python", "FastAPI", "Django", "Node.js", "Express", "PostgreSQL", "Redis"],
  },
  {
    icon: Layers,
    label: "Frontend",
    color: "hsl(210,90%,60%)",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.18)",
    items: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Next.js"],
  },
  {
    icon: Database,
    label: "Data & ML",
    color: "hsl(270,80%,68%)",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.18)",
    items: ["pandas", "NumPy", "PyTorch", "scikit-learn", "Jupyter", "Polars"],
  },
  {
    icon: Wrench,
    label: "Tools & DevOps",
    color: "hsl(35,90%,58%)",
    bg: "rgba(251,191,36,0.07)",
    border: "rgba(251,191,36,0.16)",
    items: ["Git", "Docker", "AWS", "Linux", "GitHub Actions", "Terraform"],
  },
];

const EXPLORING = [
  { label: "Rust programming", icon: "🦀" },
  { label: "WebAssembly", icon: "⚡" },
  { label: "LLM fine-tuning", icon: "🧠" },
  { label: "Distributed systems", icon: "🕸️" },
];

const STATS = [
  { icon: Package, label: "Projects", value: "42+" },
  { icon: Star,    label: "GitHub Stars", value: "1.2k" },
  { icon: GitBranch, label: "Years coding", value: "6+" },
  { icon: Code2,   label: "Lines of Python", value: "∞" },
];

const SOCIALS = [
  { icon: Github,   label: "GitHub",   href: PORTFOLIO_CONFIG.socials.github,   color: "rgba(255,255,255,0.80)" },
  { icon: Linkedin, label: "LinkedIn", href: PORTFOLIO_CONFIG.socials.linkedin, color: "hsl(210,90%,60%)" },
  { icon: Twitter,  label: "Twitter",  href: PORTFOLIO_CONFIG.socials.twitter,  color: "hsl(200,85%,58%)" },
  { icon: Mail,     label: "Email",    href: PORTFOLIO_CONFIG.socials.email,    color: "hsl(170,90%,42%)" },
];

function GlassCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: "1.25rem",
        background:
          "linear-gradient(145deg, rgba(0,210,170,0.07) 0%, rgba(55,35,180,0.09) 50%, rgba(4,8,18,0.92) 100%)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        boxShadow:
          "0 0 0 1px rgba(0,210,170,0.14), inset 0 0 0 1px rgba(255,255,255,0.03), 0 20px 48px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      {/* top gloss */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(0,210,170,0.35) 35%, rgba(80,50,220,0.22) 65%, transparent 95%)",
        }}
      />
      {children}
    </div>
  );
}

export function Profile() {
  const { user, isAuthenticated, isLoading: authLoading, login, logout } = useAuth();

  const displayName = isAuthenticated && user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || PORTFOLIO_CONFIG.name
    : PORTFOLIO_CONFIG.name;

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* page ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(55,35,180,0.12) 0%, rgba(0,210,170,0.06) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* ── HERO CARD ──────────────────────────────────────── */}
        <motion.div {...fadeUp(0)}>
          <GlassCard className="p-8 md:p-10 mb-6">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {/* outer ring glow */}
                <div
                  className="absolute -inset-2 rounded-full pointer-events-none"
                  style={{
                    background:
                      "conic-gradient(from 180deg, hsl(170,90%,42%), hsl(210,90%,52%), hsl(270,80%,62%), hsl(170,90%,42%))",
                    opacity: 0.5,
                    filter: "blur(4px)",
                  }}
                />
                {isAuthenticated && user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={displayName}
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
                    style={{ boxShadow: "0 0 0 3px rgba(4,8,18,0.9)" }}
                  />
                ) : (
                  <div
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(170,90%,38%) 0%, hsl(210,90%,48%) 50%, hsl(250,80%,52%) 100%)",
                      boxShadow: "0 0 0 3px rgba(4,8,18,0.9)",
                    }}
                  >
                    <span
                      className="font-bold select-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2rem",
                        color: "rgba(255,255,255,0.95)",
                        textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                      }}
                    >
                      {initials}
                    </span>
                  </div>
                )}
                {/* availability dot */}
                <span
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-background"
                  style={{ background: "hsl(142,76%,46%)", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1
                    className="text-3xl md:text-4xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: "linear-gradient(135deg, hsl(170,70%,80%) 0%, hsl(210,80%,78%) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {displayName}
                  </h1>
                  {/* available badge */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
                    style={{
                      background: "rgba(34,197,94,0.10)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      color: "hsl(142,76%,56%)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Available for work
                  </span>
                </div>

                <p className="text-base font-medium mb-1" style={{ color: "hsl(210,80%,68%)" }}>
                  {PORTFOLIO_CONFIG.title}
                </p>

                <div className="flex items-center gap-1.5 mb-4" style={{ color: "rgba(255,255,255,0.38)" }}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm font-mono">San Francisco, CA · UTC-8</span>
                </div>

                <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: "rgba(255,255,255,0.60)" }}>
                  {PORTFOLIO_CONFIG.bio}
                </p>

                {/* Social links */}
                <div className="flex flex-wrap gap-2">
                  {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target={label !== "Email" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                      <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                    </motion.a>
                  ))}

                  {/* Auth button */}
                  {!authLoading && (
                    isAuthenticated ? (
                      <motion.button
                        onClick={logout}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
                        style={{
                          background: "rgba(220,38,38,0.08)",
                          border: "1px solid rgba(220,38,38,0.18)",
                          color: "hsl(0,82%,60%)",
                        }}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={login}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors"
                        style={{
                          background: "rgba(0,210,170,0.08)",
                          border: "1px solid rgba(0,210,170,0.20)",
                          color: "hsl(170,90%,42%)",
                        }}
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Sign in
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6"
              style={{ borderTop: "1px solid rgba(0,210,170,0.10)" }}
            >
              {STATS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5" style={{ color: "hsl(170,90%,42%)" }} />
                    <span
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        background: "linear-gradient(135deg, hsl(170,80%,70%), hsl(210,80%,70%))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                  <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* ── SKILLS + SIDEBAR ───────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Skills (left 2/3) */}
          <motion.div {...fadeUp(0.1)} className="md:col-span-2 space-y-4">
            <h2
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "rgba(0,210,170,0.55)" }}
            >
              // tech stack
            </h2>
            {SKILLS.map(({ icon: Icon, label, color, bg, border, items }) => (
              <GlassCard key={label} className="p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color, fontFamily: "var(--font-display)" }}>
                    {label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full text-xs font-mono"
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {/* Sidebar (right 1/3) */}
          <motion.div {...fadeUp(0.18)} className="space-y-4">
            <h2
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "rgba(0,210,170,0.55)" }}
            >
              // currently
            </h2>

            {/* Exploring card */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4" style={{ color: "hsl(35,90%,58%)" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "hsl(35,90%,68%)", fontFamily: "var(--font-display)" }}
                >
                  Exploring
                </span>
              </div>
              <ul className="space-y-2.5">
                {EXPLORING.map(({ label, icon }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.58)" }}>
                    <span className="text-base">{icon}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Availability card */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" style={{ color: "hsl(142,76%,46%)" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "hsl(142,76%,56%)", fontFamily: "var(--font-display)" }}
                >
                  Availability
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.50)" }}>
                Open to full-time roles, freelance contracts, and interesting open-source collaborations.
              </p>
              <a
                href={PORTFOLIO_CONFIG.socials.email}
                className="inline-flex items-center gap-2 w-full justify-center py-2 rounded-xl text-xs font-medium transition-opacity hover:opacity-80"
                style={{
                  background: "linear-gradient(135deg, hsl(170,90%,38%) 0%, hsl(210,90%,46%) 100%)",
                  color: "rgba(0,0,0,0.85)",
                  fontFamily: "var(--font-display)",
                }}
              >
                <Mail className="w-3.5 h-3.5" />
                Get in touch
              </a>
            </GlassCard>

            {/* Portfolio link */}
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="w-4 h-4" style={{ color: "hsl(170,90%,42%)" }} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "hsl(170,80%,65%)", fontFamily: "var(--font-display)" }}
                >
                  This portfolio
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>
                Built with React, Vite, Express, and PostgreSQL. Deployed on Replit.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-mono transition-opacity hover:opacity-80"
                style={{ color: "hsl(170,80%,55%)" }}
              >
                ← Back to home
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
