import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Terminal, Github, UserRound, LogIn } from "lucide-react";
import { PORTFOLIO_CONFIG } from "@/lib/config";
import { useAuth } from "@workspace/replit-auth-web";
import { useCallback } from "react";

function GlassPill({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: "9999px",
        background:
          "linear-gradient(135deg, rgba(0,210,170,0.10) 0%, rgba(55,35,190,0.12) 45%, rgba(0,70,160,0.10) 75%, rgba(4,10,20,0.88) 100%)",
        backdropFilter: "blur(28px) saturate(190%)",
        WebkitBackdropFilter: "blur(28px) saturate(190%)",
        boxShadow:
          "0 0 0 1px rgba(0,210,170,0.16), 0 0 0 1px rgba(80,50,200,0.10) inset, 0 8px 32px rgba(0,0,0,0.6), 0 2px 12px rgba(0,80,200,0.12)",
        ...style,
      }}
    >
      {/* Top gloss */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 25%, rgba(0,210,170,0.40) 50%, rgba(255,255,255,0.15) 75%, transparent)",
        }}
      />
      {/* Inner shimmer */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-1/2 opacity-25 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgba(0,210,170,0.55) 0%, rgba(70,45,210,0.35) 50%, transparent 80%)",
          filter: "blur(6px)",
        }}
      />
      {children}
    </div>
  );
}

