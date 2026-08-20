import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import fashion from "@/assets/hobby-fashion.png";
import painting from "@/assets/hobby-painting.jpeg";
import dancing from "@/assets/hobby-dancing.jpeg";
import reading from "@/assets/hobby-reading.jpeg";
import travelling from "@/assets/hobby-travelling.jpeg";

type Item =
  | { kind: "photo"; src: string; label: string; ratio: string; tilt: string }
  | { kind: "note"; text: string; tilt: string };

const COLUMNS: Item[][] = [
  [
    {
      kind: "photo",
      src: painting,
      label: "painting",
      ratio: "aspect-[4/5]",
      tilt: "rotate-2",
    },
    {
      kind: "note",
      text: "color palettes & canvases ✦",
      tilt: "-rotate-3",
    },
  ],
  [
    {
      kind: "photo",
      src: dancing,
      label: "dancing",
      ratio: "aspect-[2/3]",
      tilt: "-rotate-1",
    },
  ],
  [
    {
      kind: "photo",
      src: fashion,
      label: "fashion",
      ratio: "aspect-square",
      tilt: "rotate-3",
    },
  ],
  [
    {
      kind: "photo",
      src: reading,
      label: "reading",
      ratio: "aspect-square",
      tilt: "rotate-3",
    },
    {
      kind: "note",
      text: "getting lost in new worlds ✦",
      tilt: "rotate-1",
    },
  ],
  [
    {
      kind: "photo",
      src: travelling,
      label: "travelling",
      ratio: "aspect-[4/5]",
      tilt: "rotate-[5deg]",
    },
  ],
];

export function Scrapbook() {
  return (
    <section id="beyond" className="relative overflow-hidden px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="life outside the terminal"
          note="moments, inspiration, and small obsessions"
        />

        <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-5 md:gap-6">
          {COLUMNS.map((col, ci) => (
            <div
              key={ci}
              className={`space-y-5 md:space-y-6 ${
                ci % 2 === 1 ? "md:pt-12" : ci === 2 ? "md:pt-6" : ""
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
