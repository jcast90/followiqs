import type { Metadata } from "next";
import "./globals.css";
import config from "@/lib/config";
import { PageTracker } from "@/components/page-tracker";
import { BrandProvider } from "@/components/brand-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { resolveTypographyPreset } from "@/lib/typography";

const typography = resolveTypographyPreset(config.brand?.typography);

export const metadata: Metadata = {
  title: config.name + " - " + config.tagline,
  description: config.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${typography.variableClassName} dark`}>
      <body className="antialiased bg-brand-surface text-white font-sans">
        <BrandProvider>
          <AnalyticsProvider>
            <PageTracker />
            {children}
          </AnalyticsProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
