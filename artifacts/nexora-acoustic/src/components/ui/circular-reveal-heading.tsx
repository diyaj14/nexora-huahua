import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

export interface TextItem {
  text: string;
  image?: string;
  number?: string;
  title?: string;
  summary?: string;
  description?: string;
  deliverables?: string;
}

export interface CircularRevealHeadingProps {
  items: TextItem[];
  centerText: React.ReactNode;
  renderActiveText?: (item: TextItem, index: number) => React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  activeItem?: number | null;
  onActiveChange?: (index: number | null) => void;
  variant?: 'theme' | 'classic';
  mode?: 'image' | 'text';
}

const sizeConfig = {
  sm: {
    container: 'h-[300px] w-[300px] sm:h-[340px] sm:w-[340px]',
    fontSize: 'text-[10px] sm:text-xs',
    tracking: 'tracking-[0.24em]',
    radius: 236,
    imageSize: 'w-[70%] h-[70%]',
    textStyle: 'font-medium',
    innerInset: 'inset-[48px] sm:inset-[54px]',
  },
  md: {
    container: 'h-[360px] w-[360px] sm:h-[420px] sm:w-[420px] lg:h-[460px] lg:w-[460px]',
    fontSize: 'text-[11px] sm:text-xs md:text-sm',
    tracking: 'tracking-[0.26em]',
    radius: 242,
    imageSize: 'w-[72%] h-[72%]',
    textStyle: 'font-medium',
    innerInset: 'inset-[56px] sm:inset-[68px]',
  },
  lg: {
    container: 'h-[420px] w-[420px] sm:h-[500px] sm:w-[500px]',
    fontSize: 'text-xs sm:text-sm md:text-base',
    tracking: 'tracking-[0.28em]',
    radius: 246,
    imageSize: 'w-[74%] h-[74%]',
    textStyle: 'font-medium',
    innerInset: 'inset-[64px] sm:inset-[76px]',
  },
  xl: {
    container: 'w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] md:w-[450px] md:h-[450px] lg:w-[480px] lg:h-[480px] xl:w-[520px] xl:h-[520px] max-w-full',
    fontSize: 'text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px]',
    tracking: 'tracking-[0.26em]',
    radius: 248,
    imageSize: 'w-[75%] h-[75%]',
    textStyle: 'font-semibold',
    innerInset: 'inset-[46px] sm:inset-[60px] md:inset-[72px] lg:inset-[80px]',
  },
};

const usePreloadImages = (images: string[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const validImages = images.filter(Boolean);
    if (validImages.length === 0) {
      setLoaded(true);
      return;
    }
    const loadImage = (url: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = reject;
      });

    Promise.all(validImages.map(loadImage))
      .then(() => setLoaded(true))
      .catch((err) => {
        console.error('Error preloading images:', err);
        setLoaded(true);
      });
  }, [images]);

  return loaded;
};

const ImagePreloader = ({ images }: { images: string[] }) => (
  <div className="hidden" aria-hidden="true">
    {images.filter(Boolean).map((src, index) => (
      <img key={index} src={src} alt="" />
    ))}
  </div>
);

