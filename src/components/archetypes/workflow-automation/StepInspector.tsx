"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FlowStep } from "./FlowCanvas";

const MOCK_RETRY_POLICY = {
  maxAttempts: 3,
  backoffSeconds: 30,
};

const MOCK_INPUT_SCHEMA: Record<string, string> = {
  email: "string (required)",
  company_domain: "string",
  amount_cents: "number",
};

const MOCK_OUTPUT_SCHEMA: Record<string, string> = {
  enriched_company: "object",
  confidence_score: "number",
};

export function StepInspector({ step }: { step: FlowStep | null }) {
  if (!step) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Step inspector</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a step on the canvas to configure it.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Inspector
          <Badge variant="outline" className="ml-2">
            {step.type}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="step-name">Name</Label>
          <Input
            id="step-name"
            defaultValue={step.name}
            onChange={() => void 0}
          />
        </div>
        {step.integration ? (
          <div className="space-y-2">
            <Label htmlFor="step-integration">Integration</Label>
            <Input
              id="step-integration"
              defaultValue={step.integration}
              readOnly
            />
          </div>
        ) : null}

        <div>
          <h4 className="mb-2 text-sm font-medium">Input schema</h4>
          <ul className="divide-y rounded-md border">
            {Object.entries(MOCK_INPUT_SCHEMA).map(([k, v]) => (
              <li
                key={k}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="font-mono">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Output schema</h4>
          <ul className="divide-y rounded-md border">
            {Object.entries(MOCK_OUTPUT_SCHEMA).map(([k, v]) => (
              <li
                key={k}
                className="flex items-center justify-between px-3 py-2 text-sm"
              >
                <span className="font-mono">{k}</span>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">Retry policy</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Max attempts</Label>
              <Input
                type="number"
                defaultValue={MOCK_RETRY_POLICY.maxAttempts}
                onChange={() => void 0}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Backoff (s)</Label>
              <Input
                type="number"
                defaultValue={MOCK_RETRY_POLICY.backoffSeconds}
                onChange={() => void 0}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" onClick={() => void 0}>
            Save
          </Button>
          <Button variant="outline" type="button" onClick={() => void 0}>
            Test step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
