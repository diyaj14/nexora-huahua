import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

type As = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

export type KineticTextProps = React.HTMLAttributes<HTMLElement> & {
  text?: string;
  children?: React.ReactNode;
  as?: As;
};

export function KineticText({
  text,
  children,
  as: Tag = "h1",
  className = "",
  style,
  ...rest
}: KineticTextProps) {
  const mergedStyle = {
    "--hover-padding": "calc(1em / 12)",
    "--text-stroke-width": "calc(1em * 125 / 6000)",
    ...(style as React.CSSProperties | undefined),
  } as React.CSSProperties;

  // Extract lines supporting both newline characters and <br /> tags
  const lines: string[] = useMemo(() => {
    if (typeof text === "string") {
      return text.split("\n");
    }
    if (typeof children === "string") {
      return children.split("\n");
    }
    const extracted: string[] = [];
    let current = "";
    React.Children.forEach(children, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        const parts = String(child).split("\n");
        parts.forEach((part, idx) => {
          if (idx === 0) {
            current += part;
          } else {
            extracted.push(current);
            current = part;
          }
        });
      } else if (React.isValidElement(child) && child.type === "br") {
        extracted.push(current);
        current = "";
      }
    });
    if (current || extracted.length === 0) {
      extracted.push(current);
    }
    return extracted;
  }, [text, children]);

  const fullText = lines.join(" ");

  return (
    <>
      <style>{`
        .kinetic-char-item {
          display: inline-block;
          white-space: pre;
          will-change: font-weight, -webkit-text-stroke-width, padding;
          -webkit-text-stroke-color: transparent;
          -webkit-text-stroke-width: var(--text-stroke-width);
          transition: font-weight 0.4s ease, -webkit-text-stroke-color 0.4s ease, padding 0.4s ease;
        }

        /* Active Hover: Peak Weight & Stroke Expansion */
        .kinetic-char-item:hover {
          padding-inline: var(--hover-padding);
          font-weight: 900 !important;
          -webkit-text-stroke-color: currentColor;
          -webkit-text-stroke-width: calc(var(--text-stroke-width) * 2);
        }

        /* Adjacent Sibling (Previous & Next): Wave 600 */
        .kinetic-char-item:has(+ .kinetic-char-item:hover),
        .kinetic-char-item:hover + .kinetic-char-item {
          padding-inline: var(--hover-padding);
          font-weight: 600 !important;
        }

        /* 2nd Sibling (2 steps away): Harmonic 400 */
        .kinetic-char-item:has(+ .kinetic-char-item + .kinetic-char-item:hover),
        .kinetic-char-item:hover + .kinetic-char-item + .kinetic-char-item {
          font-weight: 400 !important;
        }
      `}</style>

      <Tag
        {...rest}
        className={cn(
          "font-[300] select-none [font-optical-sizing:auto]",
          className
        )}
        style={mergedStyle}
      >
        {lines.map((line, lineIndex) => (
          <span
            key={`line-${lineIndex}`}
            className="flex flex-nowrap w-max max-w-full overflow-visible leading-[1.04]"
          >
            {line.split("").map((letter, i) => (
              <span
                key={`l-${lineIndex}-${i}`}
                aria-hidden="true"
                className="kinetic-char-item [will-change:font-weight,-webkit-text-stroke-width,padding] [-webkit-text-stroke-color:transparent] [-webkit-text-stroke-width:var(--text-stroke-width)] [transition:font-weight_0.4s,_-webkit-text-stroke-color_0.4s,_padding_0.4s] hover:[padding-inline:var(--hover-padding)] hover:font-[900] hover:[-webkit-text-stroke-color:currentcolor] hover:[-webkit-text-stroke-width:calc(var(--text-stroke-width)*2)] has-[+span+span:hover]:font-[400] has-[+span:hover]:[padding-inline:var(--hover-padding)] has-[+span:hover]:font-[600] [:hover+&]:[padding-inline:var(--hover-padding)] [:hover+&]:font-[600] [:hover+span+&]:font-[400]"
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
          </span>
        ))}
        <span className="sr-only">{fullText}</span>
      </Tag>
    </>
  );
}

export default KineticText;
