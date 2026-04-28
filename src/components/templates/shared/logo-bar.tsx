"use client";

import { resolveLandingConfig } from "@/lib/config";
import Image from "next/image";

export function LogoBar() {
  const { landing } = resolveLandingConfig();
  const logos = landing.socialProof?.logos;
  const line = landing.socialProof?.line || landing.socialProofLine;

  if (!logos?.length && !line) return null;

  return (
    <section className="border-y border-brand-border py-10 px-6">
      <div className="mx-auto max-w-5xl">
        {line && (
          <p className="text-center text-sm text-zinc-500 mb-6">{line}</p>
        )}
        {logos && logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {logos.map((logo, i) => (
              <Image
                key={i}
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={32}
                className="h-6 w-auto object-contain opacity-40 grayscale transition-all hover:opacity-70 hover:grayscale-0 sm:h-8"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
