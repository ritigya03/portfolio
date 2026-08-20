/**
 * ScrollConstellations — as sections scroll into view, stars appear
 * and thin glowing lines connect them like constellations being drawn.
 *
 * Each section gets its own mini constellation rendered in a 2D canvas.
 */
import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface Star {
  x: number; // 0–1 normalised
  y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Edge {
  from: number;
  to: number;
}

function generateConstellation(): { stars: Star[]; edges: Edge[] } {
  const count = 5 + Math.floor(Math.random() * 4);
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: 0.1 + Math.random() * 0.8,
      y: 0.1 + Math.random() * 0.8,
      size: 1.2 + Math.random() * 2,
      brightness: 0.5 + Math.random() * 0.5,
      twinkleSpeed: 1 + Math.random() * 2,
      twinklePhase: Math.random() * Math.PI * 2,
    });
  }

  // Connect nearby stars
  const edges: Edge[] = [];
  for (let i = 0; i < stars.length; i++) {
    // Connect to 1-2 nearest neighbours
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < stars.length; j++) {
      if (i === j) continue;
      const dx = stars[i]!.x - stars[j]!.x;
      const dy = stars[i]!.y - stars[j]!.y;
      dists.push({ j, d: Math.sqrt(dx * dx + dy * dy) });
    }
    dists.sort((a, b) => a.d - b.d);
    const connectCount = 1 + (Math.random() > 0.5 ? 1 : 0);
    for (let k = 0; k < connectCount && k < dists.length; k++) {
      const from = Math.min(i, dists[k]!.j);
      const to = Math.max(i, dists[k]!.j);
      if (!edges.some((e) => e.from === from && e.to === to)) {
        edges.push({ from, to });
      }
    }
  }
  return { stars, edges };
}

export function ScrollConstellation({
  className,
  side = "right",
}: {
  className?: string;
  side?: "left" | "right";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, margin: "-120px" });
  const constellationRef = useRef(generateConstellation());
  const progressRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(devicePixelRatio, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let animId: number;
    let lastTime = performance.now();
    const { stars, edges } = constellationRef.current;

    function frame() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Animate progress from 0 to 1 when in view
      if (isInView && progressRef.current < 1) {
        progressRef.current = Math.min(progressRef.current + dt * 0.5, 1);
      }

      const progress = progressRef.current;
      ctx!.clearRect(0, 0, w, h);

      if (progress <= 0) {
        animId = requestAnimationFrame(frame);
        return;
      }

      // Ease for smooth reveal
      const eased = 1 - Math.pow(1 - progress, 3);

      // Draw edges (lines)
      const visibleEdges = Math.floor(eased * edges.length);
      for (let i = 0; i < visibleEdges; i++) {
        const edge = edges[i]!;
        const s1 = stars[edge.from]!;
        const s2 = stars[edge.to]!;

        // Partial draw for the last edge
        const edgeProgress =
          i === visibleEdges - 1
            ? (eased * edges.length - i)
            : 1;

        const x1 = s1.x * w;
        const y1 = s1.y * h;
        const x2 = x1 + (s2.x * w - x1) * edgeProgress;
        const y2 = y1 + (s2.y * h - y1) * edgeProgress;

        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.strokeStyle = `rgba(255, 220, 245, ${0.25 * eased})`;
        ctx!.lineWidth = 0.8;
        ctx!.shadowColor = "rgba(255, 200, 235, 0.5)";
        ctx!.shadowBlur = 4;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      // Draw stars
      const visibleStars = Math.floor(eased * stars.length);
      for (let i = 0; i <= visibleStars && i < stars.length; i++) {
        const s = stars[i]!;
        s.twinklePhase += s.twinkleSpeed * dt;
        const twinkle = 0.6 + Math.sin(s.twinklePhase) * 0.4;
        const alpha = s.brightness * twinkle * eased;

        const sx = s.x * w;
        const sy = s.y * h;

        // Glow
        const glow = ctx!.createRadialGradient(sx, sy, 0, sx, sy, s.size * 4);
        glow.addColorStop(0, `rgba(255, 230, 250, ${alpha * 0.6})`);
        glow.addColorStop(1, `rgba(255, 230, 250, 0)`);
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(sx, sy, s.size * 4, 0, Math.PI * 2);
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.fill();

        // Cross sparkle
        ctx!.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
        ctx!.lineWidth = 0.5;
        const ray = s.size * 2.5;
        ctx!.beginPath();
        ctx!.moveTo(sx - ray, sy);
        ctx!.lineTo(sx + ray, sy);
        ctx!.moveTo(sx, sy - ray);
        ctx!.lineTo(sx, sy + ray);
        ctx!.stroke();
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(animId);
  }, [isInView, reduced]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute top-0 ${side === "right" ? "right-0" : "left-0"} h-full ${className ?? ""}`}
      aria-hidden
      style={{ width: "200px", opacity: 0.7 }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
      />
    </div>
  );
}
