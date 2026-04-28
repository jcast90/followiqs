"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Formats the final string. Takes the rounded numeric value. */
  format?: (value: number) => string;
  className?: string;
}

/**
 * Counts up from 0 to `value` when it scrolls into view. Uses framer-motion
 * values so the animation runs off the main render loop.
 */
export function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    const factor = Math.pow(10, decimals);
    const n = Math.round(latest * factor) / factor;
    if (format) return format(n);
    // VOS-765 hydration fix: `undefined` as the locale argument resolves
    // to the runtime locale, which differs between server (en-US/UTC) and
    // client (browser). React #418 hydration mismatch follows. Pin to
    // "en-US" so SSR + client agree on number formatting.
    return `${prefix}${n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}

export default AnimatedCounter;
