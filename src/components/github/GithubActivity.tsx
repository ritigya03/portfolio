import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GithubActivity() {
  // Custom pink theme to match the portfolio's aesthetic
  const customTheme = {
    light: [
      "rgba(247, 37, 133, 0.1)", // Level 0: empty
      "#ff8da1",                 // Level 1: light
      "#ff477e",                 // Level 2: medium
      "#f72585",                 // Level 3: deep
      "#7209b7",                 // Level 4: intense
    ],
    dark: [
      "rgba(247, 37, 133, 0.1)",
      "#ff8da1",
      "#ff477e",
      "#f72585",
      "#7209b7",
    ],
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section id="open-source" className="relative px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="contributions ✦" align="center" />

        <Reveal className="mt-12">
          <div className="glass-strong mx-auto flex flex-col items-center justify-center overflow-x-auto rounded-4xl p-8 shadow-sm sm:p-14">
            <GitHubCalendar
              username="ritigya03"
              theme={customTheme}
              colorScheme={isDark ? "dark" : "light"}
              blockSize={18}
              blockMargin={6}
              fontSize={15}
              style={{ color: "var(--color-plum-deep)" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
