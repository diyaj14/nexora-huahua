import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

const DESKTOP_WIDTH = 1200;
const TABLET_MIN_WIDTH = 768;

const LEFT_DEPTH_MAX = 30;
const RIGHT_DEPTH_MAX = 40;
const DEPTH_MIN = -1;
const DEPTH_MAX = 1;
const Z_INDEX_MIN = 1;

const LEFT_ANGLE_OFFSET = Math.PI * 0.5;
const RIGHT_ANGLE_OFFSET = -Math.PI * 0.5;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
];

export interface CircularSplitRollItem {
  id?: string | number;
  title?: string;
  image?: string;
  alt?: string;
  number?: string;
  sub?: string;
  subtitle?: string;
  body?: string;
  description?: string;
  tags?: string;
  tag?: string;
  list?: string;
  badge?: string;
  details?: React.ReactNode;
}

const defaultItems: CircularSplitRollItem[] = [
  { id: 0, title: "Aperture", image: IMAGES[0], alt: "Aperture" },
  { id: 1, title: "Lumen", image: IMAGES[1], alt: "Lumen" },
  { id: 2, title: "Halcyon", image: IMAGES[2], alt: "Halcyon" },
  { id: 3, title: "Meridian", image: IMAGES[3], alt: "Meridian" },
  { id: 4, title: "Cascade", image: IMAGES[4], alt: "Cascade" },
  { id: 5, title: "Vertex", image: IMAGES[5], alt: "Vertex" },
  { id: 6, title: "Solace", image: IMAGES[6], alt: "Solace" },
  { id: 7, title: "Quill", image: IMAGES[7], alt: "Quill" },
  { id: 8, title: "Ember", image: IMAGES[8], alt: "Ember" },
  { id: 9, title: "Drift", image: IMAGES[9], alt: "Drift" },
];

function wrapProgress(value: number) {
  let wrappedValue = value % 1;

  if (wrappedValue < 0) {
    wrappedValue += 1;
  }

  return wrappedValue;
}

function getCircularPosition(
  progress: number,
  radiusX: number,
  radiusY: number,
  angleOffset = 0
) {
  const angle = progress * Math.PI * 2 + angleOffset;

  return {
    angle,
    x: Math.sin(angle) * radiusX,
    y: Math.cos(angle) * radiusY,
    verticalDepth: Math.cos(angle),
    horizontalDepth: Math.sin(angle),
  };
}

function getStrength(value: number) {
  return gsap.utils.clamp(
    0,
    1,
    gsap.utils.mapRange(DEPTH_MIN, DEPTH_MAX, 0, 1, value)
  );
}

function shapeFocus(strength: number, start = 0.42, power = 2.8) {
  const normalized = gsap.utils.clamp(0, 1, (strength - start) / (1 - start));
  return Math.pow(normalized, power);
}

export interface CircularSplitRollCompProps {
  items?: CircularSplitRollItem[];
  className?: string;
  /** Optional background override. Falls back to the theme `bg-background`. */
  background?: string;
  /** Optional title color override. Falls back to the theme `text-foreground`. */
  titleColor?: string;
  sectionHeight?: number;
  leftRadiusX?: number;
  leftRadiusY?: number;
  rightRadiusX?: number;
  rightRadiusY?: number;
  imageCardWidth?: number;
  imageCardHeight?: number;
  titleSize?: string;
  pinSpacing?: boolean;
  scrub?: number;
  textCenterScale?: number;
  textSideScale?: number;
  textCenterOpacity?: number;
  textSideOpacity?: number;
  imageCenterScale?: number;
  imageSideScale?: number;
  imageCenterOpacity?: number;
  imageSideOpacity?: number;
  textFocusStart?: number;
  textFocusPower?: number;
  imageFocusStart?: number;
  imageFocusPower?: number;
  /** Angle (radians) on the circle where a title comes into focus. */
  leftAngleOffset?: number;
  /** Angle (radians) on the circle where an image comes into focus. */
  rightAngleOffset?: number;
  /** Which item sits on the focus arc, in item-fractions. 0.5 = between two, 0 = on one. */
  focusPhase?: number;
  /** Max z-index applied to the focused title / image (depth stacking). */
  leftDepthMax?: number;
  rightDepthMax?: number;
  /** Column horizontal offset: translateX(calc(<columnSpreadVw>vw - <columnOffsetPx>px)). */
  columnSpreadVw?: number;
  columnOffsetPx?: number;
  gridImageClassName?: string;
  gridCardClassName?: string;
  gridTitleClassName?: string;
  renderDetail?: (item: CircularSplitRollItem, index: number) => React.ReactNode;
  renderTitle?: (item: CircularSplitRollItem, index: number) => React.ReactNode;
}

