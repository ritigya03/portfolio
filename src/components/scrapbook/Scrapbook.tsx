import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import fashion from "@/assets/scrap-fashion.jpg";
import nature from "@/assets/scrap-nature.jpg";
import rituals from "@/assets/scrap-rituals.jpg";
import objects from "@/assets/scrap-objects.jpg";

type Item =
  | { kind: "photo"; src: string; label: string; ratio: string; tilt: string }
  | { kind: "note"; text: string; tilt: string };

const COLUMNS: Item[][] = [
  [
    {
      kind: "photo",
      src: fashion,
      label: "fashion",
      ratio: "aspect-[4/5]",
      tilt: "rotate-2",
    },
    {
      kind: "note",
      text: "thinking about silk & circuit boards...",
      tilt: "-rotate-3",
    },
  ],
  [
    {
      kind: "photo",
      src: nature,
      label: "little moments",
      ratio: "aspect-[2/3]",
      tilt: "-rotate-1",
    },
  ],
  [
    {
      kind: "photo",
      src: rituals,
      label: "rituals",
      ratio: "aspect-square",
      tilt: "rotate-3",
    },
    {
      kind: "note",
      text: "collecting ideas like postcards ✦",
      tilt: "rotate-1",
    },
  ],
  [
    {
      kind: "photo",
      src: objects,
      label: "things i love",
      ratio: "aspect-[4/5]",
      tilt: "rotate-[5deg]",
    },
  ],
];

export function Scrapbook() {
  return (
    <section id="beyond" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="life outside the terminal 🎀"
          note="moments, inspiration, and small obsessions"
        />

        <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {COLUMNS.map((col, ci) => (
            <div
              key={ci}
              className={`space-y-5 md:space-y-6 ${
                ci === 1 ? "md:pt-12" : ci === 3 ? "md:pt-20" : ""
              }`}
            >
              {col.map((item, ii) =>
                item.kind === "photo" ? (
                  <Reveal key={ii} delay={ci * 0.06}>
                    <figure
                      className={`glass group relative rounded-3xl p-2 ${item.tilt} transition-transform duration-700 hover:rotate-0`}
                    >
                      <span className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-3 rounded-[2px] bg-pearl/70 shadow-sm" />
                      <img
                        src={item.src}
                        alt={item.label}
                        loading="lazy"
                        className={`w-full ${item.ratio} rounded-2xl object-cover transition-transform duration-[1200ms] ease-[var(--ease-dream)] group-hover:scale-[1.05]`}
                      />
                      <figcaption className="px-1 pb-1 pt-2 font-hand text-lg text-plum-muted">
                        {item.label}
                      </figcaption>
                    </figure>
                  </Reveal>
                ) : (
                  <Reveal key={ii} delay={ci * 0.06 + 0.05}>
                    <div
                      className={`glass rounded-3xl p-5 ${item.tilt} transition-transform duration-700 hover:rotate-0`}
                    >
                      <p className="font-hand text-lg text-accent-pink">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
