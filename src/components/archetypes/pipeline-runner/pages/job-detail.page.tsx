import { ProgressBar } from "@/components/archetypes/pipeline-runner/ProgressBar";
import { LiveLogPanel } from "@/components/archetypes/pipeline-runner/LiveLogPanel";

export default function JobDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">nightly-etl</h1>
        <p className="text-sm text-muted-foreground">
          __VENTURE_NAME__ run detail — per-stage progress and streaming
          logs for this pipeline execution.
        </p>
      </div>
      <ProgressBar />
      <LiveLogPanel jobId="job_nightly_etl_2026_04_14" />
    </div>
  );
}