const ImageOverlay = ({
  image,
  size = 'md',
  alt = '',
}: {
  image: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
    className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
  >
    <div
      className={cn(
        sizeConfig[size].imageSize,
        "relative rounded-full overflow-hidden border border-[hsl(var(--border))] shadow-xl"
      )}
    >
      <motion.img
        src={image}
        alt={alt}
        className="h-full w-full object-cover object-center"
        style={{ filter: 'brightness(0.92) contrast(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  </motion.div>
);

export const CircularRevealHeading = ({
  items,
  centerText,
  renderActiveText,
  className,
  size = 'md',
  activeItem: controlledActive,
  onActiveChange,
  variant = 'theme',
  mode = 'image',
}: CircularRevealHeadingProps) => {
  const [internalActive, setInternalActive] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const config = sizeConfig[size];
  const images = items.map((item) => item.image || '').filter(Boolean);
  usePreloadImages(images);

  const activeIndex = controlledActive !== undefined ? controlledActive : internalActive;
  const activeItem = activeIndex !== null && items[activeIndex] ? items[activeIndex] : null;
  const activeImage = mode === 'image' && activeItem?.image ? activeItem.image : null;

  const handleSetActive = (index: number | null) => {
    setInternalActive(index);
    onActiveChange?.(index);
  };

  const createTextSegments = () => {
    const totalItems = items.length;
    return items.map((item, index) => {
      // Evenly distribute text centered in each slice of the circumference
      const percentagePerItem = 100 / totalItems;
      const centerPercentage = index * percentagePerItem + percentagePerItem / 2;
      const isItemActive = activeIndex === index;

      return (
        <g key={index} className="select-none">
          <text
            className={cn(
              config.fontSize,
              config.tracking,
              config.textStyle,
              "uppercase cursor-pointer transition-all duration-300"
            )}
            textAnchor="middle"
            onMouseEnter={() => {
              handleSetActive(index);
            }}
            onClick={() => {
              handleSetActive(activeIndex === index ? null : index);
            }}
          >
            <textPath
              href="#circular-curve"
              startOffset={`${centerPercentage}%`}
              className={cn(
                "transition-all duration-300",
                variant === 'theme'
                  ? isItemActive
                    ? "fill-[hsl(var(--accent))] font-bold filter drop-shadow-sm"
                    : "fill-[hsl(var(--foreground))] hover:fill-[hsl(var(--accent))]"
                  : isItemActive
                    ? "fill-[#2d3436] font-bold"
                    : "fill-[url(#textGradient)] hover:fill-[#2d3436]"
              )}
            >
              {item.text}
            </textPath>
          </text>
        </g>
      );
    });
  };

  return (
    <>
      {images.length > 0 && <ImagePreloader images={images} />}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleSetActive(null);
        }}
        className={cn(
          "relative flex items-center justify-center select-none",
          config.container,
          variant === 'theme'
            ? "rounded-full bg-[hsl(var(--card)/0.85)] border border-[hsl(var(--border))] shadow-lg shadow-black/5"
            : "rounded-full bg-[#e6e6e6] shadow-[16px_16px_32px_#bebebe,-16px_-16px_32px_#ffffff]",
          className
        )}
      >
        {/* Active Image Overlay inside circle when in image mode */}
        {mode === 'image' && (
          <AnimatePresence>
            {activeImage && (
              <ImageOverlay
                image={activeImage}
                size={size}
                alt={items[activeIndex || 0]?.text || ""}
              />
            )}
          </AnimatePresence>
        )}

        {/* Concentric Architectural Rings Aligned with Theme (No unrequested neomorphic glow) */}
        {variant === 'theme' ? (
          <>
            {/* Outer concentric hairline */}
            <div className="absolute inset-[10px] sm:inset-[14px] rounded-full border border-[hsl(var(--border)/0.6)] pointer-events-none" />
            {/* Middle decorative dashed hairline */}
            <div className="absolute inset-[30px] sm:inset-[42px] md:inset-[50px] rounded-full border border-dashed border-[hsl(var(--border)/0.45)] pointer-events-none" />
            {/* Inner frame container for text or image display */}
            <div
              className={cn(
                "absolute rounded-full border border-[hsl(var(--border)/0.8)] bg-[hsl(var(--background))] transition-colors pointer-events-none",
                config.innerInset,
                activeIndex !== null ? "border-[hsl(var(--accent)/0.6)]" : ""
              )}
            />
          </>
        ) : (
          <>
            <motion.div
              className="absolute inset-[2px] rounded-full bg-[#e6e6e6]"
              style={{
                boxShadow: "inset 6px 6px 12px #d1d1d1, inset -6px -6px 12px #ffffff",
              }}
            />
            <motion.div
              className="absolute inset-[12px] rounded-full bg-[#e6e6e6]"
              style={{
                boxShadow: "inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff",
              }}
            />
          </>
        )}

        {/* Center Content Container: Displays active stage text on hover, or default centerText when idle */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 pointer-events-auto">
            <AnimatePresence mode="wait">
              {mode === 'text' && activeIndex !== null && activeItem ? (
                <motion.div
                  key={`active-step-${activeIndex}`}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center justify-center text-center px-3 py-1 sm:px-5 max-w-[74%] sm:max-w-[66%] md:max-w-[60%] overflow-hidden"
                >
                  {renderActiveText ? (
                    renderActiveText(activeItem, activeIndex)
                  ) : (
                    <>
                      <span className="mono text-[0.55rem] sm:text-[0.62rem] md:text-[0.68rem] tracking-[0.24em] uppercase text-[hsl(var(--accent))] font-bold mb-0.5 sm:mb-1">
                        {activeItem.number ? `Stage ${activeItem.number}` : `0${activeIndex + 1}`}
                      </span>
                      <h3 className="display text-lg sm:text-xl md:text-2xl text-[hsl(var(--foreground))] font-bold leading-tight">
                        {activeItem.title || (activeItem.text.charAt(0) + activeItem.text.slice(1).toLowerCase())}
                      </h3>
                      {activeItem.summary && (
                        <p className="mt-1 text-[0.7rem] sm:text-[0.76rem] md:text-[0.82rem] font-medium text-[hsl(var(--foreground))] leading-snug">
                          {activeItem.summary}
                        </p>
                      )}
                      {activeItem.description && (
                        <p className="mt-1 sm:mt-1.5 text-[0.58rem] sm:text-[0.66rem] md:text-[0.7rem] leading-relaxed text-[hsl(var(--muted-foreground))] max-w-[270px]">
                          {activeItem.description}
                        </p>
                      )}
                      {activeItem.deliverables && (
                        <div className="mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-[hsl(var(--border))] w-full max-w-[250px]">
                          <span className="mono text-[0.48rem] sm:text-[0.52rem] text-[hsl(var(--accent))] uppercase tracking-wider block font-semibold">
                            Deliverables
                          </span>
                          <span className="mono text-[0.5rem] sm:text-[0.56rem] text-[hsl(var(--foreground)/0.8)] leading-tight block mt-0.5">
                            {activeItem.deliverables}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ) : (
                (!activeImage || mode === 'text') && (
                  <motion.div
                    key="default-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "relative z-10 flex flex-col items-center justify-center text-center px-3 py-1 sm:px-5 max-w-[74%] sm:max-w-[66%] md:max-w-[60%]",
                      variant === 'theme'
                        ? "bg-transparent text-[hsl(var(--foreground))]"
                        : "bg-[#e6e6e6] p-6 rounded-3xl"
                    )}
                  >
                    {centerText}
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Circular Rotating Path for Text Segments */}
        <motion.div
          className="absolute inset-0 z-30"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 48,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            animationPlayState: isHovered ? "paused" : "running",
          }}
        >
          <svg viewBox="0 0 600 600" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#666666" />
                <stop offset="100%" stopColor="#444444" />
              </linearGradient>
            </defs>
            <path
              id="circular-curve"
              fill="none"
              stroke="transparent"
              d={`M 300,300 m -${config.radius},0 a ${config.radius},${config.radius} 0 1,1 ${config.radius * 2},0 a ${config.radius},${config.radius} 0 1,1 -${config.radius * 2},0`}
            />
            {createTextSegments()}
          </svg>
        </motion.div>
      </div>
    </>
  );
};

export default CircularRevealHeading;
