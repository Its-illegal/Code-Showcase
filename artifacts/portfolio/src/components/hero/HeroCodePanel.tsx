import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const customTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: "#a8f0e0",
    background: "transparent",
    fontFamily: "var(--font-mono)",
    lineHeight: "1.7",
  },
  'pre[class*="language-"]': {
    background: "transparent",
    margin: 0,
    padding: 0,
    overflow: "hidden",
  },
  comment:       { color: "#3d6e5c", fontStyle: "italic" },
  punctuation:   { color: "#6ab5a0" },
  string:        { color: "#2dd4bf" },
  keyword:       { color: "#38bdf8", fontWeight: "600" },
  "class-name":  { color: "#34d399" },
  function:      { color: "#c084fc" },
  decorator:     { color: "#fb923c" },
  number:        { color: "#fb923c" },
  operator:      { color: "#f87171" },
  builtin:       { color: "#fbbf24" },
  boolean:       { color: "#fb923c" },
  parameter:     { color: "#e2f4f0" },
  "attr-name":   { color: "#34d399" },
};

type Slide =
  | { kind: "code";  title: string; lang: string; code: string }
  | { kind: "quote"; quote: string; author: string };

const slides: Slide[] = [
  {
    kind: "code",
    title: "dataclass_magic.py",
    lang: "python",
    code: `from dataclasses import dataclass, field

@dataclass
class Developer:
    name: str
    passion: str = "Python"
    stack: list = field(
        default_factory=lambda: [
            "FastAPI", "pandas", "torch"
        ]
    )

    def introduce(self) -> str:
        return f"Hi, I'm {self.name}!"`,
  },
  {
    kind: "quote",
    quote: "Simple is better than complex.\nReadability counts.",
    author: "— The Zen of Python, PEP 20",
  },
  {
    kind: "code",
    title: "async_fetch.py",
    lang: "python",
    code: `import asyncio, aiohttp

async def fetch_repos(
    username: str,
) -> list[dict]:
    base = "https://api.github.com"
    async with aiohttp.ClientSession() as s:
        async with s.get(
            f"{base}/users/{username}/repos"
        ) as resp:
            return await resp.json()

repos = asyncio.run(fetch_repos("you"))`,
  },
  {
    kind: "quote",
    quote: "Now is better than never.\nAlthough never is often better\nthan *right* now.",
    author: "— Tim Peters",
  },
  {
    kind: "code",
    title: "decorator_magic.py",
    lang: "python",
    code: `from functools import wraps, lru_cache
import time

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - t
        print(f"{func.__name__}: {elapsed:.4f}s")
        return result
    return wrapper

@timer
@lru_cache(maxsize=256)
def fibonacci(n: int) -> int:
    return n if n < 2 else (
        fibonacci(n-1) + fibonacci(n-2)
    )`,
  },
  {
    kind: "quote",
    quote: "In the face of ambiguity, refuse\nthe temptation to guess.",
    author: "— The Zen of Python",
  },
  {
    kind: "code",
    title: "comprehensions.py",
    lang: "python",
    code: `# Pythonic data transformations
data = [1, 2, 3, 4, 5, 6, 7, 8]

squares  = [x**2 for x in data]
evens    = {x for x in data if x % 2 == 0}
mapping  = {x: x**2 for x in data}
lazy_gen = (x**2 for x in data)

# Nested comprehension
matrix = [
    [row * col for col in range(1, 4)]
    for row in range(1, 4)
]`,
  },
];

function TitleBar({ title, index, total }: { title: string; index: number; total: number }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 border-b"
      style={{ borderColor: "rgba(0,210,170,0.10)" }}
    >
      <span className="w-3 h-3 rounded-full bg-red-500/80" />
      <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
      <span className="w-3 h-3 rounded-full" style={{ background: "hsl(170,90%,42%)", opacity: 0.8 }} />
      <span
        className="ml-3 text-xs font-mono tracking-wide truncate"
        style={{ color: "rgba(0,210,170,0.55)" }}
      >
        {title}
      </span>
      <span className="ml-auto flex items-center gap-2 flex-shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: "hsl(170,90%,42%)" }}
        />
        <span className="text-xs font-mono" style={{ color: "rgba(0,210,170,0.35)" }}>
          python 3.12 · {index + 1}/{total}
        </span>
      </span>
    </div>
  );
}

function LineNumbers({ count }: { count: number }) {
  return (
    <div
      className="flex flex-col items-end pr-3 pt-5 pb-4 select-none flex-shrink-0"
      style={{
        color: "rgba(0,210,170,0.16)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        lineHeight: "1.7",
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>{i + 1}</span>
      ))}
    </div>
  );
}

