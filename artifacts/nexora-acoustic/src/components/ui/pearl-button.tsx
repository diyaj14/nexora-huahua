import React from "react";
import { ArrowFillButton, type ArrowFillButtonProps } from "@/components/ui/arrow-fill-button";

export type PearlButtonProps = (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
) & {
  label?: string;
  btnText?: string;
  variant?: 'primary' | 'copper' | 'quiet' | 'pearl' | 'default';
  size?: 'sm' | 'default' | 'lg' | 'vault';
  icon?: React.ReactNode;
  showSparkle?: boolean;
  children?: React.ReactNode;
};

export const PearlButton: React.FC<PearlButtonProps> = ({
  label,
  btnText,
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const displayText = btnText ?? label ?? (typeof children === "string" ? children : undefined) ?? "Button";
  const mappedVariant = variant === "pearl" ? "quiet" : variant;

  return (
    <ArrowFillButton
      btnText={displayText}
      variant={mappedVariant as ArrowFillButtonProps["variant"]}
      size={size}
      className={className}
      {...(props as any)}
    >
      {children}
    </ArrowFillButton>
  );
};

export default PearlButton;
