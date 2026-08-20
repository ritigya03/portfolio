import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Line = { type: "input" | "output" | "error" | "system"; text: string };

const PROMPT_USER = "ritigya";
const PROMPT_HOST = "portfolio";
const PROMPT_DIR = "~";

const COMMANDS: Record<string, () => string> = {
  whoami: () =>
    `Ritigya Gupta\n4th year Computer Science student @ LNMIIT\nLucknow, Uttar Pradesh\n\ncurious mind · builder · dreamer · coffee lover`,
  about: () =>
    `A curious CSE student who loves learning, building,\nand exploring whatever catches my attention.\n\nCurrently fascinated by AI + security and the idea\nof building intelligent, secure systems.\n\nStill dreaming bigger. Always will be.`,
  pwd: () => "/home/ritigya",
  hostname: () => "portfolio.ritigya.dev",
  uname: () => "Portfolio OS 1.0.0 x86_64",
  date: () => new Date().toString(),
  echo: () => "",
  ls: () =>
    `\x1b[34mprojects\x1b[0m   \x1b[34mexperience\x1b[0m   \x1b[34mskills\x1b[0m   \x1b[34mhobbies\x1b[0m\n\x1b[32mREADME.md\x1b[0m  \x1b[32mresume.pdf\x1b[0m   \x1b[32mcontact.txt\x1b[0m`,
  cat: () => "cat: missing file operand\nTry 'cat README.md'",
  "cat README.md": () =>
    `# Ritigya Gupta\n\nDeveloper · Builder · Curious Mind\n\nCurrently open to exciting opportunities.\nReach out at ritigya00003@gmail.com`,
  "cat contact.txt": () =>
    `GitHub:   https://github.com/ritigya03\nLinkedIn: https://linkedin.com/in/ritigya-gupta\nEmail:    ritigya00003@gmail.com\nDevpost:  https://devpost.com/ritigya03`,
  help: () =>
    `Usage: <command> [options]\n\nCommands:\n  whoami              who am i?\n  about               a little about me\n  stack               things i build with\n  status              what i'm up to\n  goals               where i'm headed\n  hobbies             things i keep picking up\n  books               what's on my bookshelf\n  potterhead          my Hogwarts side\n  fun                 random facts about me\n  contact             how to find me\n  clear               clear the terminal\n  help                show this help\n  ls                  list directory contents\n  pwd                 print working directory\n  uname               system info\n  hostname            host name\n  date                current date and time\n  history             command history`,
  status: () =>
    `● building things I find interesting\n● learning DSA + system design\n● exploring AI, security & intelligent systems\n● looking for interesting opportunities & collaborations\n● probably planning my next project\n● coffee level: sufficient ☕`,
  stack: () =>
    `AI / ML        → PyTorch · OpenCV · NLP · GenAI\nDevelopment    → Python · TypeScript · React · Next.js\nBackend        → Node.js · REST APIs · Docker · AWS\nSecurity       → Cybersecurity · Secure Systems\nWeb3           → Blockchain · Smart Contracts\nData           → SQL · Data Science · Real-time Systems`,
  goals: () =>
    `→ build secure and intelligent systems\n→ keep growing in AI + cybersecurity\n→ turn more ideas into real products\n→ keep learning outside my comfort zone\n→ build a career I'm genuinely excited about`,
  hobbies: () =>
    `current hobbies:\n\n♡ painting\n♡ dancing\n♡ reading\n♡ fashion\n♡ discovering new things\n♡ collecting random interests\n\nwarning:\nhobbies tend to multiply without notice.`,
  books: () =>
    `genre.exe is currently running...\n\n→ crime & psychological thrillers\n→ Dan Brown mysteries\n→ fantasy\n→ technology & AI\n→ autobiographies\n→ literary fiction\n\nfavourites / authors:\n\nFreida McFadden\nDan Brown\nKhaled Hosseini\nSatoshi Yagisawa\n\ncurrent reading status:\nalways looking for the next book.`,
  potterhead: () =>
    `Hogwarts status: permanently enrolled.\n\nhouse: Hufflepuff \nfavorite spell: Riddikulus or maybe Sectumsempra\nloyalty: to the wizarding world\ncurrent status: still waiting for my Hogwarts letter\n\nmischief managed.`,
  fun: () =>
    `→ I code better with coffee.\n→ I can get obsessed with a new hobby very quickly.\n→ I love picking up completely random interests.\n→ I'm happiest when I'm learning or building something.\n→ I can be extremely studious when I want to be.\n→ I love fashion just as much as technology.\n→ I'm a Potterhead.\n→ I probably have another project idea in my notes right now.`,
  contact: () =>
    `GitHub:   https://github.com/ritigya03\nLinkedIn: https://linkedin.com/in/ritigya-gupta\nEmail:    ritigya00003@gmail.com\nDevpost:  https://devpost.com/ritigya03`,
  "sudo become_a_better_version": () =>
    `[sudo] password for ritigya: ********\n\nAccess granted.\n\n→ learn more\n→ build more\n→ dream bigger\n→ stay curious\n→ repeat`,
  fortune: () => `in search of beauty within the shadows`,
  clear: () => "__CLEAR__",
};

