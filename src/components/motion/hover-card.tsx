"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

export interface HoverCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  lift?: number;
  scale?: number;
}

/**
 * Lightweight hover/tap wrapper for cards and tiles. Gives a subtle lift + scale
 * on hover and a tactile press on tap/click.
 */
export function HoverCard({
  children,
  lift = 4,
  scale = 1.015,
  className,
  ...rest
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ y: -lift, scale }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export default HoverCard;
