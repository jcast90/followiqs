"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * RepoConnector — "install GitHub App" CTA + list of existing installations.
 *
 * Ships with mock data so the page is visibly functional before the
 * /api/github/installations route is wired up. When the route returns a
 * non-empty list it takes priority.
 */
type Installation = {
  id: number;
  owner: string;
  repoCount: number;
  addedAt: string; // ISO
  selection: "all" | "selected";
};

// VOS-204: hydration-safe formatter (explicit locale + UTC timezone).
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  timeZone: "UTC",
});

function formatAddedAt(iso: string): string {
  return DATE_FMT.format(new Date(iso));
}

const MOCK_INSTALLATIONS: Installation[] = [
  {
    id: 1001,
    owner: "acme-engineering",
    repoCount: 27,
    addedAt: "2026-03-18T10:14:00Z",
    selection: "all",
  },
  {
    id: 1002,
    owner: "jlancaster",
    repoCount: 4,
    addedAt: "2026-04-02T08:40:00Z",
    selection: "selected",
  },
];

export function RepoConnector() {
  const [installations, setInstallations] =
    React.useState<Installation[]>(MOCK_INSTALLATIONS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/github/installations")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.installations?.length) {
          setInstallations(data.installations);
        }
      })
      .catch(() => {
        /* keep mock */
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect a GitHub repository</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Install the GitHub App so we can read your code and run audits
            on each push. You can pick individual repos during install.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="/api/github/install">
              <Button>Install GitHub App</Button>
            </a>
            <Button variant="outline" type="button">
              I&apos;ll do this later
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium">Current installations</h3>
          {loading ? (
            <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
          ) : installations.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No installations yet.
            </p>
          ) : (
            <ul className="mt-3 divide-y rounded-md border">
              {installations.map((inst) => (
                <li
                  key={inst.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{inst.owner}</p>
                    <p className="text-xs text-muted-foreground">
                      {inst.repoCount} repo(s) · added{" "}
                      {formatAddedAt(inst.addedAt)}
                    </p>
                  </div>
                  <Badge variant={inst.selection === "all" ? "default" : "secondary"}>
                    {inst.selection === "all" ? "All repos" : "Selected repos"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
