"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RunButton({
  jobName = "nightly-etl",
  onRun,
}: {
  jobName?: string;
  onRun?: () => void;
}) {
  const [queuedCount, setQueuedCount] = React.useState(0);

  const handleRun = React.useCallback(() => {
    setQueuedCount((n) => n + 1);
    onRun?.();
  }, [onRun]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Run a job</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">{jobName}</p>
          <p className="text-xs text-muted-foreground">
            Manually trigger a __VENTURE_NAME__ run outside the schedule.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {queuedCount > 0 ? (
            <span className="text-xs text-muted-foreground">
              {queuedCount} queued this session
            </span>
          ) : null}
          <Button
            type="button"
            size="lg"
            onClick={handleRun}
            className="min-w-32"
          >
            Run job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
