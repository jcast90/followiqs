"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SyncStatusBadge, type SyncState } from "./SyncStatusBadge";

export type Connector = {
  slug: string;
  name: string;
  description: string;
  installed: boolean;
  status: SyncState;
};

export const DEFAULT_CONNECTORS: Connector[] = [
  {
    slug: "github",
    name: "GitHub",
    description: "github-repo-sync — pull repos, branches, PRs.",
    installed: true,
    status: "healthy",
  },
  {
    slug: "slack",
    name: "Slack",
    description: "slack-lead-notifier — post events into Slack channels.",
    installed: true,
    status: "syncing",
  },
  {
    slug: "stripe",
    name: "Stripe",
    description: "Sync customers, subscriptions, and invoices.",
    installed: true,
    status: "error",
  },
  {
    slug: "linear",
    name: "Linear",
    description: "Sync issues, projects, and cycles.",
    installed: false,
    status: "paused",
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    description: "Two-way sync for contacts, accounts, opportunities.",
    installed: false,
    status: "paused",
  },
  {
    slug: "hubspot",
    name: "HubSpot",
    description: "Sync contacts and deal pipelines.",
    installed: true,
    status: "healthy",
  },
];

export function ConnectorTile({
  connector,
  onConnect,
}: {
  connector: Connector;
  onConnect?: (slug: string) => void;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 pt-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{connector.name}</div>
          {connector.installed ? (
            <SyncStatusBadge state={connector.status} />
          ) : null}
        </div>
        <p className="flex-1 text-sm text-muted-foreground">
          {connector.description}
        </p>
        <div>
          {connector.installed ? (
            <Button variant="outline" type="button" onClick={() => void 0}>
              Manage
            </Button>
          ) : (
            <Button type="button" onClick={() => onConnect?.(connector.slug)}>
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
