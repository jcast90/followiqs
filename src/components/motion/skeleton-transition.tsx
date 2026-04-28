"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";

export interface SkeletonTransitionProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Cross-fades a skeleton placeholder into real content once `loading` flips to
 * false. Keeps layout stable by mounting only one side at a time.
 */
export function SkeletonTransition({
  loading,
  skeleton,
  children,
  className,
}: SkeletonTransitionProps) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-busy
            aria-live="polite"
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SkeletonTransition;
