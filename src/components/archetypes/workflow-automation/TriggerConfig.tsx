"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TriggerType = "webhook" | "schedule" | "event";

const TRIGGER_OPTIONS: { value: TriggerType; label: string; desc: string }[] = [
  {
    value: "webhook",
    label: "Webhook",
    desc: "Start the flow when an external HTTP POST lands on a unique URL.",
  },
  {
    value: "schedule",
    label: "Schedule",
    desc: "Run on a cron expression — e.g. every hour, daily at 09:00 UTC.",
  },
  {
    value: "event",
    label: "Integration event",
    desc: "React to a published event from Stripe / Slack / GitHub / Linear.",
  },
];

export function TriggerConfig({
  initial = "webhook",
}: {
  initial?: TriggerType;
}) {
  const [kind, setKind] = React.useState<TriggerType>(initial);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trigger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          {TRIGGER_OPTIONS.map((opt) => {
            const active = opt.value === kind;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setKind(opt.value)}
                className={
                  "rounded-md border p-4 text-left transition " +
                  (active
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{opt.label}</span>
                  {active ? <Badge>Selected</Badge> : null}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>

        {kind === "webhook" ? (
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Inbound URL</Label>
            <Input
              id="webhook-url"
              readOnly
              value="https://__VENTURE_NAME__.venture-os.co/api/hooks/flow_abc123"
            />
            <p className="text-xs text-muted-foreground">
              Copy this URL into the upstream system.
            </p>
          </div>
        ) : null}

        {kind === "schedule" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cron">Cron expression</Label>
              <Input
                id="cron"
                defaultValue="0 9 * * *"
                onChange={() => void 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tz">Timezone</Label>
              <Input id="tz" defaultValue="America/Los_Angeles" />
            </div>
          </div>
        ) : null}

        {kind === "event" ? (
          <div className="space-y-2">
            <Label htmlFor="event-source">Source</Label>
            <Input
              id="event-source"
              defaultValue="stripe.checkout.session.completed"
              onChange={() => void 0}
            />
            <p className="text-xs text-muted-foreground">
              Example values: stripe.checkout.session.completed,
              github.pull_request.merged, slack.message.channel.
            </p>
          </div>
        ) : null}

        <Button type="button" onClick={() => void 0}>
          Save trigger
        </Button>
      </CardContent>
    </Card>
  );
}
