import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Building2 } from "lucide-react";
import { TextEffect } from "@/components/ui/text-effect";
import { DotParticleCanvas } from "@/components/ui/dot-particles";

export interface TabItem {
  id: string;
  label: string;
  title: string;
  paragraphs: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const nexoraTabs: TabItem[] = [
  {
    id: "about",
    label: "About Nexora",
    title: "Acoustics engineered for the way people live and work.",
    paragraphs: [
      "At Nexora Acoustic Engineering Services, we specialize in acoustic consultancy, noise control, and sound engineering solutions for buildings and mechanical systems.",
      "We combine technical expertise, engineering knowledge, and practical project experience to develop effective solutions for residential, commercial, hospitality, entertainment, and industrial developments.",
      "Working closely with architects, MEP consultants, developers, contractors, and building owners, we integrate acoustic requirements into the design process and help deliver spaces with superior acoustic performance.",
    ],
    icon: Building2,
  },
  {
    id: "strategic-intent",
    label: "Our Strategic Intent",
    title: "Our Strategic Intent",
    paragraphs: [
      "Our Mission: To provide reliable, practical, and innovative acoustic engineering solutions that improve the comfort, performance, and quality of built environments.",
      "Our Vision: We aim to become a trusted acoustic engineering partner for modern buildings and infrastructure through technical excellence, responsive service, and practical solutions.",
      "By uniting predictive modeling, environmental acoustics, and rigorous engineering, we ensure that every structure achieves quiet compliance, occupant comfort, and long-term acoustic integrity.",
    ],
    icon: Target,
  },
];

export function NexoraSharedTabs() {
  const [activeTab, setActiveTab] = useState<TabItem>(nexoraTabs[0]);

  return (
    <div
      className="relative w-full max-w-[860px] mx-auto rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/82%)] backdrop-blur-md p-6 sm:p-10 md:p-12 shadow-sm overflow-hidden cursor-default group"
      data-testid="about-tabs-box"
    >
      {/* Interactive Dot Particle canvas effect inside the box (hover effect only) */}
      <DotParticleCanvas
        backgroundColor="transparent"
        particleColor="22, 166, 184"
        animationSpeed={0.006}
      />

      {/* Content wrapper with relative z-index so text remains crisp and interactive */}
      <div className="relative z-10">
        {/* Centered navigation tabs with Framer Motion shared layout indicator */}
        <div className="flex justify-center">
          <nav
            role="tablist"
            aria-label="Nexora information and philosophy"
            className="relative inline-flex items-center justify-center gap-1 sm:gap-2 border-b border-[hsl(var(--border))] pb-px"
          >
            {nexoraTabs.map((tab) => {
              const isSelected = activeTab.id === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-btn-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`tab-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab)}
                  data-testid={`tab-${tab.id}`}
                  className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 mono text-xs sm:text-[0.78rem] uppercase tracking-wider font-semibold transition-colors duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isSelected
                      ? "text-[hsl(var(--foreground))]"
                      : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 transition-colors ${
                      isSelected
                        ? "text-[hsl(var(--foreground))]"
                        : "text-[hsl(var(--muted-foreground))]"
                    }`}
                  />
                  <span>{tab.label}</span>

                  {/* Shared layout underline animation */}
                  {isSelected ? (
                    <motion.div
                      layoutId="nexora-tab-underline"
                      id="nexora-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[hsl(var(--foreground))]"
                      transition={{ type: "spring", stiffness: 450, damping: 38 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main tab animated content panel - centered container with justified text */}
        <div className="pt-8 sm:pt-10">
          <AnimatePresence mode="wait">
            <motion.article
              key={activeTab.id}
              role="tabpanel"
              id={`tab-panel-${activeTab.id}`}
              aria-labelledby={`tab-btn-${activeTab.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col items-center max-w-[720px] mx-auto"
            >
              {/* Heading with TextEffect */}
              <TextEffect
                key={`heading-${activeTab.id}`}
                per="word"
                as="h3"
                preset="slide"
                className="display text-[clamp(1.65rem,2.8vw,2.35rem)] leading-[1.15] tracking-[-0.02em] text-[hsl(var(--foreground))] text-center"
              >
                {activeTab.title}
              </TextEffect>

              {/* Justified Paragraphs */}
              <div className="mt-6 sm:mt-8 space-y-4 w-full">
                {activeTab.paragraphs.map((p, index) => (
                  <p
                    key={index}
                    className="text-[1.02rem] sm:text-[1.08rem] leading-relaxed text-[hsl(var(--muted-foreground))] text-justify [text-justify:inter-word]"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default NexoraSharedTabs;
