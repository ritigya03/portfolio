/**
 * CrystalShimmer — tiny twinkling silver/pearl crystal particles
 * that drift gently over the hero section, like fairy dust.
 *
 * Renders on a separate 2D canvas with pointer-events: none.
 * Respects prefers-reduced-motion.
 */
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Sparkle palette — silver, pearl, icy pink, iridescent white
// ---------------------------------------------------------------------------
const SPARKLE_COLORS_LIGHT = [
  "rgba(255, 255, 255, ",       // pure white
  "rgba(230, 220, 240, ",       // icy lavender
  "rgba(255, 210, 230, ",       // soft pink shimmer
  "rgba(220, 230, 255, ",       // cool silver-blue
  "rgba(255, 240, 250, ",       // pearl
  "rgba(200, 215, 235, ",       // silver
  "rgba(255, 225, 240, ",       // warm pearl-pink
  "rgba(240, 235, 255, ",       // holographic white
];

const SPARKLE_COLORS_DARK = [
  "rgba(220, 40, 80, ",         // deep crimson
  "rgba(255, 100, 130, ",       // vibrant rose
  "rgba(180, 20, 60, ",         // dark wine
  "rgba(255, 180, 200, ",       // blush pearl
  "rgba(250, 220, 150, ",       // subtle chic gold
];

interface Particle {
  x: number;
  y: number;
  size: number;         // base radius 0.5 – 2.5px
  opacity: number;      // current opacity
  maxOpacity: number;   // peak brightness
  twinkleSpeed: number; // how fast it pulses
  twinklePhase: number; // offset so they don't all pulse in sync
  driftX: number;       // horizontal drift per second
  driftY: number;       // vertical drift per second (slow fall)
  colorIdx: number;     // index into SPARKLE_COLORS
  glowRadius: number;   // soft halo size
  points: number;       // 4 or 6 pointed star
  rotation: number;     // current rotation
  rotSpeed: number;     // rotation per second
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: 1.5 + Math.random() * 3.5,
    opacity: 0,
    maxOpacity: 0.6 + Math.random() * 0.4,
    twinkleSpeed: 0.6 + Math.random() * 1.8,
    twinklePhase: Math.random() * Math.PI * 2,
    driftX: (Math.random() - 0.5) * 10,
    driftY: -2 + Math.random() * 4,
    colorIdx: Math.floor(Math.random() * 10), // Modulo against active palette length later
    glowRadius: 8 + Math.random() * 14,
    points: Math.random() > 0.5 ? 4 : 6,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 1.2,
  };
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  points: number,
  rotation: number
) {
  const inner = r * 0.35;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = rotation + (i * Math.PI) / points;
    const dist = i % 2 === 0 ? r : inner;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

const PARTICLE_COUNT = 120;

export function CrystalShimmer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let animId: number;

    function resize() {
      const dpr = Math.min(devicePixelRatio, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(w, h));
      }
    }

    init();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();

    function frame() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        // Twinkle: sinusoidal opacity pulsing
        p.twinklePhase += p.twinkleSpeed * dt;
        const twinkle = Math.sin(p.twinklePhase);
        // Always at least 30% visible, with bright sparkle peaks
        const base = 0.3;
        const peak = twinkle > 0 ? twinkle * twinkle : 0;
        p.opacity = p.maxOpacity * (base + (1 - base) * peak);

        // Drift
        p.x += p.driftX * dt;
        p.y += p.driftY * dt;
        p.rotation += p.rotSpeed * dt;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        if (p.opacity < 0.05) continue; // skip nearly invisible

        const isDark = document.documentElement.classList.contains("dark");
        const activePalette = isDark ? SPARKLE_COLORS_DARK : SPARKLE_COLORS_LIGHT;
        const colorBase = activePalette[p.colorIdx % activePalette.length]!;
        const dimFactor = isDark ? 0.05 : 1; // Extremely faint in dark mode
        const o = p.opacity * dimFactor;

        // Outer glow halo
        const glow = ctx!.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.glowRadius
        );
        glow.addColorStop(0, colorBase + (o * 0.9).toFixed(3) + ")");
        glow.addColorStop(0.4, colorBase + (o * 0.4).toFixed(3) + ")");
        glow.addColorStop(1, colorBase + "0)");
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
        ctx!.fill();

        // Crystal star body
        ctx!.save();
        drawStar(ctx!, p.x, p.y, p.size, p.points, p.rotation);
        ctx!.fillStyle = colorBase + Math.min(o * 1.1, 1).toFixed(3) + ")";
        ctx!.shadowColor = "rgba(255, 255, 255, " + Math.min(o * 0.9, 1).toFixed(3) + ")";
        ctx!.shadowBlur = 8;
        ctx!.fill();
        ctx!.restore();

        // Cross-hair light rays (subtle "+" shape through the star)
        ctx!.save();
        ctx!.strokeStyle = "rgba(255, 255, 255, " + (o * 0.5).toFixed(3) + ")";
        ctx!.lineWidth = 0.5;
        const rayLen = p.size * 1.8;
        ctx!.beginPath();
        ctx!.moveTo(p.x - rayLen, p.y);
        ctx!.lineTo(p.x + rayLen, p.y);
        ctx!.moveTo(p.x, p.y - rayLen);
        ctx!.lineTo(p.x, p.y + rayLen);
        ctx!.stroke();
        ctx!.restore();

        // Bright white core dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(255, 255, 255, " + Math.min(o * 1.4, 1).toFixed(3) + ")";
        ctx!.fill();
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ opacity: 1, zIndex: 2 }}
    />
  );
}
