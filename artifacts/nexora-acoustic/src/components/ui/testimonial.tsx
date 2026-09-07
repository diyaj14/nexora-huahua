import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ArrowFillButton } from '@/components/ui/arrow-fill-button';

// --- Helper Components & Data ---

// All text data and images are the updated versions.
export const testimonials = [
  {
    quote:
      "This platform revolutionized our data analysis process. The speed and accuracy are unparalleled. A must-have for any data-driven team.",
    name: "Priya Sharma",
    designation: "Data Scientist at QuantumLeap",
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    quote:
      "The user interface is incredibly intuitive, which made the onboarding process for my team a breeze. We were up and running in hours, not days.",
    name: "Marcus Johnson",
    designation: "Head of Operations at Synergy Corp",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    quote:
      "Customer support is top-notch. They are responsive, knowledgeable, and genuinely invested in our success. It feels like a true partnership.",
    name: "Isabella Rossi",
    designation: "Client Success Manager at Horizon",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
  },
  {
    quote:
      "I'm impressed by the constant stream of updates and new features. The development team is clearly passionate and listens to user feedback.",
    name: "Kenji Tanaka",
    designation: "Software Engineer at CodeCrafters",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    quote:
      "The ROI was almost immediate. It streamlined our workflows so effectively that we cut project delivery times by nearly 30%.",
    name: "Fatima Al-Jamil",
    designation: "CFO at Apex Financial",
    src: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  tag?: string;
  badge?: string;
};

// --- Main Animated Testimonials Component ---
// This is the core component that handles the animation and logic.
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className = "",
  themeAware = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
  themeAware?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = React.useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5500);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  const isActive = (index: number) => index === active;

  const randomRotate = () => `${Math.floor(Math.random() * 8) - 4}deg`;

  return (
    <div
      className={
        className ||
        "mx-auto max-w-sm px-4 py-16 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12"
      }
    >
      <div className="relative grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-16 lg:gap-x-20">
        {/* Image Section */}
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-full max-w-xs sm:h-96 sm:max-w-sm">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src + index}
                  initial={{ opacity: 0, scale: 0.9, y: 50, rotate: randomRotate() }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.45,
                    scale: isActive(index) ? 1 : 0.92,
                    y: isActive(index) ? 0 : 20,
                    zIndex: isActive(index)
                      ? testimonials.length + 1
                      : testimonials.length - Math.abs(index - active),
                    rotate: isActive(index) ? '0deg' : randomRotate(),
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                  style={{ perspective: '1000px' }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] shadow-xl bg-[hsl(var(--card))]">
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={600}
                      height={600}
                      draggable={false}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Text and Controls Section - strictly heading followed by plain text */}
        <div className="flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col justify-between"
            >
              <div>
                <h3
                  className="display text-[clamp(1.85rem,3.2vw,3.15rem)] leading-[1.08] tracking-[-0.02em] font-bold text-[hsl(var(--foreground))]"
                  style={{ fontFamily: 'var(--app-font-heading)' }}
                >
                  {testimonials[active].name}
                </h3>
                <p className="mt-6 text-[1.02rem] sm:text-[1.08rem] leading-relaxed text-[hsl(var(--muted-foreground))] max-w-[520px]">
                  {testimonials[active].quote}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-3 border-t border-[hsl(var(--border))] pt-6">
            <ArrowFillButton
              type="button"
              onClick={handlePrev}
              variant="primary"
              arrowDirection="left"
              size="sm"
              btnText="Prev"
              aria-label="Previous card"
              data-testid="button-sectors-prev"
            />
            <ArrowFillButton
              type="button"
              onClick={handleNext}
              variant="primary"
              size="sm"
              btnText="Next"
              aria-label="Next card"
              data-testid="button-sectors-next"
            />
            <span className="mono ml-auto text-[0.72rem] tracking-wider text-[hsl(var(--muted-foreground))]">
              {String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Demo Component ---
export function AnimatedTestimonialsDemo() {
  return <AnimatedTestimonials testimonials={testimonials} />;
}

// --- Main App Component ---
// This is the root of our application demo.
export function Component() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Animated grid background with 10% opacity */}
      <style>
        {`
          @keyframes animate-grid {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          .animated-grid {
            width: 200%;
            height: 200%;
            background-image: 
              linear-gradient(to right, #e2e8f0 1px, transparent 1px), 
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
            background-size: 3rem 3rem;
            animation: animate-grid 40s linear infinite alternate;
          }
          .dark .animated-grid {
            background-image: 
              linear-gradient(to right, #1e293b 1px, transparent 1px), 
              linear-gradient(to bottom, #1e293b 1px, transparent 1px);
          }
        `}
      </style>
      <div className="animated-grid absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />

      {/* Content */}
      <div className="z-10">
        <AnimatedTestimonialsDemo />
      </div>
    </div>
  );
}

export default Component;
