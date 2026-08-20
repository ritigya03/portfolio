/**
 * FluidCanvas — subtle WebGL fluid simulation for the hero section.
 *
 * Palette is locked to pink / rose / holographic-pearl tones only.
 * Rendered at low opacity so it never fights with existing content.
 * Skipped entirely when prefers-reduced-motion is set.
 *
 * Adapted from PavelDoGreat/WebGL-Fluid-Simulation (MIT)
 * and tkabalin/WebGL-Fluid-Background (MIT).
 */
import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Colour palette — only pink / blush / rose / iridescent pearl tones
// ---------------------------------------------------------------------------
const SPLAT_COLORS: [number, number, number][] = [
  [0.92, 0.42, 0.58],  // deep rose
  [0.88, 0.36, 0.55],  // berry pink
  [0.95, 0.50, 0.65],  // warm coral-pink
  [0.82, 0.30, 0.52],  // rich fuchsia
  [0.98, 0.55, 0.70],  // vivid rose
  [0.78, 0.38, 0.58],  // plum-pink
  [0.90, 0.45, 0.62],  // mauve rose
  [0.96, 0.60, 0.75],  // candy pink
];

function randomColor(): [number, number, number] {
  return SPLAT_COLORS[Math.floor(Math.random() * SPLAT_COLORS.length)] as [number, number, number];
}

// ---------------------------------------------------------------------------
// Shader sources
// ---------------------------------------------------------------------------
const BASE_VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const COPY_FRAG = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    gl_FragColor = texture2D(uTexture, vUv);
  }
`;

const DISPLAY_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    vec3 C = texture2D(uTexture, vUv).rgb;
    // slight brightness lift so the subtle pink hues glow
    C = max(C, 0.0);
    float a = max(C.r, max(C.g, C.b)) + 0.0001;
    C = C / a * (1.0 - exp(-a));
    gl_FragColor = vec4(C, 1.0);
  }
`;

const SPLAT_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    float splat = exp(-dot(p, p) / radius);
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat * color, 1.0);
  }
`;

const ADVECTION_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
    gl_FragColor.a = 1.0;
  }
`;

