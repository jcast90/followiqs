"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

type Scope = {
  id: string;
  label: string;
  required: boolean;
};

const MOCK_SCOPES: Scope[] = [
  { id: "repo:read", label: "Read repositories", required: true },
  { id: "pr:read", label: "Read pull requests", required: true },
  { id: "webhook:write", label: "Create webhooks", required: true },
  { id: "user:email", label: "Read your email address", required: false },
];

type Step = "scopes" | "redirect" | "confirm";

export function OAuthInstallFlow({
  providerName = "GitHub",
  providerSlug = "github",
}: {
  providerName?: string;
  providerSlug?: string;
}) {
  const [step, setStep] = React.useState<Step>("scopes");
  const [selected, setSelected] = React.useState<string[]>(
    MOCK_SCOPES.filter((s) => s.required).map((s) => s.id)
  );

  const toggleScope = (id: string) => {
    const req = MOCK_SCOPES.find((s) => s.id === id)?.required;
    if (req) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Install {providerName}</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={step === "scopes" ? "default" : "outline"}>
            1. Scopes
          </Badge>
          <span aria-hidden="true">›</span>
          <Badge variant={step === "redirect" ? "default" : "outline"}>
            2. Authorize
          </Badge>
          <span aria-hidden="true">›</span>
          <Badge variant={step === "confirm" ? "default" : "outline"}>
            3. Confirm
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "scopes" ? (
          <>
            <p className="text-sm text-muted-foreground">
              Pick what __VENTURE_NAME__ is allowed to do inside your{" "}
              {providerName} workspace.
            </p>
            <ul className="divide-y rounded-md border">
              {MOCK_SCOPES.map((s) => {
                const checked = selected.includes(s.id);
                return (
                  <li
                    key={s.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <Label className="text-sm font-medium">{s.label}</Label>
                      <div className="font-mono text-xs text-muted-foreground">
                        {s.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.required ? (
                        <Badge variant="outline">required</Badge>
                      ) : null}
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={() => toggleScope(s.id)}
                        disabled={s.required}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setStep("redirect")}>
                Continue
              </Button>
            </div>
          </>
        ) : null}

        {step === "redirect" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You&apos;ll be redirected to {providerName} to authorize. After
              approval we&apos;ll bounce you back to __VENTURE_NAME__.
            </p>
            <div className="rounded-md border bg-muted/30 p-4 font-mono text-xs">
              GET https://{providerSlug}.com/oauth/authorize?scope=
              {selected.join(",")}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setStep("scopes")}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep("confirm")}>
                Authorize on {providerName}
              </Button>
            </div>
          </div>
        ) : null}

        {step === "confirm" ? (
          <div className="space-y-4">
            <p className="text-sm">
              <Badge className="mr-2">Connected</Badge>
              {providerName} is ready. __VENTURE_NAME__ will start syncing
              shortly.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" type="button" onClick={() => setStep("scopes")}>
                Install another
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
