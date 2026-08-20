import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const SKILL_NAMES = [
  "JavaScript", "TypeScript", "React JS", "Node JS", "REST API", "Pathway",
  "Docker", "PyTorch", "OpenCV", "Data Science", "AI/ML", "DL", "FL",
  "Blockchain", "NLP", "GenAI", "Agentic AI", "DSA", "OOPS", "Python",
  "C", "CN", "OS", "DBMS", "AWS", "Firebase", "HTML", "CSS"
];

// Cloud Emojis to pick randomly
const CLOUDS = ["☁️"];

type Point3D = { x: number; y: number; z: number };

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Store base 3D coordinates
  const basePoints = useRef<Point3D[]>([]);
  // Store current rotation angles
  const rotation = useRef({ x: 0, y: 0 });
  // Target rotation speed based on mouse
  const targetSpeed = useRef({ x: 0.002, y: 0.002 });

  useEffect(() => {
    // Generate Fibonacci sphere points
    const count = SKILL_NAMES.length;
    // Radius of the sphere in pixels
    const R = window.innerWidth < 640 ? 130 : 200;

    basePoints.current = SKILL_NAMES.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      return {
        x: R * Math.cos(theta) * Math.sin(phi),
        y: R * Math.sin(theta) * Math.sin(phi),
        z: R * Math.cos(phi)
      };
    });

    let animationFrameId: number;

    const update = () => {
      // Smoothly drift towards target speed
      rotation.current.x += targetSpeed.current.x;
      rotation.current.y += targetSpeed.current.y;

      const sinX = Math.sin(rotation.current.x);
      const cosX = Math.cos(rotation.current.x);
      const sinY = Math.sin(rotation.current.y);
      const cosY = Math.cos(rotation.current.y);

      basePoints.current.forEach((point, i) => {
        // Rotate around Y
        const x1 = point.x * cosY - point.z * sinY;
        const z1 = point.z * cosY + point.x * sinY;

        // Rotate around X
        const y2 = point.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + point.y * sinX;

        // Apply to DOM
        const el = itemsRef.current[i];
        if (el) {
          // Calculate scale and opacity based on depth (z2)
          // z2 ranges from -R to R. 
          // We map z2 to scale: front (z2=R) gets larger, back (z2=-R) gets smaller
          const depth = (z2 + R) / (2 * R); // ranges from 0 to 1
          const scale = 0.5 + depth * 0.7; // scales from 0.5 to 1.2
          const opacity = 0.2 + depth * 0.8; // opacities from 0.2 to 1
          const zIndex = Math.round(depth * 100); // 0 to 100

          // Orthographic 2D projection using translate3d for hardware acceleration
          el.style.transform = `translate3d(${x1}px, ${y2}px, 0) scale(${scale})`;
          el.style.opacity = opacity.toString();
          el.style.zIndex = zIndex.toString();

          // Blur things in the far back
          el.style.filter = depth < 0.3 ? `blur(${2 - depth * 5}px)` : 'none';
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Adjust target speed based on mouse distance from center
    targetSpeed.current.x = -mouseY * 0.00005;
    targetSpeed.current.y = mouseX * 0.00005;
  };

  const handleMouseLeave = () => {
    // Return to default slow rotation
    targetSpeed.current.x = 0.002;
    targetSpeed.current.y = 0.002;
  };

  return (
    <section id="skills" className="relative overflow-hidden px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left Column: Tech Ecosystem Sphere */}
          <div>

            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative mx-auto mt-12 aspect-square w-[300px] sm:w-[450px] cursor-crosshair rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(125,211,252,0.15),transparent_70%)] shadow-[inset_0_0_80px_rgba(125,211,252,0.05)]"
            >
              {/* Origin Center Point */}
              <div className="absolute left-1/2 top-1/2" />

              {/* Cloud Nodes */}
              {SKILL_NAMES.map((skill, i) => (
                <div
                  key={skill}
                  ref={(el) => (itemsRef.current[i] = el)}
                  className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-[filter] duration-75 will-change-transform"
                >
                  {/* Giant Cloud Emoji Background */}
                  <span className="select-none text-[5rem] leading-none drop-shadow-md sm:text-[6.5rem]">
                    {CLOUDS[i % CLOUDS.length]}
                  </span>

                  {/* Overlaid Bold Text */}
                  <span className="absolute text-center text-[10px] font-extrabold uppercase tracking-widest text-black sm:text-[11px]">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: About Me */}
          <div className="flex flex-col justify-center pt-10 lg:pt-0">
            <SectionHeading title="about me ✧" align="left" note="the person behind the code" />
            <div className="glass mt-8 rounded-3xl p-8 text-sm leading-relaxed text-plum-muted sm:p-10 sm:text-base">
              <p className="mb-5">
                I'm Ritigya, a fourth year Computer Science student at LNMIIT, originally from Lucknow, Uttar Pradesh. I've explored everything from AI and Machine Learning, Data Science and cybersecurity to full stack development and Web3. I'm especially interested in the intersection of AI and security, and would love to build secure, intelligent systems in my career. But my dreams don't stop there, I'm a dreamer at heart and will always want to explore more.
              </p>
              <p className="mb-5">
                Technology is a big part of my everyday life. I love coding, starting new projects, experimenting with ideas, and learning simply because something caught my attention. I'm highly motivated, organised, and a bit of a workaholic. A good cup of coffee in one hand and my laptop in the other is probably my ideal setup.
              </p>
              <p>
                Outside of academics and work, I like staying healthy, taking care of myself, trying new things, and spending time with people I enjoy. ♡
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
