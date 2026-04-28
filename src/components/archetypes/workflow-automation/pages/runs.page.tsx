import { RunTimeline } from "@/components/archetypes/workflow-automation/RunTimeline";

export default function RunsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Runs</h1>
        <p className="text-sm text-muted-foreground">
          Every time a trigger fires, __VENTURE_NAME__ records a run with
          per-step status and timing.
        </p>
      </div>
      <RunTimeline />
    </div>
  );
}
