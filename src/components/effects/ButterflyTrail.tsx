/**
 * ButterflyTrail — delicate pink/iridescent butterflies that flutter
 * behind the cursor and slowly fade away. Desktop only.
 *
 * Each butterfly is a tiny SVG path that spawns at the cursor, then
 * drifts upward with a gentle wobble before fading out.
 */
import { useEffect, useRef } from "react";

interface Butterfly {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  driftX: number;
  driftY: number;
  wobblePhase: number;
  wobbleAmp: number;
  hue: number; // pink range 320-350
  opacity: number;
  wingPhase: number;
  wingSpeed: number;
}

const MAX_BUTTERFLIES = 8;
const SPAWN_INTERVAL = 380; // ms between spawns

function drawButterfly(
  ctx: CanvasRenderingContext2D,
  b: Butterfly
) {
  const ageRatio = b.age / b.maxAge;
  const fadeIn = Math.min(b.age / 300, 1);
  const fadeOut = 1 - Math.pow(ageRatio, 2);
  const alpha = fadeIn * fadeOut * b.opacity;
  if (alpha < 0.01) return;

  // Wing flap — squish on X axis to simulate perspective tilt
  const wingFlap = Math.sin(b.wingPhase) * 0.35 + 0.65;

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(b.rotation);
  ctx.globalAlpha = alpha;

  const s = b.size;

  // Colours — soft gradient pinks
  const baseHsl = `hsl(${b.hue}, 72%, 78%)`;
  const deepHsl = `hsl(${b.hue - 8}, 65%, 65%)`;
  const lightHsl = `hsl(${b.hue + 12}, 85%, 90%)`;
  const spotHsl = `hsl(${b.hue + 20}, 90%, 95%)`;
  const edgeHsl = `hsl(${b.hue - 5}, 50%, 55%)`;

  // Helper: draw one side (mirror = 1 or -1)
  function drawWingSide(mirror: 1 | -1) {
    ctx.save();
    ctx.scale(mirror * wingFlap, 1);

    // === Upper forewing (large, rounded) ===
    const upperGrad = ctx.createRadialGradient(
      s * 0.7, -s * 0.4, 0,
      s * 0.7, -s * 0.4, s * 1.8
    );
    upperGrad.addColorStop(0, lightHsl);
    upperGrad.addColorStop(0.4, baseHsl);
    upperGrad.addColorStop(1, deepHsl);

    ctx.beginPath();
    ctx.moveTo(0, -s * 0.1);
    // Sweep up and out — graceful rounded curve
    ctx.bezierCurveTo(
      s * 0.3, -s * 1.0,    // control 1: up
      s * 1.4, -s * 1.3,    // control 2: out and up
      s * 1.5, -s * 0.6     // end: tip of upper wing
    );
    // Round the outer edge down
    ctx.bezierCurveTo(
      s * 1.55, -s * 0.2,   // control: round the tip
      s * 1.3, s * 0.15,    // control: sweep inward
      s * 0.5, s * 0.2      // end: bottom of upper wing
    );
    // Back to body
    ctx.bezierCurveTo(
      s * 0.25, s * 0.15,
      s * 0.1, s * 0.05,
      0, -s * 0.1
    );
    ctx.closePath();
    ctx.fillStyle = upperGrad;
    ctx.fill();

    // Thin edge outline
    ctx.strokeStyle = edgeHsl;
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = alpha * 0.4;
    ctx.stroke();
    ctx.globalAlpha = alpha;

    // Decorative eye-spot on upper wing
    ctx.beginPath();
    ctx.arc(s * 0.9, -s * 0.5, s * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = spotHsl;
    ctx.globalAlpha = alpha * 0.6;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.9, -s * 0.5, s * 0.10, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${b.hue + 30}, 90%, 98%)`;
    ctx.globalAlpha = alpha * 0.8;
    ctx.fill();
    ctx.globalAlpha = alpha;

    // === Lower hindwing (smaller, rounder, scalloped) ===
    const lowerGrad = ctx.createRadialGradient(
      s * 0.5, s * 0.5, 0,
      s * 0.5, s * 0.5, s * 1.2
    );
    lowerGrad.addColorStop(0, lightHsl);
    lowerGrad.addColorStop(0.5, baseHsl);
    lowerGrad.addColorStop(1, deepHsl);

    ctx.beginPath();
    ctx.moveTo(s * 0.1, s * 0.15);
    // Sweep out and down
    ctx.bezierCurveTo(
      s * 0.6, s * 0.1,
      s * 1.1, s * 0.3,
      s * 1.05, s * 0.7
    );
    // Scalloped bottom edge — two gentle bumps
    ctx.bezierCurveTo(
      s * 1.0, s * 0.9,
      s * 0.75, s * 1.05,
      s * 0.55, s * 0.95
    );
    ctx.bezierCurveTo(
      s * 0.35, s * 0.85,
      s * 0.2, s * 0.75,
      s * 0.05, s * 0.5
    );
    // Back up to body
    ctx.bezierCurveTo(
      s * 0.02, s * 0.35,
      s * 0.05, s * 0.2,
      s * 0.1, s * 0.15
    );
    ctx.closePath();
    ctx.fillStyle = lowerGrad;
    ctx.fill();

    ctx.strokeStyle = edgeHsl;
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = alpha * 0.35;
    ctx.stroke();
    ctx.globalAlpha = alpha;

    // Small spot on lower wing
    ctx.beginPath();
    ctx.arc(s * 0.6, s * 0.55, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = spotHsl;
    ctx.globalAlpha = alpha * 0.5;
    ctx.fill();
    ctx.globalAlpha = alpha;

    // Iridescent shimmer streak across upper wing
    const shimmer = ctx.createLinearGradient(
      s * 0.2, -s * 0.8,
      s * 1.2, -s * 0.2
    );
    shimmer.addColorStop(0, "rgba(255,255,255,0)");
    shimmer.addColorStop(0.4, `rgba(255,255,255,${0.18 * alpha})`);
    shimmer.addColorStop(0.6, `rgba(255,240,255,${0.12 * alpha})`);
    shimmer.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.1);
    ctx.bezierCurveTo(s * 0.3, -s * 1.0, s * 1.4, -s * 1.3, s * 1.5, -s * 0.6);
    ctx.bezierCurveTo(s * 1.55, -s * 0.2, s * 1.3, s * 0.15, s * 0.5, s * 0.2);
    ctx.bezierCurveTo(s * 0.25, s * 0.15, s * 0.1, s * 0.05, 0, -s * 0.1);
    ctx.closePath();
    ctx.fillStyle = shimmer;
    ctx.fill();

    ctx.restore();
  }

  // Draw both sides
  drawWingSide(1);
  drawWingSide(-1);

  // === Slender body ===
  ctx.globalAlpha = alpha * 0.7;
  ctx.beginPath();
  ctx.ellipse(0, s * 0.15, s * 0.06, s * 0.45, 0, 0, Math.PI * 2);
  ctx.fillStyle = edgeHsl;
  ctx.fill();

  // === Delicate antennae ===
  ctx.globalAlpha = alpha * 0.5;
  ctx.strokeStyle = edgeHsl;
  ctx.lineWidth = 0.6;
  ctx.lineCap = "round";
  // Left antenna
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.25);
  ctx.quadraticCurveTo(-s * 0.3, -s * 0.9, -s * 0.45, -s * 1.0);
  ctx.stroke();
  // Tiny ball at tip
  ctx.beginPath();
  ctx.arc(-s * 0.45, -s * 1.0, s * 0.04, 0, Math.PI * 2);
  ctx.fillStyle = baseHsl;
  ctx.fill();
  // Right antenna
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.25);
  ctx.quadraticCurveTo(s * 0.3, -s * 0.9, s * 0.45, -s * 1.0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(s * 0.45, -s * 1.0, s * 0.04, 0, Math.PI * 2);
  ctx.fillStyle = baseHsl;
  ctx.fill();

  // === Soft sparkle glow around the butterfly ===
  ctx.globalAlpha = alpha * 0.2;
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.2);
  glow.addColorStop(0, `hsla(${b.hue}, 80%, 85%, 0.4)`);
  glow.addColorStop(1, `hsla(${b.hue}, 80%, 85%, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, s * 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function ButterflyTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const butterflies: Butterfly[] = [];
    let mouseX = -100;
    let mouseY = -100;
    let lastSpawn = 0;
    let animId: number;
    let mouseActive = false;

    function resize() {
      const dpr = Math.min(devicePixelRatio, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let lastTime = performance.now();

    function frame() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx!.clearRect(0, 0, w, h);

      // Spawn new butterfly
      if (mouseActive && now - lastSpawn > SPAWN_INTERVAL && butterflies.length < MAX_BUTTERFLIES) {
        lastSpawn = now;
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 80;
        butterflies.push({
          x: mouseX + Math.cos(angle) * radius,
          y: mouseY + Math.sin(angle) * radius,
          age: 0,
          maxAge: 2200 + Math.random() * 1800,
          size: 5 + Math.random() * 7,
          rotation: (Math.random() - 0.5) * 0.8,
          rotSpeed: (Math.random() - 0.5) * 1.5,
          driftX: (Math.random() - 0.5) * 40,
          driftY: -20 - Math.random() * 40,
          wobblePhase: Math.random() * Math.PI * 2,
          wobbleAmp: 15 + Math.random() * 25,
          hue: 320 + Math.random() * 35,
          opacity: 0.6 + Math.random() * 0.3,
          wingPhase: Math.random() * Math.PI * 2,
          wingSpeed: 6 + Math.random() * 6,
        });
      }

      // Update & draw
      for (let i = butterflies.length - 1; i >= 0; i--) {
        const b = butterflies[i]!;
        b.age += dt * 1000;
        if (b.age > b.maxAge) {
          butterflies.splice(i, 1);
          continue;
        }

        b.wobblePhase += dt * 3;
        b.wingPhase += b.wingSpeed * dt;
        b.x += b.driftX * dt + Math.sin(b.wobblePhase) * b.wobbleAmp * dt;
        b.y += b.driftY * dt;
        b.rotation += b.rotSpeed * dt;

        drawButterfly(ctx!, b);
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 99 }}
    />
  );
}
