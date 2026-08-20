import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard, type Project } from "./ProjectCard";
import { ScrollConstellation } from "@/components/effects/ScrollConstellation";

import p1 from "@/assets/project1.png";
import p2 from "@/assets/project2.png";
import p3 from "@/assets/project3.png";
import p4 from "@/assets/project4.png";
import p5 from "@/assets/project5.png";
import p6 from "@/assets/project6.png";
import p7 from "@/assets/project7.png";
import p8 from "@/assets/project8.png";

const PROJECTS: Project[] = [
  {
    title: "CASPER CRED IQ",
    subtitle: "AI × Blockchain × Credentials",
    description: "An AI-gated, blockchain-secured digital credential infrastructure for fraud-resistant, instantly revocable, and privacy-preserving trust.",
    longDescription: "CasperCredIQ is a next-generation digital trust infrastructure that solves the problem of credential fraud and delayed revocation by evaluating trust before it is made permanent.\n\nIt features a dual-trust architecture: an AI verification layer first assesses if a credential request is legitimate, providing a confidence score and justification. Only validated credentials are then minted on the Casper Blockchain using Odra smart contracts, ensuring they are cryptographically verifiable, instantly revocable, and fully auditable without exposing PII on-chain.\n\nBuilt as a solo project for the Frostbyte Hackathon, CasperCredIQ provides a scalable, privacy-preserving infrastructure ideal for education, hiring, healthcare, and decentralized governance.",
    tags: ["AI", "Blockchain", "Next.js", "TypeScript", "Rust", "Casper"],
    image: p1,
    github: "https://github.com/ritigya03/CasperCredIQ",
    devpost: "https://devpost.com/software/caspercrediq",
  },
  {
    title: "SentinelChain",
    subtitle: "AI / Live Intelligence",
    description: "A real-time intelligence and compliance platform utilizing adaptive RAG and streaming data fusion to detect supply chain and reputational risks.",
    longDescription: "SentinelChain is a real-time intelligence and compliance monitoring platform built to solve the 'knowledge gap' in traditional RAG systems. Designed for global operations, it processes live data streams to detect geopolitical, operational, and reputational risks as they happen.\n\nIt features three core modules accessible via a unified dashboard: real-time supply chain threat monitoring, a Google Drive-integrated compliance engine, and news stream analysis for reputational threats. The system utilizes an 'Adaptive RAG' pipeline, incorporating hybrid search (KNN + BM25) and Gemini 2.0 Flash for complex reasoning and threat validation.\n\nBuilt on a high-performance streaming architecture with Pathway, FastAPI microservices, and Docker Compose, SentinelChain transforms static data into a living intelligence sentinel, enabling instantaneous, AI-powered decision-making.",
    tags: ["AI", "RAG", "Data Streaming", "FastAPI"],
    image: p2,
    github: "https://github.com/ritigya03/Pathway",
    devpost: "https://devpost.com/software/pathu",
  },
  {
    title: "Cardiotrust FL",
    subtitle: "Federated Learning / Healthcare",
    description: "A blockchain-based, differentially private federated learning framework that enables secure, collaborative healthcare analytics across untrusted hospitals.",
    longDescription: "CardioTrust FL is a blockchain-orchestrated federated learning framework designed to enable secure collaboration across mutually untrusted hospitals without sharing raw patient data.\n\nIt addresses critical issues in real-world healthcare analytics like severe institutional class imbalance and last-mover manipulation. The system employs a commit-reveal protocol governed by an Ethereum smart contract to bind hospitals to cryptographically secure updates, while Differential Privacy (DP-SGD) prevents patient data leakage.\n\nBy utilizing balance-weighted aggregation with focal loss, CardioTrust FL neutralizes the influence of institutions with extreme class imbalance. Every step is recorded permanently on-chain, providing an immutable audit trail and balancing predictive performance, privacy, and verifiable decentralized trust.",
    tags: ["Machine Learning", "Federated Learning", "Healthcare", "Blockchain"],
    image: p3,
  },
  {
    title: "ProofOfCarbon",
    subtitle: "Web3 / Sustainability",
    description: "A full-stack AI verification pipeline using geospatial intelligence, an XGBoost fraud classifier, and blockchain audit trails to detect greenwashing in carbon markets.",
    longDescription: "Proof of Carbon is a full-stack AI verification pipeline designed to fix the broken voluntary carbon market by producing cryptographically anchored trust verdicts in minutes. To combat rampant greenwashing and slow, manual audit cycles, the system takes a carbon credit project's geospatial file and returns a detailed verification report with an immutable on-chain audit hash.\n\nThe platform runs a five-agent AI pipeline combining geospatial data extraction, Google Earth Engine satellite evidence, deforestation baselines, and an XGBoost fraud detection model (99.75% accuracy). An LLM verifier reasons over all cross-signal features, while numeric outputs are hard-overridden by deterministic tools to prevent hallucination.\n\nTo ensure tamper-proof auditability with minimal gas costs, full reports are stored off-chain on IPFS, with only the content hash and metadata anchored via the Polygon Amoy testnet. By combining AI, satellite intelligence, and blockchain, Proof of Carbon provides a scalable, rigorous, and transparent trust layer for global climate finance.",
    tags: ["Blockchain", "Sustainability", "Web3"],
    image: p4,
    github: "https://github.com/ritigya03/ProofOfCarbon",
    devpost: "https://devpost.com/software/proof-of-carbon",
  },
  {
    title: "AetherGuard",
    subtitle: "Cybersecurity",
    description: "A network security and monitoring tool designed to protect digital assets, detect threats, and ensure network integrity.",
    longDescription: "AetherGuard is a comprehensive cybersecurity tool focused on safeguarding digital assets through advanced network monitoring.\n\nIt provides real-time visibility into network traffic, allowing users to proactively detect and mitigate potential threats before they escalate.\n\nDesigned for robustness and reliability, AetherGuard ensures network integrity and offers a secure environment for mission-critical operations.",
    tags: ["Security", "Network", "Monitoring"],
    image: p5,
    github: "https://github.com/ritigya03/AetherGuard",
  },
  {
    title: "Driving Assistance in Low Visibility",
    subtitle: "Computer Vision",
    description: "A real-time driver-assistance system using YOLOv12-s and camera calibration to detect objects and estimate distances in low-visibility conditions.",
    longDescription: "This real-time driver-assistance system is engineered to enhance road safety during challenging environmental conditions like heavy fog, dust, and nighttime driving.\n\nLeveraging the fast and lightweight YOLOv12-s model, it accurately detects vehicles, pedestrians, and animals in real time.\n\nCombined with a camera-calibrated distance estimation module based on pinhole geometry, the system provides immediate audio and visual alerts when obstacles enter a dangerous range.",
    tags: ["Computer Vision", "AI", "OpenCV"],
    image: p6,
    github: "https://github.com/ritigya03/Driving-Assistance-Low-Visibility",
    devpost: "https://devpost.com/software/ai-based-driving-assistance-for-low-visibility-path",
  },
  {
    title: "Santa's Study Sleigh",
    subtitle: "EdTech / Productivity",
    description: "A vibe-driven productivity app that turns studying into a festive journey with live backgrounds and an interactive 3D reward tree.",
    longDescription: "Santa's Study Sleigh reimagines the traditional pomodoro timer into a cozy, vibe-driven productivity experience designed to romanticize discipline.\n\nIt turns studying into a festive journey where tasks are gifts to be packed. As users complete their focused sessions, they visually progress through a beautifully crafted 3D environment.\n\nEventually, they unlock an interactive Christmas tree that can be controlled with real-time hand gestures. Built with Next.js, Three.js, and MediaPipe.",
    tags: ["Web App", "Education", "Productivity"],
    image: p7,
    github: "https://github.com/ritigya03/Santa-Study-Sleigh",
    devpost: "https://devpost.com/software/santa-s-study-sleigh",
  },
  {
    title: "MedXact",
    subtitle: "Healthcare Tech",
    description: "An AI-driven preventive healthcare assistant that analyzes medical reports to detect early health risks and provides personalized lifestyle recommendations.",
    longDescription: "MEDXact transforms healthcare from a reactive approach to a proactive, AI-driven system.\n\nIt intelligently analyzes uploaded medical reports to identify hidden trends, deficiencies, and early health risks. When danger signs emerge, the platform triggers smart alerts for both patients and doctors, preventing avoidable crises.\n\nBeyond diagnostics, MEDXact offers a comprehensive suite of features including a vaccine tracker, doctor appointment management, and personalized health guidance through a Mixtral-8x7B powered AI chatbot.",
    tags: ["Healthcare", "Data", "App"],
    image: p8,
    github: "https://github.com/ritigya03/MedXact_Hack4Health",
  },
];