function parseAnsi(text: string) {
  // Very basic ANSI color parsing for display
  const parts = text.split(/(\x1b\[\d+m)/g);
  let color = "";
  return parts.map((part, i) => {
    if (part === "\x1b[34m") { color = "#60a5fa"; return null; }
    if (part === "\x1b[32m") { color = "#4ade80"; return null; }
    if (part === "\x1b[0m") { color = ""; return null; }
    if (part.match(/^\x1b\[/)) return null;
    return <span key={i} style={color ? { color } : {}}>{part}</span>;
  });
}

const BOOT_LINES: Line[] = [
  { type: "system", text: "Last login: " + new Date().toDateString() },
  { type: "output", text: "" },
];

export function Currently() {
  const [lines, setLines] = useState<Line[]>(BOOT_LINES);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [blink, setBlink] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  const run = (cmd: string) => {
    const trimmed = cmd.trim();
    const lower = trimmed.toLowerCase();

    const inputLine: Line = { type: "input", text: trimmed };

    if (!trimmed) {
      setLines((prev) => [...prev, inputLine, { type: "output", text: "" }]);
      return;
    }

    if (lower === "clear") {
      setLines(BOOT_LINES);
      return;
    }

    if (lower === "history") {
      const histText = cmdHistory.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`).join("\n");
      setLines((prev) => [
        ...prev,
        inputLine,
        { type: "output", text: histText || "  (no history)" },
        { type: "output", text: "" },
      ]);
      return;
    }

    // handle echo "..."
    if (lower.startsWith("echo ")) {
      const rest = trimmed.slice(5).replace(/^["']|["']$/g, "");
      setLines((prev) => [
        ...prev,
        inputLine,
        { type: "output", text: rest },
        { type: "output", text: "" },
      ]);
      return;
    }

    const fn = COMMANDS[lower] ?? COMMANDS[lower.split(" ")[0]!];

    if (!fn) {
      setLines((prev) => [
        ...prev,
        inputLine,
        {
          type: "error",
          text: `-bash: ${trimmed}: command not found`,
        },
        { type: "output", text: "" },
      ]);
      return;
    }

    const result = fn();
    const outputLines = result.split("\n").map((t) => ({ type: "output" as const, text: t }));
    setLines((prev) => [
      ...prev,
      inputLine,
      ...outputLines,
      { type: "output", text: "" },
    ]);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (input.trim()) setCmdHistory((h) => [input.trim(), ...h]);
      run(input);
      setInput("");
      setHistoryIdx(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(idx);
      setInput(cmdHistory[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? "" : (cmdHistory[idx] ?? ""));
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines(BOOT_LINES);
    }
  };

  const theme = isDark
    ? {
        titleBg: "#1e1e2e",
        bodyBg: "#13131f",
        titleText: "#6b7280",
        outputText: "#a5b4c8",
        inputText: "#e2e8f0",
        cursorBg: "#e2e8f0",
        promptUser: "#4ade80",
        promptMeta: "#94a3b8",
        promptHost: "#60a5fa",
        promptDir: "#c084fc",
        errorText: "#f87171",
        systemText: "#6b7280",
      }
    : {
        titleBg: "#f9a8d4",
        bodyBg: "#fdf2f8",
        titleText: "#9d174d",
        outputText: "#6b2151",
        inputText: "#831843",
        cursorBg: "#db2777",
        promptUser: "#be185d",
        promptMeta: "#f472b6",
        promptHost: "#9333ea",
        promptDir: "#ec4899",
        errorText: "#e11d48",
        systemText: "#f472b6",
      };

  const Prompt = ({ dim = false }: { dim?: boolean }) => (
    <span className={dim ? "opacity-40" : ""}>
      <span style={{ color: theme.promptUser }}>{PROMPT_USER}</span>
      <span style={{ color: theme.promptMeta }}>@</span>
      <span style={{ color: theme.promptHost }}>{PROMPT_HOST}</span>
      <span style={{ color: theme.promptMeta }}>:</span>
      <span style={{ color: theme.promptDir }}>{PROMPT_DIR}</span>
      <span style={{ color: theme.promptMeta }}>$</span>
      <span>&nbsp;</span>
    </span>
  );

  return (
    <section id="now" className="relative px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <SectionHeading title="terminal ✦" note="type 'help' to explore" />

        <Reveal className="mt-10">
          <div
            className="overflow-hidden rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
            onClick={() => inputRef.current?.focus()}
            style={{ cursor: "text" }}
          >
            {/* macOS-style title bar */}
            <div
              style={{ background: theme.titleBg }}
              className="flex items-center gap-0 border-b border-black/5 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="size-3 rounded-full" style={{ background: "#febc2e" }} />
                <div className="size-3 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <div className="flex-1 text-center font-mono text-xs" style={{ color: theme.titleText }}>
                {PROMPT_USER} — bash — 80×24
              </div>
            </div>

            {/* Terminal body */}
            <div
              style={{ background: theme.bodyBg, fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
              className="min-h-[calc(8*1.5rem+2rem)] max-h-[calc(20*1.5rem+2rem)] overflow-y-auto px-5 py-4 text-[13px] leading-6"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  {line.type === "input" && (
                    <>
                      <Prompt />
                      <span style={{ color: theme.inputText }}>{line.text}</span>
                    </>
                  )}
                  {line.type === "system" && (
                    <span style={{ color: theme.systemText }}>{line.text}</span>
                  )}
                  {line.type === "output" && (
                    <span style={{ color: theme.outputText }} className="whitespace-pre-wrap">
                      {line.text.includes("\x1b[") ? parseAnsi(line.text) : line.text}
                    </span>
                  )}
                  {line.type === "error" && (
                    <span style={{ color: theme.errorText }}>{line.text}</span>
                  )}
                </div>
              ))}

              {/* Active input line */}
              <div className="flex items-center">
                <Prompt />
                <span style={{ color: theme.inputText }}>{input}</span>
                <span
                  style={{
                    background: theme.cursorBg,
                    width: "8px",
                    height: "16px",
                    display: "inline-block",
                    marginLeft: "1px",
                    opacity: blink ? 1 : 0,
                    transition: "opacity 0.1s",
                  }}
                />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Terminal input"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                    width: 0,
                    height: 0,
                  }}
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
