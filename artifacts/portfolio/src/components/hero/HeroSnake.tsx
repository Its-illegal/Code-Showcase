import { useEffect, useRef } from "react";

const SEGMENTS = 26;
const SEG_GAP = 0.024;
const SPEED = 0.0030;

const FADE_IN  = 2800;
const VISIBLE  = 9000;
const FADE_OUT = 3000;
const HIDDEN   = 5500;

const R_HEAD = 11;
const R_TAIL = 4.5;

function path(t: number, W: number, H: number) {
  const cx = W * 0.50;
  const cy = H * 0.50;
  const rx = W * 0.41;
  const ry = H * 0.34;
  return {
    x: cx + rx * Math.sin(t),
    y: cy + ry * Math.sin(2 * t + 0.75),
  };
}

type Phase = "fadein" | "visible" | "fadeout" | "hidden";

export function HeroSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement!;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      canvas.width  = r.width;
      canvas.height = r.height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    let t         = Math.PI * 0.3;
    let opacity   = 0;
    let phase: Phase = "fadein";
    let phaseStart = performance.now();
    let raf = 0;

    function ease(x: number) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

    function draw(now: number) {
      const elapsed = now - phaseStart;

      if (phase === "fadein") {
        opacity = ease(Math.min(1, elapsed / FADE_IN));
        if (elapsed >= FADE_IN) { phase = "visible"; phaseStart = now; }
      } else if (phase === "visible") {
        opacity = 1;
        if (elapsed >= VISIBLE) { phase = "fadeout"; phaseStart = now; }
      } else if (phase === "fadeout") {
        opacity = ease(Math.max(0, 1 - elapsed / FADE_OUT));
        if (elapsed >= FADE_OUT) { phase = "hidden"; phaseStart = now; }
      } else {
        opacity = 0;
        if (elapsed >= HIDDEN) { phase = "fadein"; phaseStart = now; }
      }

      t += SPEED;

      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      if (opacity <= 0) { raf = requestAnimationFrame(draw); return; }

      ctx.globalAlpha = opacity;

      // ── Body segments (tail → head) ──────────────────────────────
      for (let i = SEGMENTS - 1; i >= 0; i--) {
        const segT   = t - i * SEG_GAP;
        const pos    = path(segT, W, H);
        const nextP  = path(segT + 0.001, W, H);
        const angle  = Math.atan2(nextP.y - pos.y, nextP.x - pos.x);

        const prog   = 1 - i / SEGMENTS;          // 0 = tail, 1 = head
        const radius = R_TAIL + (R_HEAD - R_TAIL) * Math.pow(prog, 0.65);

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        // Body gradient per segment
        const grad = ctx.createRadialGradient(0, -radius * 0.3, 0, 0, 0, radius * 1.4);
        grad.addColorStop(0, `rgba(${lerpRGB([0,230,190],[0,140,220], 1 - prog)},0.90)`);
        grad.addColorStop(1, `rgba(${lerpRGB([0,100,120],[0,40,100], 1 - prog)},0.70)`);

        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.25, radius, 0, 0, Math.PI * 2);
        ctx.fillStyle   = grad;
        ctx.shadowColor = `rgba(0,210,170,0.50)`;
        ctx.shadowBlur  = 10 * prog;
        ctx.fill();

        // Belly stripe — lighter underside
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.35, radius * 0.7, radius * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,255,230,${0.12 * prog})`;
        ctx.shadowBlur = 0;
        ctx.fill();

        // Scale highlight — small arc on dorsal side
        if (i % 3 === 0 && i < SEGMENTS - 1) {
          ctx.beginPath();
          ctx.ellipse(0, -radius * 0.38, radius * 0.55, radius * 0.28, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,255,210,${0.10 * prog})`;
          ctx.fill();
        }

        ctx.restore();
      }

      // ── Head ─────────────────────────────────────────────────────
      const headPos  = path(t, W, H);
      const headNext = path(t + 0.012, W, H);
      const headAng  = Math.atan2(headNext.y - headPos.y, headNext.x - headPos.x);

      ctx.save();
      ctx.translate(headPos.x, headPos.y);
      ctx.rotate(headAng);

      // Head body
      const hGrad = ctx.createRadialGradient(0, -R_HEAD * 0.4, 1, 0, 0, R_HEAD * 1.5);
      hGrad.addColorStop(0, "rgba(0,230,185,0.95)");
      hGrad.addColorStop(1, "rgba(0,110,170,0.80)");
      ctx.beginPath();
      ctx.ellipse(0, 0, R_HEAD * 1.35, R_HEAD, 0, 0, Math.PI * 2);
      ctx.fillStyle   = hGrad;
      ctx.shadowColor = "rgba(0,255,190,0.55)";
      ctx.shadowBlur  = 14;
      ctx.fill();

      // Eyes
      const eyeY = R_HEAD * 0.44;
      for (const side of [-1, 1]) {
        // outer glow
        ctx.beginPath();
        ctx.arc(R_HEAD * 0.28, side * eyeY, R_HEAD * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,200,0.18)";
        ctx.shadowBlur = 0;
        ctx.fill();
        // iris
        ctx.beginPath();
        ctx.arc(R_HEAD * 0.28, side * eyeY, R_HEAD * 0.20, 0, Math.PI * 2);
        ctx.fillStyle   = "rgba(0,255,210,0.95)";
        ctx.shadowColor = "rgba(0,255,200,0.9)";
        ctx.shadowBlur  = 8;
        ctx.fill();
        // pupil
        ctx.beginPath();
        ctx.arc(R_HEAD * 0.30, side * eyeY, R_HEAD * 0.10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,20,30,0.95)";
        ctx.shadowBlur = 0;
        ctx.fill();
      }

      // Tongue
      ctx.strokeStyle = "rgba(248,113,113,0.90)";
      ctx.lineWidth   = 1.8;
      ctx.lineCap     = "round";
      ctx.shadowColor = "rgba(248,80,80,0.6)";
      ctx.shadowBlur  = 5;
      // shaft
      ctx.beginPath();
      ctx.moveTo(R_HEAD * 1.25, 0);
      ctx.lineTo(R_HEAD * 1.90, 0);
      ctx.stroke();
      // fork
      ctx.beginPath();
      ctx.moveTo(R_HEAD * 1.90, 0);
      ctx.lineTo(R_HEAD * 2.35, -R_HEAD * 0.33);
      ctx.moveTo(R_HEAD * 1.90, 0);
      ctx.lineTo(R_HEAD * 2.35,  R_HEAD * 0.33);
      ctx.stroke();

      ctx.restore();
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

// Helper: lerp between two RGB arrays, returns "r,g,b" string
function lerpRGB(a: [number, number, number], b: [number, number, number], p: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * p),
    Math.round(a[1] + (b[1] - a[1]) * p),
    Math.round(a[2] + (b[2] - a[2]) * p),
  ].join(",");
}
