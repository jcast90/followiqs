"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

export type SlideDirection = "left" | "right" | "up" | "down";

export interface SlideInProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  direction?: SlideDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
}

function offsetFor(direction: SlideDirection, distance: number) {
  switch (direction) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "up":
      return { x: 0, y: -distance };
    case "down":
    default:
      return { x: 0, y: distance };
  }
}

/**
 * Slides content in from a given direction while fading. Useful for sidebars,
 * toast-style surfaces, and sequential section reveals.
 */
export function SlideIn({
  children,
  direction = "up",
  distance = 24,
  delay = 0,
  duration = 0.5,
  once = true,
  className,
  ...rest
}: SlideInProps) {
  const offset = offsetFor(direction, distance);

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default SlideIn;
