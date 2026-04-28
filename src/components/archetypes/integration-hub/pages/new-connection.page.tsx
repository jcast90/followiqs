"use client";

import * as React from "react";
import {
  ConnectorTile,
  DEFAULT_CONNECTORS,
} from "@/components/archetypes/integration-hub/ConnectorTile";
import { OAuthInstallFlow } from "@/components/archetypes/integration-hub/OAuthInstallFlow";

export default function NewConnectionPage() {
  const [installing, setInstalling] = React.useState<string | null>(null);
  const target = DEFAULT_CONNECTORS.find((c) => c.slug === installing) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add a connection</h1>
        <p className="text-sm text-muted-foreground">
          Pick a provider and __VENTURE_NAME__ will guide you through OAuth
          install.
        </p>
      </div>

      {target ? (
        <OAuthInstallFlow
          providerName={target.name}
          providerSlug={target.slug}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_CONNECTORS.map((c) => (
            <ConnectorTile
              key={c.slug}
              connector={c}
              onConnect={(slug) => setInstalling(slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
