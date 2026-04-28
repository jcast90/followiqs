import { PageTransition } from "@/components/motion";
import { type ReactNode } from "react";

/**
 * Next.js App Router `template.tsx` — unlike `layout.tsx`, this re-mounts on
 * every route change. Wrapping in `PageTransition` gives all route changes a
 * subtle fade/slide without per-page work.
 */
export default function RootTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
