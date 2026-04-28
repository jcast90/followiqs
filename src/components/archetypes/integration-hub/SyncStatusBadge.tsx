"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

export type SyncState = "syncing" | "healthy" | "error" | "paused";

export function SyncStatusBadge({ state }: { state: SyncState }) {
  switch (state) {
    case "syncing":
      return <Badge variant="secondary">syncing…</Badge>;
    case "healthy":
      return <Badge>healthy</Badge>;
    case "error":
      return <Badge variant="destructive">error</Badge>;
    case "paused":
    default:
      return <Badge variant="outline">paused</Badge>;
  }
}
