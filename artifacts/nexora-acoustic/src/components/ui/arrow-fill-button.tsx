// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_HREF = "#";
const COMPACT_LAYOUT_BREAKPOINT = 1280;
const ANIMATION_DURATION_MS = 450;

export interface ArrowFillButtonOwnProps {
  btnText?: string;
  label?: string;
  href?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  fillBgColor?: string;
  fillTextColor?: string;
  hoverFillBgColor?: string;
  hoverFillTextColor?: string;
  arrowColor?: string;
  hoverArrowColor?: string;
  animationDuration?: number;
  fillOnHover?: boolean;
  arrowDirection?: "left" | "right";
  variant?: "primary" | "copper" | "quiet" | "accent" | "default";
  size?: "sm" | "default" | "lg" | "vault";
  as?: "a" | "button";
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  children?: ReactNode;
}

export type ArrowFillButtonProps = ArrowFillButtonOwnProps &
  Omit<
    ComponentPropsWithoutRef<"a"> & ComponentPropsWithoutRef<"button">,
    keyof ArrowFillButtonOwnProps
  >;

// Website-aligned color presets matching Nexora Acoustic theme
// Primary uses deep architectural navy (#081b2b) with vibrant acoustic cyan (#16a6b8) fill on hover, exactly matching the website's brand colors
const VARIANT_COLORS = {
  primary: {
    bgColor: "#081b2b", // Deep architectural navy
    textColor: "#ffffff",
    fillBgColor: "#16a6b8", // Vibrant acoustic cyan indicator
    fillTextColor: "#ffffff",
    hoverFillBgColor: "#16a6b8", // Vibrant acoustic cyan on hover
    hoverFillTextColor: "#ffffff",
    arrowColor: "#ffffff",
    hoverArrowColor: "#ffffff",
  },
  default: {
    bgColor: "#081b2b",
    textColor: "#ffffff",
    fillBgColor: "#16a6b8",
    fillTextColor: "#ffffff",
    hoverFillBgColor: "#16a6b8",
    hoverFillTextColor: "#ffffff",
    arrowColor: "#ffffff",
    hoverArrowColor: "#ffffff",
  },
  copper: {
    bgColor: "#16a6b8", // Vibrant acoustic cyan
    textColor: "#ffffff",
    fillBgColor: "#081b2b", // Deep architectural navy
    fillTextColor: "#ffffff",
    hoverFillBgColor: "#081b2b",
    hoverFillTextColor: "#ffffff",
    arrowColor: "#ffffff",
    hoverArrowColor: "#ffffff",
  },
  accent: {
    bgColor: "#16a6b8", // Vibrant acoustic cyan
    textColor: "#ffffff",
    fillBgColor: "#081b2b", // Deep architectural navy
    fillTextColor: "#ffffff",
    hoverFillBgColor: "#081b2b",
    hoverFillTextColor: "#ffffff",
    arrowColor: "#ffffff",
    hoverArrowColor: "#ffffff",
  },
  quiet: {
    bgColor: "#f3f7f9", // Crisp light ice surface
    textColor: "#081b2b", // Deep architectural navy text
    fillBgColor: "#ffffff",
    fillTextColor: "#081b2b",
    hoverFillBgColor: "#081b2b",
    hoverFillTextColor: "#ffffff",
    arrowColor: "#081b2b",
    hoverArrowColor: "#ffffff",
  },
};