const ITEMS_PER_PAGE = 2;
const TOTAL_PAGES = Math.ceil(PROJECTS.length / ITEMS_PER_PAGE);

export function Projects() {
  const [page, setPage] = useState(0);

  const nextPage = () => {
    setPage((prev) => (prev + 1) % TOTAL_PAGES);
  };

  const prevPage = () => {
    setPage((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
  };

  const currentProjects = PROJECTS.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <section id="work" className="relative px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          align="left"
          title="little things i've made ✦"
          note="a few technical and creative ventures"
        />

        <div className="mt-14 relative">
          
          {/* Carousel Viewport */}
          <div className="min-h-[600px] overflow-hidden px-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 50, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -50, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="grid gap-8 md:grid-cols-2"
              >
                {currentProjects.map((p, i) => (
                  <ProjectCard key={p.title} project={p} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-12 flex items-center justify-between lg:mt-16">
            
            {/* Left Button */}
            <button
              onClick={prevPage}
              className="glass flex size-12 items-center justify-center rounded-full text-plum-deep transition-transform hover:scale-110 active:scale-95"
              aria-label="Previous Projects"
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dot Indicators */}
            <div className="flex gap-3">
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`size-2.5 rounded-full transition-all duration-500 ${
                    page === i
                      ? "w-8 bg-accent-pink shadow-[0_0_12px_rgba(255,141,161,0.6)]"
                      : "bg-plum-muted/30 hover:bg-plum-muted/50"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={nextPage}
              className="glass flex size-12 items-center justify-center rounded-full text-plum-deep transition-transform hover:scale-110 active:scale-95"
              aria-label="Next Projects"
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </section>
  );
}
