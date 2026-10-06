import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "primary" | "outline" | "ghost" | "onDark";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xs font-[length:var(--text-button)] " +
  "whitespace-nowrap select-none transition-[background-color,color,border-color,transform] " +
  "duration-[var(--motion-fast)] ease-[var(--ease-out)] active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-45";

const VARIANTS: Record<Variant, string> = {
  // The single highest-value action on a screen. near-black label on orange —
  // 9.1:1 contrast, and the yellow-on-black language of the trade.
  accent: "bg-accent text-accent-ink border border-accent hover:bg-accent-hover hover:border-accent-hover",
  primary: "bg-primary text-white border border-primary hover:bg-primary-hover hover:border-primary-hover",
  outline: "bg-transparent text-text border border-border-strong hover:border-text hover:bg-surface",
  ghost: "bg-transparent text-text border border-transparent hover:bg-surface",
  onDark: "bg-white text-text border border-white hover:bg-accent hover:text-accent-ink hover:border-accent",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5",
  lg: "h-12 px-6",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Stretches the control to its container — used in the cart and forms. */
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children">;
type AnchorProps = CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">;
type ExternalAnchorProps = CommonProps &
  Omit<ComponentProps<"a">, "className" | "children"> & { external?: true };

export function Button({
  variant = "accent",
  size = "md",
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "accent",
  size = "md",
  fullWidth,
  className,
  children,
  ...rest
}: AnchorProps) {
  return (
    <Link className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)} {...rest}>
      {children}
    </Link>
  );
}

export function ExternalLink({
  variant = "outline",
  size = "md",
  fullWidth,
  className,
  children,
  external,
  ...rest
}: ExternalAnchorProps) {
  return (
    <a
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}