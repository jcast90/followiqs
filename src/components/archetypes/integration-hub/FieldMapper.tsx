"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SOURCE_FIELDS = [
  "email",
  "first_name",
  "last_name",
  "company",
  "company_domain",
  "mrr_cents",
  "plan",
  "signup_source",
];

const DESTINATION_FIELDS = [
  "",
  "email",
  "firstname",
  "lastname",
  "company_name",
  "domain",
  "mrr",
  "lifecycle_stage",
  "lead_source",
];

const DEFAULT_MAPPING: Record<string, string> = {
  email: "email",
  first_name: "firstname",
  last_name: "lastname",
  company: "company_name",
  company_domain: "domain",
  mrr_cents: "mrr",
  plan: "lifecycle_stage",
  signup_source: "lead_source",
};

export function FieldMapper({
  sourceName = "Stripe customer",
  destinationName = "HubSpot contact",
}: {
  sourceName?: string;
  destinationName?: string;
}) {
  const [mapping, setMapping] =
    React.useState<Record<string, string>>(DEFAULT_MAPPING);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field mapping</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 text-sm font-medium text-muted-foreground">
          <div>Source · {sourceName}</div>
          <div className="text-center">→</div>
          <div>Destination · {destinationName}</div>
        </div>
        <ul className="space-y-2">
          {SOURCE_FIELDS.map((src) => (
            <li
              key={src}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
            >
              <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-xs">
                {src}
              </div>
              <span className="text-muted-foreground" aria-hidden="true">
                →
              </span>
              <select
                className="h-9 w-full rounded-md border bg-background px-3 font-mono text-xs"
                value={mapping[src] ?? ""}
                onChange={(e) =>
                  setMapping((prev) => ({ ...prev, [src]: e.target.value }))
                }
              >
                {DESTINATION_FIELDS.map((dst) => (
                  <option key={dst || "unset"} value={dst}>
                    {dst || "— unmapped —"}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => void 0}>
            Reset
          </Button>
          <Button type="button" onClick={() => void 0}>
            Save mapping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
