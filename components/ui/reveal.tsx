"use client";

import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Reduced motion.
 *
 * Read directly from the media query rather than through motion's own hook.
 * `motion/react`'s `useReducedMotion` did not resolve here: with the user
 * preference set, the reveal components still mounted with their initial
 * `opacity: 0` and `whileInView` never ran, so the content stayed invisible —
 * the opposite of DESIGN.md §10.1. `useSyncExternalStore` gives the right
 * answer on the very first client render (no flash), reports `false` on the
 * server so the prerendered HTML is stable, and follows the setting if the OS
 * changes it mid-session.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Section reveal.
 *
 * One restrained pattern for the whole site: 12px rise plus opacity, once, on
 * entry. Nothing loops, nothing parallaxes, nothing exceeds 500ms. With reduced
 * motion requested the content is rendered immediately with no transform, so
 * nothing is hidden behind an animation that will not run.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggered container for product grids. Capped at 8 children so a long list
 * never becomes a slow, self-delaying animation.
 */
export function Stagger({
  children,
  className,
  step = 0.045,
  cap = 8,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  cap?: number;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: Math.min(step, 0.4 / cap) } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}