function CodeSlide({ slide }: { slide: Extract<Slide, { kind: "code" }> }) {
  const lines = slide.code.split("\n").length;
  return (
    <div className="flex h-full">
      <LineNumbers count={lines} />
      <div className="flex-1 overflow-hidden pt-5 pr-5">
        <SyntaxHighlighter
          language={slide.lang}
          style={customTheme}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: 0,
            fontSize: "0.8rem",
            lineHeight: "1.7",
            overflowX: "hidden",
          }}
          wrapLines
          PreTag="div"
        >
          {slide.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function QuoteSlide({ slide }: { slide: Extract<Slide, { kind: "quote" }> }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-6 text-center gap-5">
      {/* large decorative quote mark */}
      <span
        className="select-none leading-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "5rem",
          lineHeight: 0.8,
          background: "linear-gradient(135deg, hsl(170,90%,42%), hsl(210,90%,52%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: 0.25,
        }}
      >
        "
      </span>
      {/* quote text — matches left hero display style */}
      <p
        className="leading-relaxed whitespace-pre-line font-bold"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.15rem",
          background: "linear-gradient(135deg, hsl(170,70%,82%) 0%, hsl(210,80%,80%) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {slide.quote}
      </p>
      {/* author badge — mirrors the left side's "welcome" badge */}
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono tracking-wider"
        style={{
          background: "rgba(0,210,170,0.08)",
          border: "1px solid rgba(0,210,170,0.2)",
          color: "rgba(0,210,170,0.7)",
        }}
      >
        {slide.author}
      </span>
    </div>
  );
}

export function HeroCodePanel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];
  const title = slide.kind === "code" ? slide.title : "zen_of_python.txt";

  const variants = {
    enter:  (d: number) => ({ y: d > 0 ? 32 : -32, opacity: 0, filter: "blur(5px)" }),
    center: { y: 0, opacity: 1, filter: "blur(0px)" },
    exit:   (d: number) => ({ y: d > 0 ? -32 : 32, opacity: 0, filter: "blur(5px)" }),
  };

  return (
    /* wider on desktop, full-width on mobile */
    <div className="relative w-full md:w-[480px] lg:w-[520px]">

      {/* primary ambient glow — teal top-right, matching the 3D shapes' edge glow */}
      <div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 65% 30%, hsl(170,90%,42%) 0%, hsl(240,70%,52%) 38%, transparent 68%)",
          opacity: 0.20,
          filter: "blur(36px)",
        }}
      />
      {/* indigo depth glow — mirrors the dark 3D shape interiors */}
      <div
        className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, hsl(245,60%,38%) 0%, transparent 70%)",
          opacity: 0.18,
          filter: "blur(28px)",
        }}
      />
      {/* red accent glow — bottom-left edge */}
      <div
        className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: "hsl(0,82%,52%)",
          opacity: 0.07,
          filter: "blur(20px)",
        }}
      />

      {/* panel shell */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: "1.5rem",
          background:
            "linear-gradient(145deg, rgba(0,210,170,0.09) 0%, rgba(55,35,180,0.11) 40%, rgba(0,60,150,0.10) 70%, rgba(4,8,18,0.94) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow: [
            "0 0 0 1px rgba(0,210,170,0.16)",
            "0 0 0 1px rgba(70,45,200,0.10) inset",
            "inset 0 0 0 1px rgba(255,255,255,0.03)",
            "0 32px 80px rgba(0,0,0,0.70)",
            "0 4px 24px rgba(40,20,160,0.15)",
          ].join(", "),
        }}
      >
        {/* top gloss line — teal to indigo, matching 3D shape edges */}
        <div
          className="absolute top-0 inset-x-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 3%, rgba(0,210,170,0.45) 28%, rgba(80,50,220,0.30) 58%, rgba(0,120,220,0.22) 78%, transparent 97%)",
          }}
        />
        {/* left-edge accent */}
        <div
          className="absolute inset-y-0 left-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,210,170,0.35) 0%, rgba(60,40,200,0.20) 55%, transparent 100%)",
          }}
        />

        <TitleBar title={title} index={index} total={slides.length} />

        {/* content area — taller on desktop */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              {slide.kind === "code" ? (
                <CodeSlide slide={slide} />
              ) : (
                <QuoteSlide slide={slide} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer: progress dots + slide type label */}
        <div
          className="flex items-center px-5 py-3 border-t gap-3"
          style={{ borderColor: "rgba(0,210,170,0.08)" }}
        >
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(0,210,170,0.3)" }}
          >
            {slide.kind === "quote" ? "// quote" : "# snippet"}
          </span>
          <div className="flex items-center gap-1.5 ml-auto">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className="transition-all duration-300 rounded-full"
                style={{
                  width:  i === index ? "1.4rem" : "0.4rem",
                  height: "0.4rem",
                  background:
                    i === index
                      ? "linear-gradient(90deg, hsl(170,90%,42%), hsl(210,90%,52%))"
                      : "rgba(0,210,170,0.18)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