export function CircularSplitRollComp({
  items = defaultItems,
  className = "",
  background,
  titleColor,
  sectionHeight = 260,

  leftRadiusX = 220,
  leftRadiusY = 220,
  rightRadiusX = 400,
  rightRadiusY = 400,

  imageCardWidth = 190,
  imageCardHeight = 210,
  titleSize = "clamp(28px, 3vw, 56px)",

  pinSpacing = true,
  scrub = 1.2,

  textCenterScale = 1,
  textSideScale = 0.68,
  textCenterOpacity = 1,
  textSideOpacity = 0.18,

  imageCenterScale = 1,
  imageSideScale = 0.58,
  imageCenterOpacity = 1,
  imageSideOpacity = 0.14,

  textFocusStart = 0.42,
  textFocusPower = 2.6,
  imageFocusStart = 0.45,
  imageFocusPower = 3.2,

  leftAngleOffset = Math.PI * 0.5,
  rightAngleOffset = -Math.PI * 0.5,
  focusPhase = 0,
  leftDepthMax = 30,
  rightDepthMax = 40,
  columnSpreadVw = 5,
  columnOffsetPx = 500,

  gridImageClassName = "",
  gridCardClassName = "",
  gridTitleClassName = "",
  renderDetail,
  renderTitle,
}: CircularSplitRollCompProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const safeItems = useMemo(() => {
    return items.map((item, index) => ({
      id: item.id ?? index,
      title: item.title ?? `Item ${index + 1}`,
      image: item.image ?? "",
      alt: item.alt ?? item.title ?? `Item ${index + 1}`,
      number: item.number,
      sub: item.sub,
      subtitle: item.subtitle,
      body: item.body,
      description: item.description,
      tags: item.tags,
      tag: item.tag,
      list: item.list,
      badge: item.badge,
      details: item.details,
    }));
  }, [items]);

  useEffect(() => {
    if (!rootRef.current || !stickyRef.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        if (!rootRef.current) return;
        const leftNodes = gsap.utils.toArray(
          rootRef.current.querySelectorAll(".circular-scroll-showcase__left-item")
        ) as HTMLElement[];
        const rightNodes = gsap.utils.toArray(
          rootRef.current.querySelectorAll(".circular-scroll-showcase__right-item")
        ) as HTMLElement[];

        const total = safeItems.length;

        if (!total) return;

        gsap.set([...leftNodes, ...rightNodes], { opacity: 1 });

        const render = (scrollProgress: number) => {
          progressRef.current = scrollProgress;

          const width =
            typeof window !== "undefined" ? window.innerWidth : DESKTOP_WIDTH;

          let factor = 1;

          if (width < DESKTOP_WIDTH && width >= TABLET_MIN_WIDTH) {
            factor = width / DESKTOP_WIDTH;
          }

          const leftRadiusScaledX = leftRadiusX * factor;
          const leftRadiusScaledY = leftRadiusY * factor;
          const rightRadiusScaledX = rightRadiusX * factor;
          const rightRadiusScaledY = rightRadiusY * factor;

          if (rootRef.current) {
            rootRef.current.style.setProperty(
              "--css-card-width",
              `${imageCardWidth * factor}px`
            );

            rootRef.current.style.setProperty(
              "--css-card-height",
              `${imageCardHeight * factor}px`
            );
          }

          leftNodes.forEach((node, index) => {
            const localProgress = wrapProgress(index / total - scrollProgress + focusPhase / total);

            const position = getCircularPosition(
              localProgress,
              leftRadiusScaledX,
              leftRadiusScaledY,
              leftAngleOffset
            );

            const rawStrength = getStrength(position.horizontalDepth);
            const focusStrength = shapeFocus(
              rawStrength,
              textFocusStart,
              textFocusPower
            );

            const scale = gsap.utils.interpolate(
              textSideScale,
              textCenterScale,
              focusStrength
            );

            const opacity = gsap.utils.interpolate(
              textSideOpacity,
              textCenterOpacity,
              focusStrength
            );

            const zIndex = Math.round(
              gsap.utils.interpolate(Z_INDEX_MIN, leftDepthMax, focusStrength)
            );

            gsap.set(node, {
              x: position.x,
              y: position.y,
              xPercent: -50,
              yPercent: -50,
              scale,
              opacity,
              zIndex,
              transformOrigin: "50% 50%",
            });
          });

          rightNodes.forEach((node, index) => {
            const localProgress = wrapProgress(index / total - scrollProgress + focusPhase / total);

            const position = getCircularPosition(
              localProgress,
              rightRadiusScaledX,
              rightRadiusScaledY,
              rightAngleOffset
            );

            const rawStrength = getStrength(-position.horizontalDepth);
            const focusStrength = shapeFocus(
              rawStrength,
              imageFocusStart,
              imageFocusPower
            );

            const scale = gsap.utils.interpolate(
              imageSideScale,
              imageCenterScale,
              focusStrength
            );

            const opacity = gsap.utils.interpolate(
              imageSideOpacity,
              imageCenterOpacity,
              focusStrength
            );

            const zIndex = Math.round(
              gsap.utils.interpolate(Z_INDEX_MIN, rightDepthMax, focusStrength)
            );

            gsap.set(node, {
              x: position.x,
              y: position.y,
              scale,
              opacity,
              zIndex,
              transformOrigin: "50% 50%",
            });
          });
        };

        render(0);

        const scrollTrigger = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: `+=${sectionHeight * safeItems.length}%`,
          pin: stickyRef.current,
          scrub,
          pinSpacing,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            render(self.progress);
          },
        });

        const onResize = () => {
          render(progressRef.current);
          scrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          scrollTrigger.kill();
        };
      }, rootRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [
    safeItems,
    scrub,
    pinSpacing,
    sectionHeight,
    leftRadiusX,
    leftRadiusY,
    rightRadiusX,
    rightRadiusY,
    imageCardWidth,
    imageCardHeight,
    textCenterScale,
    textSideScale,
    textCenterOpacity,
    textSideOpacity,
    imageCenterScale,
    imageSideScale,
    imageCenterOpacity,
    imageSideOpacity,
    textFocusStart,
    textFocusPower,
    imageFocusStart,
    imageFocusPower,
    leftAngleOffset,
    rightAngleOffset,
    focusPhase,
    leftDepthMax,
    rightDepthMax,
  ]);

  return (
    <section
      ref={rootRef}
      className={`relative min-h-screen w-full overflow-clip ${background ? "" : "bg-background"} ${titleColor ? "" : "text-foreground"} ${className}`}
      style={{
        "--css-title-size": titleSize,
        "--css-card-width": `${imageCardWidth}px`,
        "--css-card-height": `${imageCardHeight}px`,
        ...(background ? { background } : null),
        ...(titleColor ? { color: titleColor } : null),
      } as React.CSSProperties & Record<string, string | number>}
    >
      <div
        ref={stickyRef}
        aria-hidden="true"
        className={`relative h-screen w-full overflow-hidden ${reducedMotion ? "hidden" : "max-[1025px]:hidden"}`}
      >
        <div className="relative mx-auto flex h-full w-full">
          {/* Left Side: Circular Rolling Headings */}
          <div
            className="relative flex h-full w-[50vw] items-center justify-center"
            style={{ transform: `translateX(calc(${columnSpreadVw}vw - ${columnOffsetPx}px))` }}
          >
            <div className="relative h-[78vh] w-full flex items-center justify-center">
              {safeItems.map((item, index) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__left-item pointer-events-none absolute left-1/2 top-1/2 w-[520px] max-w-[90vw] origin-center text-center font-bold leading-tight tracking-[-0.03em] opacity-0 will-change-[transform,opacity] select-none"
                  style={{ fontSize: `var(--css-title-size, ${titleSize})` }}
                >
                  {renderTitle ? (
                    renderTitle(item, index)
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4">
                      {item.number && (
                        <span className="mono text-[0.72rem] tracking-[0.26em] uppercase text-[hsl(var(--accent))] mb-2 block font-semibold">
                          Service {item.number}
                        </span>
                      )}
                      <span className="display block drop-shadow-sm">
                        {item.title}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Circular Rolling Detail Boxes */}
          <div
            className="relative flex h-full w-[50vw] items-center justify-center"
            style={{ transform: `translateX(calc(${columnOffsetPx}px - ${columnSpreadVw}vw))` }}
          >
            <div className="relative h-[78vh] w-full flex items-center justify-center">
              {safeItems.map((item, index) => (
                <div
                  key={item.id}
                  className="circular-scroll-showcase__right-item absolute left-1/2 top-1/2 ml-[calc(var(--css-card-width,210px)*-0.5)] mt-[calc(var(--css-card-height,210px)*-0.5)] h-[var(--css-card-height,210px)] w-[var(--css-card-width,210px)] origin-center opacity-0 will-change-[transform,opacity] pointer-events-auto"
                >
                  {renderDetail ? (
                    renderDetail(item, index)
                  ) : item.description || item.body || item.subtitle || item.sub ? (
                    <div className="service-card group/card h-full w-full p-6 sm:p-7 flex flex-col justify-between text-left select-none relative overflow-hidden rounded-2xl bg-[#081b2b] border border-[rgba(220,231,235,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#16a6b8]/80 hover:shadow-[0_16px_36px_-8px_rgba(8,27,43,0.5),0_0_0_1px_rgba(22,166,184,0.4)]">
                      <div className="relative z-10">
                        <h4 className="display text-lg sm:text-xl font-bold leading-snug text-white transition-colors group-hover/card:text-[#a9dfe4]">
                          {item.subtitle || item.sub || item.title}
                        </h4>
                        <p className="mt-3 text-xs sm:text-[0.85rem] text-[#d0e0e4] leading-relaxed">
                          {item.description || item.body}
                        </p>
                      </div>
                      {(item.tags || item.tag || item.list) && (
                        <div className="relative z-10 pt-3 border-t border-[rgba(220,231,235,0.15)]">
                          <span className="mono text-[0.66rem] text-[#a9dfe4] leading-tight block">
                            {item.tags || item.tag || item.list}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="service-card group/card h-full w-full p-6 flex flex-col justify-center text-left relative overflow-hidden rounded-2xl bg-[#081b2b] border border-[rgba(220,231,235,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#16a6b8]/80 hover:shadow-[0_16px_36px_-8px_rgba(8,27,43,0.5),0_0_0_1px_rgba(22,166,184,0.4)]">
                      <h4 className="display relative z-10 text-xl font-bold text-white transition-colors group-hover/card:text-[#a9dfe4]">
                        {item.title}
                      </h4>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Accessible Fallback Grid */}
      <div className={`w-full px-5 py-12 max-md:px-4 max-md:py-8 ${reducedMotion ? "block" : "sr-only max-[1025px]:not-sr-only max-[1025px]:block"}`}>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-6 max-md:gap-5">
          {safeItems.map((item) => (
            <article
              key={item.id}
              className={`service-card group/card p-6 sm:p-7 flex flex-col justify-between text-left relative overflow-hidden rounded-2xl bg-[#081b2b] border border-[rgba(220,231,235,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#16a6b8]/80 hover:shadow-[0_16px_36px_-8px_rgba(8,27,43,0.5),0_0_0_1px_rgba(22,166,184,0.4)] ${gridCardClassName}`}
            >
              <div className="relative z-10">
                <h3 className={`display text-xl font-bold leading-tight text-white transition-colors group-hover/card:text-[#a9dfe4] ${gridTitleClassName}`}>
                  {item.subtitle || item.sub || item.title}
                </h3>
                {(item.description || item.body) && (
                  <p className="mt-3 text-sm text-[#d0e0e4] leading-relaxed">
                    {item.description || item.body}
                  </p>
                )}
              </div>
              {(item.tags || item.tag || item.list) && (
                <div className="relative z-10 mt-4 pt-3 border-t border-[rgba(220,231,235,0.15)]">
                  <span className="mono text-xs text-[#a9dfe4]">
                    {item.tags || item.tag || item.list}
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export interface CircularSplitRollProps
  extends Omit<
    CircularSplitRollCompProps,
    "leftRadiusX" | "leftRadiusY" | "rightRadiusX" | "rightRadiusY" | "imageCardWidth" | "imageCardHeight"
  > {
  /** Sets all four arc radii at once (leftRadiusX/Y, rightRadiusX/Y). */
  radius?: number;
  /** Sets both card dimensions at once (imageCardWidth/Height). */
  cardSize?: number;
  cardWidth?: number;
  cardHeight?: number;
  leftRadiusX?: number;
  leftRadiusY?: number;
  rightRadiusX?: number;
  rightRadiusY?: number;
  imageCardWidth?: number;
  imageCardHeight?: number;
}

export default function CircularSplitRoll({
  items = defaultItems,
  radius = 500,
  cardSize = 205,
  cardWidth,
  cardHeight,
  sectionHeight = 100,
  leftRadiusX,
  leftRadiusY,
  rightRadiusX,
  rightRadiusY,
  imageCardWidth,
  imageCardHeight,
  ...rest
}: CircularSplitRollProps) {
  const finalCardWidth = imageCardWidth ?? cardWidth ?? cardSize;
  const finalCardHeight = imageCardHeight ?? cardHeight ?? cardSize;

  return (
    <CircularSplitRollComp
      items={items}
      sectionHeight={sectionHeight}
      leftRadiusX={leftRadiusX ?? radius}
      leftRadiusY={leftRadiusY ?? radius}
      rightRadiusX={rightRadiusX ?? radius}
      rightRadiusY={rightRadiusY ?? radius}
      imageCardWidth={finalCardWidth}
      imageCardHeight={finalCardHeight}
      {...rest}
    />
  );
}
