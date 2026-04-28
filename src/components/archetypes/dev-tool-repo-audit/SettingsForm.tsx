"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * SettingsForm — webhook secret rotation + branch filter for the
 * dev-tool-repo-audit archetype.
 */
export function SettingsForm() {
  const [webhookSecret, setWebhookSecret] = React.useState("whsec_••••••••••••");
  const [branchFilter, setBranchFilter] = React.useState("main,release/*");
  const [runOnPR, setRunOnPR] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/settings/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookSecret, branchFilter, runOnPR }),
      }).catch(() => null);
    } finally {
      setSaving(false);
    }
  }

  function regenerate() {
    // VOS-204: click handler — runs only after hydration, so no SSR mismatch.
    // Use crypto.getRandomValues for better entropy; gate on window for SSR safety.
    if (typeof window === "undefined") return;
    const bytes = new Uint8Array(12);
    window.crypto.getRandomValues(bytes);
    const rand = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    setWebhookSecret(`whsec_${rand}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-5 max-w-xl">
          <div>
            <Label htmlFor="webhook-secret">Webhook secret</Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="webhook-secret"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                className="font-mono"
              />
              <Button type="button" variant="outline" onClick={regenerate}>
                Regenerate
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Rotate and paste into the GitHub App settings.
            </p>
          </div>

          <div>
            <Label htmlFor="branch-filter">Branch filter</Label>
            <Input
              id="branch-filter"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              placeholder="main,release/*"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Comma-separated glob list of branches that trigger audits.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <Switch checked={runOnPR} onCheckedChange={setRunOnPR} />
            <span className="text-sm">Also run on pull requests</span>
          </label>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
