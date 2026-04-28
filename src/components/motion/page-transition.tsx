"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

/**
 * Default page transition used by Next.js `template.tsx` files. Fades + gently
 * lifts the page on route change.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