export function ArrowFillButton({
  btnText,
  label,
  href,
  className = "",
  variant = "primary",
  size = "default",
  arrowDirection = "right",
  as,
  type,
  children,

  bgColor: userBgColor,
  textColor: userTextColor,

  fillBgColor: userFillBgColor,
  fillTextColor: userFillTextColor,

  hoverFillBgColor: userHoverFillBgColor,
  hoverFillTextColor: userHoverFillTextColor,

  arrowColor: userArrowColor,
  hoverArrowColor: userHoverArrowColor,

  ...props
}: ArrowFillButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const releaseTimeoutRef = useRef<number | null>(null);

  // Determine display text from btnText, label, or children
  const displayText =
    btnText ??
    label ??
    (typeof children === "string" ? children : undefined) ??
    "Hover Me";

  // Resolve colors aligned to website with user overrides
  const variantConfig = VARIANT_COLORS[variant] || VARIANT_COLORS.primary;
  const bgColor = userBgColor ?? variantConfig.bgColor;
  const textColor = userTextColor ?? variantConfig.textColor;
  const fillBgColor = userFillBgColor ?? variantConfig.fillBgColor;
  const fillTextColor = userFillTextColor ?? variantConfig.fillTextColor;
  const hoverFillBgColor =
    userHoverFillBgColor ?? variantConfig.hoverFillBgColor;
  const hoverFillTextColor =
    userHoverFillTextColor ?? variantConfig.hoverFillTextColor;
  const arrowColor = userArrowColor ?? variantConfig.arrowColor;
  const hoverArrowColor = userHoverArrowColor ?? variantConfig.hoverArrowColor;

  const usesUtilityBackground =
    className.includes("bg-") ||
    className.includes("from-") ||
    className.includes("via-") ||
    className.includes("to-");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${COMPACT_LAYOUT_BREAKPOINT - 1}px)`,
    );

    const syncCompactLayout = (event: MediaQueryList | MediaQueryListEvent) => {
      const matches =
        "matches" in event
          ? event.matches
          : ((event as any).currentTarget as MediaQueryList).matches;
      setIsCompactLayout(matches);

      if (!matches) {
        setIsPressed(false);
      }
    };

    syncCompactLayout(mediaQuery);
    mediaQuery.addEventListener("change", syncCompactLayout);

    return () => {
      mediaQuery.removeEventListener("change", syncCompactLayout);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current) {
        window.clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

  const clearPressedState = () => {
    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
    }

    releaseTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      releaseTimeoutRef.current = null;
    }, ANIMATION_DURATION_MS);
  };

  const handlePointerDown = (event: PointerEvent<any>) => {
    props.onPointerDown?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }

    setIsPressed(true);
  };

  const handlePointerUp = (event: PointerEvent<any>) => {
    props.onPointerUp?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  const handlePointerCancel = (event: PointerEvent<any>) => {
    props.onPointerCancel?.(event);

    if (!isCompactLayout || event.pointerType === "mouse") {
      return;
    }

    clearPressedState();
  };

  // Size styling variants
  let sizeClasses = "";
  let iconSizeClass = "";
  const isLeftArrow = arrowDirection === "left";

  if (size === "sm") {
    sizeClasses = isLeftArrow
      ? "h-[38px] pl-[46px] pr-4 text-[0.72rem] tracking-[0.08em] uppercase font-mono [--icon-circle:28px] [--icon-right:5px] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[38px] max-[1025px]:pl-[46px] max-[1025px]:pr-4 max-[1025px]:text-[0.72rem] max-[1025px]:[--icon-circle:28px] max-[1025px]:[--icon-right:5px] max-md:h-[38px] max-md:pl-[46px] max-md:pr-4 max-md:text-[0.72rem] max-md:[--icon-circle:28px] max-md:[--icon-right:5px]"
      : "h-[38px] px-4 pr-[46px] text-[0.72rem] tracking-[0.08em] uppercase font-mono [--icon-circle:28px] [--icon-right:5px] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[38px] max-[1025px]:px-4 max-[1025px]:pr-[46px] max-[1025px]:text-[0.72rem] max-[1025px]:[--icon-circle:28px] max-[1025px]:[--icon-right:5px] max-md:h-[38px] max-md:px-4 max-md:pr-[46px] max-md:text-[0.72rem] max-md:[--icon-circle:28px] max-md:[--icon-right:5px]";
    iconSizeClass = "size-3.5 max-[1025px]:size-3.5 max-md:size-3.5";
  } else if (size === "default") {
    sizeClasses = isLeftArrow
      ? "h-[48px] sm:h-[52px] pl-[58px] sm:pl-[64px] pr-6 sm:pr-7 text-[0.85rem] sm:text-[0.92rem] tracking-[0.03em] font-medium [--icon-circle:36px] sm:[--icon-circle:40px] [--icon-right:6px] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[48px] max-[1025px]:pl-[58px] max-[1025px]:pr-6 max-[1025px]:text-[0.88rem] max-[1025px]:[--icon-circle:36px] max-[1025px]:[--icon-right:6px] max-md:h-[48px] max-md:pl-[58px] max-md:pr-6 max-md:text-[0.86rem] max-md:[--icon-circle:36px] max-md:[--icon-right:6px]"
      : "h-[48px] sm:h-[52px] px-6 sm:px-7 pr-[58px] sm:pr-[64px] text-[0.85rem] sm:text-[0.92rem] tracking-[0.03em] font-medium [--icon-circle:36px] sm:[--icon-circle:40px] [--icon-right:6px] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[48px] max-[1025px]:px-6 max-[1025px]:pr-[58px] max-[1025px]:text-[0.88rem] max-[1025px]:[--icon-circle:36px] max-[1025px]:[--icon-right:6px] max-md:h-[48px] max-md:px-6 max-md:pr-[58px] max-md:text-[0.86rem] max-md:[--icon-circle:36px] max-md:[--icon-right:6px]";
    iconSizeClass = "size-4 sm:size-4.5 max-[1025px]:size-4 max-md:size-4";
  } else if (size === "lg") {
    sizeClasses = isLeftArrow
      ? "h-[56px] sm:h-[62px] pl-[70px] sm:pl-[78px] pr-8 sm:pr-9 text-[0.96rem] sm:text-[1.05rem] tracking-[0.03em] font-medium [--icon-circle:44px] sm:[--icon-circle:48px] [--icon-right:7px] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[56px] max-[1025px]:pl-[70px] max-[1025px]:pr-8 max-[1025px]:text-[0.98rem] max-[1025px]:[--icon-circle:44px] max-[1025px]:[--icon-right:7px] max-md:h-[54px] max-md:pl-[68px] max-md:pr-7 max-md:text-[0.95rem] max-md:[--icon-circle:42px] max-md:[--icon-right:6px]"
      : "h-[56px] sm:h-[62px] px-8 sm:px-9 pr-[70px] sm:pr-[78px] text-[0.96rem] sm:text-[1.05rem] tracking-[0.03em] font-medium [--icon-circle:44px] sm:[--icon-circle:48px] [--icon-right:7px] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[56px] max-[1025px]:px-8 max-[1025px]:pr-[70px] max-[1025px]:text-[0.98rem] max-[1025px]:[--icon-circle:44px] max-[1025px]:[--icon-right:7px] max-md:h-[54px] max-md:px-7 max-md:pr-[68px] max-md:text-[0.95rem] max-md:[--icon-circle:42px] max-md:[--icon-right:6px]";
    iconSizeClass = "size-4.5 sm:size-5 max-[1025px]:size-4.5 max-md:size-4.5";
  } else {
    // Viewport-scaled sizing
    sizeClasses = isLeftArrow
      ? "h-[4.2vw] px-[3vw] pl-[calc(var(--icon-circle)+var(--icon-right)+2vw)] text-[1.155vw] [--icon-circle:3.1vw] [--icon-right:0.55vw] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[11vw] max-[1025px]:px-[5vw] max-[1025px]:pl-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-[1025px]:text-[3.15vw] max-[1025px]:[--icon-circle:8vw] max-[1025px]:[--icon-right:1.5vw] max-md:h-[15vw] max-md:px-[7vw] max-md:pl-[calc(var(--icon-circle)+var(--icon-right)+5vw)] max-md:text-[4.41vw] max-md:[--icon-circle:11vw] max-md:[--icon-right:2vw]"
      : "h-[4.2vw] px-[3vw] pr-[calc(var(--icon-circle)+var(--icon-right)+2vw)] text-[1.155vw] [--icon-circle:3.1vw] [--icon-right:0.55vw] [--circle-inset-y:calc((100%-var(--icon-circle))/2)] max-[1025px]:h-[11vw] max-[1025px]:px-[5vw] max-[1025px]:pr-[calc(var(--icon-circle)+var(--icon-right)+4vw)] max-[1025px]:text-[3.15vw] max-[1025px]:[--icon-circle:8vw] max-[1025px]:[--icon-right:1.5vw] max-md:h-[15vw] max-md:px-[7vw] max-md:pr-[calc(var(--icon-circle)+var(--icon-right)+5vw)] max-md:text-[4.41vw] max-md:[--icon-circle:11vw] max-md:[--icon-right:2vw]";
    iconSizeClass = "size-[1.5vw] max-[1025px]:size-[4vw] max-md:size-[5vw]";
  }

  const isFullWidth = className.includes("w-full");
  const widthClasses = isFullWidth ? "w-full" : "w-fit min-w-fit max-w-none";

  const baseClassName = cn(
    "group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[var(--btn-bg)] whitespace-nowrap leading-none [text-rendering:geometricPrecision] shadow-xs",
    `arrow-fill-btn--${variant}`,
    widthClasses,
    usesUtilityBackground ? "" : "bg-[var(--btn-bg)]",
    "text-[var(--btn-text)]",
    sizeClasses,
    "transition-[border-color,box-shadow] duration-450 group-hover:border-[hsl(var(--border))] group-data-[pressed=true]:border-[hsl(var(--border))]",
    className
  );

  const buttonStyle = {
    "--btn-bg": bgColor,
    "--btn-text": textColor,
    "--btn-fill-bg": fillBgColor,
    "--btn-fill-text": fillTextColor,
    "--btn-fill-bg-hover": hoverFillBgColor,
    "--btn-fill-text-hover": hoverFillTextColor,
    "--btn-arrow": arrowColor || fillTextColor,
    "--btn-arrow-hover": hoverArrowColor || hoverFillTextColor,
    visibility: isReady ? "visible" : "hidden",
  } as CSSProperties & Record<string, string | number>;

  // Expanding inset based on arrow direction (left or right)
  const restingCircleInset = isLeftArrow
    ? "inset-[var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))_var(--circle-inset-y)_var(--icon-right)]"
    : "inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))]";

  const restingCircleClip = isLeftArrow
    ? "[clip-path:inset(var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))_var(--circle-inset-y)_var(--icon-right))]"
    : "[clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle)))]";

  const innerElements = (
    <>
      <span className="relative z-1 pb-px">{displayText}</span>

      {/* Expanding circle background on hover */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute z-2 rounded-full bg-[var(--btn-fill-bg)] ${restingCircleInset} ${
          isReady
            ? "transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:bg-[var(--btn-fill-bg-hover)] group-hover:inset-0 group-data-[pressed=true]:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]:inset-0"
            : ""
        }`}
      />

      {/* Text reveal clipped to circle expanding on hover */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-2 flex items-center ${
          isFullWidth ? "justify-center !px-0" : isLeftArrow ? "justify-start pl-[inherit] pr-[inherit]" : "justify-start px-[inherit] pr-[inherit]"
        } text-[var(--btn-fill-text)] ${restingCircleClip} ${
          isReady
            ? "transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:text-[var(--btn-fill-text-hover)] group-hover:[clip-path:inset(0_0_0_0)] group-data-[pressed=true]:text-[var(--btn-fill-text-hover)] group-data-[pressed=true]:[clip-path:inset(0_0_0_0)]"
            : ""
        }`}
      >
        <span className="relative z-1 pb-px whitespace-nowrap">{displayText}</span>
      </div>

      {/* Arrow circle indicator */}
      <span
        className={`pointer-events-none absolute ${
          isLeftArrow ? "left-[var(--icon-right)]" : "right-[var(--icon-right)]"
        } top-1/2 z-3 inline-flex h-[var(--icon-circle)] w-[var(--icon-circle)] shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-[var(--btn-fill-bg)] text-[var(--btn-arrow)] ${
          isReady
            ? "transition-colors duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:bg-[var(--btn-fill-bg-hover)] group-hover:text-[var(--btn-arrow-hover)] group-data-[pressed=true]:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]:text-[var(--btn-arrow-hover)]"
            : ""
        }`}
        style={{
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          maskImage: "radial-gradient(white, black)",
        }}
        aria-hidden="true"
      >
        {isLeftArrow ? (
          <>
            <ArrowLeft
              className={`absolute left-1/2 top-1/2 ${iconSizeClass} translate-x-[70%] -translate-y-1/2 origin-center scale-0 text-current ${
                isReady
                  ? "transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100 group-data-[pressed=true]:-translate-x-1/2 group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-100"
                  : ""
              }`}
              strokeWidth={1.8}
            />
            <ArrowLeft
              className={`absolute left-1/2 top-1/2 ${iconSizeClass} -translate-x-1/2 -translate-y-1/2 origin-center text-current ${
                isReady
                  ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:translate-x-[-170%] group-hover:-translate-y-1/2 group-hover:scale-0 group-data-[pressed=true]:translate-x-[-170%] group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-0"
                  : ""
              }`}
              strokeWidth={1.8}
            />
          </>
        ) : (
          <>
            <ArrowRight
              className={`absolute left-1/2 top-1/2 ${iconSizeClass} translate-x-[-170%] -translate-y-1/2 origin-center scale-0 text-current ${
                isReady
                  ? "transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100 group-data-[pressed=true]:-translate-x-1/2 group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-100"
                  : ""
              }`}
              strokeWidth={1.8}
            />
            <ArrowRight
              className={`absolute left-1/2 top-1/2 ${iconSizeClass} -translate-x-1/2 -translate-y-1/2 origin-center text-current ${
                isReady
                  ? "transition-transform duration-[450ms] ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:translate-x-[70%] group-hover:-translate-y-1/2 group-hover:scale-0 group-data-[pressed=true]:translate-x-[70%] group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-0"
                  : ""
              }`}
              strokeWidth={1.8}
            />
          </>
        )}
      </span>
    </>
  );

  // Render as anchor if href is provided and not explicit button
  const isAnchor = Boolean(href) && as !== "button" && !type;

  if (isAnchor) {
    return (
      <a
        href={href || DEFAULT_HREF}
        {...(props as ComponentPropsWithoutRef<"a">)}
        data-pressed={isPressed ? "true" : "false"}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={baseClassName}
        style={buttonStyle}
      >
        {innerElements}
      </a>
    );
  }

  return (
    <button
      type={type || "button"}
      {...(props as ComponentPropsWithoutRef<"button">)}
      data-pressed={isPressed ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={baseClassName}
      style={buttonStyle}
    >
      {innerElements}
    </button>
  );
}

export default ArrowFillButton;