const DIVERGENCE_FRAG = `
  precision mediump float;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const PRESSURE_FRAG = `
  precision mediump float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float C = texture2D(uPressure, vUv).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const GRADIENT_SUBTRACT_FRAG = `
  precision mediump float;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// WebGL helpers
// ---------------------------------------------------------------------------
function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string
) {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, vertSrc));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(prog);
  return prog;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap: () => void;
}

function createFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number
): FBO {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    tex,
    0
  );
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return { texture: tex, fbo, width: w, height: h };
}

function createDoubleFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number
): DoubleFBO {
  let read = createFBO(gl, w, h, internalFormat, format, type, param);
  let write = createFBO(gl, w, h, internalFormat, format, type, param);
  return {
    get read() {
      return read;
    },
    get write() {
      return write;
    },
    swap() {
      [read, write] = [write, read];
    },
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip completely for reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    // Attempt to get float texture support (gracefully fallback to half-float / byte)
    const extHF = gl.getExtension("OES_texture_half_float");
    const extHFLin = gl.getExtension("OES_texture_half_float_linear");
    const halfFloat = extHF ? extHF.HALF_FLOAT_OES : null;
    const supportLinear = !!extHFLin;

    const RGBA = gl.RGBA;
    const texType = halfFloat ?? gl.UNSIGNED_BYTE;
    const filterMode = supportLinear ? gl.LINEAR : gl.NEAREST;

    // Resolution
    const SIM_RES = 128;
    const DYE_RES = 512;

    // Programs
    const copyProg = createProgram(gl, BASE_VERT, COPY_FRAG);
    const displayProg = createProgram(gl, BASE_VERT, DISPLAY_FRAG);
    const splatProg = createProgram(gl, BASE_VERT, SPLAT_FRAG);
    const advProg = createProgram(gl, BASE_VERT, ADVECTION_FRAG);
    const divProg = createProgram(gl, BASE_VERT, DIVERGENCE_FRAG);
    const pressureProg = createProgram(gl, BASE_VERT, PRESSURE_FRAG);
    const gradProg = createProgram(gl, BASE_VERT, GRADIENT_SUBTRACT_FRAG);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    const ibuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // FBOs
    let velocity = createDoubleFBO(
      gl,
      SIM_RES,
      SIM_RES,
      RGBA,
      RGBA,
      texType,
      filterMode
    );
    let dye = createDoubleFBO(gl, DYE_RES, DYE_RES, RGBA, RGBA, texType, filterMode);
    let divergence = createFBO(gl, SIM_RES, SIM_RES, RGBA, RGBA, texType, gl.NEAREST);
    let pressure = createDoubleFBO(
      gl,
      SIM_RES,
      SIM_RES,
      RGBA,
      RGBA,
      texType,
      gl.NEAREST
    );

    function bindTexture(slot: number, tex: WebGLTexture) {
      gl!.activeTexture(gl!.TEXTURE0 + slot);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
    }

    function blit(target: FBO | null) {
      if (target) {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
        gl!.viewport(0, 0, target.width, target.height);
      } else {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      const w = canvas!.width;
      const h = canvas!.height;
      // velocity
      gl!.useProgram(splatProg);
      gl!.uniform1i(gl!.getUniformLocation(splatProg, "uTarget"), 0);
      gl!.uniform1f(gl!.getUniformLocation(splatProg, "aspectRatio"), w / h);
      gl!.uniform2f(gl!.getUniformLocation(splatProg, "point"), x / w, 1.0 - y / h);
      gl!.uniform3f(gl!.getUniformLocation(splatProg, "color"), dx, -dy, 0.0);
      gl!.uniform1f(gl!.getUniformLocation(splatProg, "radius"), 0.002);
      bindTexture(0, velocity.read.texture);
      blit(velocity.write);
      velocity.swap();
      // dye
      gl!.uniform1i(gl!.getUniformLocation(splatProg, "uTarget"), 0);
      gl!.uniform3f(gl!.getUniformLocation(splatProg, "color"), ...color);
      gl!.uniform1f(gl!.getUniformLocation(splatProg, "radius"), 0.004);
      bindTexture(0, dye.read.texture);
      blit(dye.write);
      dye.swap();
    }

    function resize() {
      const w = Math.floor(canvas!.clientWidth * devicePixelRatio);
      const h = Math.floor(canvas!.clientHeight * devicePixelRatio);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
      }
    }

    resize();

    // Seed a few gentle splats spread across the canvas
    function seedInitialSplats() {
      const positions: [number, number][] = [
        [0.22, 0.38], [0.71, 0.25], [0.5, 0.65],
        [0.15, 0.70], [0.82, 0.60],
      ];
      positions.forEach(([rx, ry]: [number, number]) => {
        splat(
          rx * canvas!.width,
          ry * canvas!.height,
          (Math.random() - 0.5) * 350,
          (Math.random() - 0.5) * 350,
          randomColor() as [number, number, number]
        );
      });
    }
    seedInitialSplats();

    // Pointer tracking
    let pointerActive = false;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: MouseEvent | TouchEvent) => {
      let cx: number, cy: number;
      if ("touches" in e) {
        const t = e.touches[0];
        if (!t) return;
        cx = t.clientX;
        cy = t.clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }

      const dx = (cx - lastX) * 7;
      const dy = (cy - lastY) * 7;
      if (pointerActive && (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5)) {
        splat(cx, cy, dx, dy, randomColor());
      }
      lastX = cx;
      lastY = cy;
      pointerActive = true;
    };
    const onUp = () => { pointerActive = false; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);

    // Simulation loop
    let animId: number;
    let lastTime = performance.now();

    // Periodic auto-splats so it stays alive even without mouse
    let autoSplatTimer = 0;
    const AUTO_SPLAT_INTERVAL = 2200; // ms

    function step() {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;

      autoSplatTimer += now - (now - dt * 1000);
      autoSplatTimer += dt * 1000;
      if (autoSplatTimer >= AUTO_SPLAT_INTERVAL) {
        autoSplatTimer = 0;
        splat(
          Math.random() * canvas!.width,
          Math.random() * canvas!.height * 0.9,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          randomColor()
        );
      }

      resize();

      const simW = SIM_RES;
      const simH = SIM_RES;

      // Advect velocity
      gl!.useProgram(advProg);
      gl!.uniform2f(gl!.getUniformLocation(advProg, "texelSize"), 1 / simW, 1 / simH);
      gl!.uniform1i(gl!.getUniformLocation(advProg, "uVelocity"), 0);
      gl!.uniform1i(gl!.getUniformLocation(advProg, "uSource"), 0);
      gl!.uniform1f(gl!.getUniformLocation(advProg, "dt"), dt);
      gl!.uniform1f(gl!.getUniformLocation(advProg, "dissipation"), 0.98);
      bindTexture(0, velocity.read.texture);
      blit(velocity.write);
      velocity.swap();

      // Advect dye
      gl!.uniform2f(gl!.getUniformLocation(advProg, "texelSize"), 1 / DYE_RES, 1 / DYE_RES);
      gl!.uniform1i(gl!.getUniformLocation(advProg, "uVelocity"), 0);
      gl!.uniform1i(gl!.getUniformLocation(advProg, "uSource"), 1);
      gl!.uniform1f(gl!.getUniformLocation(advProg, "dissipation"), 0.986);
      bindTexture(0, velocity.read.texture);
      bindTexture(1, dye.read.texture);
      blit(dye.write);
      dye.swap();

      // Divergence
      gl!.useProgram(divProg);
      gl!.uniform2f(gl!.getUniformLocation(divProg, "texelSize"), 1 / simW, 1 / simH);
      gl!.uniform1i(gl!.getUniformLocation(divProg, "uVelocity"), 0);
      bindTexture(0, velocity.read.texture);
      blit(divergence);

      // Pressure
      gl!.useProgram(pressureProg);
      gl!.uniform2f(gl!.getUniformLocation(pressureProg, "texelSize"), 1 / simW, 1 / simH);
      gl!.uniform1i(gl!.getUniformLocation(pressureProg, "uPressure"), 0);
      gl!.uniform1i(gl!.getUniformLocation(pressureProg, "uDivergence"), 1);
      bindTexture(1, divergence.texture);
      for (let i = 0; i < 20; i++) {
        bindTexture(0, pressure.read.texture);
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      gl!.useProgram(gradProg);
      gl!.uniform2f(gl!.getUniformLocation(gradProg, "texelSize"), 1 / simW, 1 / simH);
      gl!.uniform1i(gl!.getUniformLocation(gradProg, "uPressure"), 0);
      gl!.uniform1i(gl!.getUniformLocation(gradProg, "uVelocity"), 1);
      bindTexture(0, pressure.read.texture);
      bindTexture(1, velocity.read.texture);
      blit(velocity.write);
      velocity.swap();

      // Display dye to canvas
      gl!.useProgram(displayProg);
      gl!.uniform1i(gl!.getUniformLocation(displayProg, "uTexture"), 0);
      bindTexture(0, dye.read.texture);
      blit(null);

      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ opacity: 0.4, mixBlendMode: "soft-light" }}
    />
  );
}