export function Navbar() {
  const [location, setLocation] = useLocation();
  const isProfile = location === "/profile";
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const goToLogin = useCallback(() => setLocation("/login"), [setLocation]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <div className="fixed top-3 sm:top-4 inset-x-0 z-50 pointer-events-none">
      <div className="relative flex items-center justify-center px-4">

        {/* ── CENTER: main navigation pill ─────────────────── */}
        <div className="pointer-events-auto">
          <GlassPill>
            <div className="relative grid grid-cols-3 items-center px-3 py-2 sm:py-2.5 gap-2">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-1.5 group justify-self-start">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(170,90%,42%) 0%, hsl(210,90%,50%) 100%)",
                    boxShadow: "0 0 12px rgba(0,210,170,0.45), 0 2px 6px rgba(0,0,0,0.4)",
                  }}
                >
                  <Terminal className="w-3.5 h-3.5 text-black" />
                </motion.div>
                <span
                  className="font-bold text-sm tracking-tight leading-none"
                  style={{ color: "hsl(170, 80%, 80%)", fontFamily: "var(--font-display)" }}
                >
                  {PORTFOLIO_CONFIG.name.split(" ")[0]}
                </span>
              </Link>

              {/* Nav links */}
              <nav className="flex items-center justify-center gap-0.5">
                {links.map((link) => {
                  const isActive =
                    location === link.href ||
                    (link.href !== "/" && location.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="relative px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap"
                      style={{ color: isActive ? "hsl(170, 90%, 65%)" : "rgba(255,255,255,0.52)" }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="di-active-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(0,210,170,0.18) 0%, rgba(0,100,200,0.14) 100%)",
                            boxShadow: "inset 0 0 0 1px rgba(0,210,170,0.25)",
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* GitHub */}
              <div className="flex justify-end">
                <motion.a
                  href={PORTFOLIO_CONFIG.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-7 h-7 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.6)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <Github className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            </div>
          </GlassPill>
        </div>

        {/* ── RIGHT: profile / login island ────────────────── */}
        <div className="absolute right-4 pointer-events-auto">
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}>
            {!authLoading && !isAuthenticated ? (
              /* Not logged in — show Sign in island */
              <button
                onClick={goToLogin}
                className="relative overflow-hidden cursor-pointer"
                style={{
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, rgba(55,35,190,0.14) 0%, rgba(0,70,160,0.12) 55%, rgba(4,10,20,0.88) 100%)",
                  backdropFilter: "blur(28px) saturate(190%)",
                  WebkitBackdropFilter: "blur(28px) saturate(190%)",
                  boxShadow: "0 0 0 1px rgba(80,50,200,0.22), inset 0 0 0 1px rgba(80,50,200,0.10), 0 8px 28px rgba(0,0,0,0.55)",
                  border: "none",
                }}
              >
                <div
                  className="absolute top-0 inset-x-0 h-px pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(80,50,220,0.35) 50%, transparent)" }}
                />
                <div className="relative flex items-center gap-2 px-3.5 py-2 sm:py-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(245,70%,52%) 0%, hsl(210,80%,48%) 100%)",
                      boxShadow: "0 0 10px rgba(80,50,200,0.40)",
                    }}
                  >
                    <LogIn className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span
                    className="text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:inline"
                    style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-display)" }}
                  >
                    Sign in
                  </span>
                </div>
              </button>
            ) : (
              /* Logged in (or loading) — show Profile island */
              <Link href="/profile">
                <div
                  className="relative overflow-hidden cursor-pointer"
                  style={{
                    borderRadius: "9999px",
                    background: isProfile
                      ? "linear-gradient(135deg, rgba(0,210,170,0.22) 0%, rgba(55,35,190,0.22) 60%, rgba(4,10,20,0.85) 100%)"
                      : "linear-gradient(135deg, rgba(55,35,190,0.14) 0%, rgba(0,70,160,0.12) 55%, rgba(4,10,20,0.88) 100%)",
                    backdropFilter: "blur(28px) saturate(190%)",
                    WebkitBackdropFilter: "blur(28px) saturate(190%)",
                    boxShadow: isProfile
                      ? "0 0 0 1px rgba(0,210,170,0.40), inset 0 0 0 1px rgba(80,50,200,0.15), 0 8px 28px rgba(0,0,0,0.55), 0 0 18px rgba(0,210,170,0.18)"
                      : "0 0 0 1px rgba(80,50,200,0.22), inset 0 0 0 1px rgba(80,50,200,0.10), 0 8px 28px rgba(0,0,0,0.55)",
                  }}
                >
                  <div
                    className="absolute top-0 inset-x-0 h-px pointer-events-none"
                    style={{
                      background: isProfile
                        ? "linear-gradient(90deg, transparent, rgba(0,210,170,0.50) 50%, transparent)"
                        : "linear-gradient(90deg, transparent, rgba(80,50,220,0.35) 50%, transparent)",
                    }}
                  />
                  <div className="relative flex items-center gap-2.5 px-3.5 py-2 sm:py-2.5">
                    {/* avatar — user's photo or initials */}
                    {isAuthenticated && user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.firstName ?? ""}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        style={{ boxShadow: isProfile ? "0 0 10px rgba(0,210,170,0.45)" : "none" }}
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          background: isProfile
                            ? "linear-gradient(135deg, hsl(170,90%,42%) 0%, hsl(210,90%,52%) 100%)"
                            : "linear-gradient(135deg, hsl(245,70%,52%) 0%, hsl(210,80%,48%) 100%)",
                          boxShadow: isProfile ? "0 0 12px rgba(0,210,170,0.45)" : "0 0 10px rgba(80,50,200,0.40)",
                          color: "white",
                        }}
                      >
                        {isAuthenticated && user
                          ? [user.firstName, user.lastName].filter(Boolean).map(w => w![0]).join("").slice(0, 2).toUpperCase()
                          : <UserRound className="w-3.5 h-3.5" />}
                      </div>
                    )}
                    <span
                      className="text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:inline"
                      style={{
                        color: isProfile ? "hsl(170,80%,78%)" : "rgba(255,255,255,0.55)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {isAuthenticated && user?.firstName ? user.firstName : "Profile"}
                    </span>
                    {isProfile && (
                      <span
                        className="w-1.5 h-1.5 rounded-full hidden sm:inline-block"
                        style={{ background: "hsl(170,90%,42%)", boxShadow: "0 0 6px rgba(0,210,170,0.7)" }}
                      />
                    )}
                  </div>
                </div>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
