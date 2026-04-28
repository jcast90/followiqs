"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

export interface FadeInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

/**
 * Fades content in with an optional upward translation. Triggers when the
 * element enters the viewport. Safe for SSR — falls back to static content
 * for users with `prefers-reduced-motion`.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 12,
  once = true,
  className,
  ...rest
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;
