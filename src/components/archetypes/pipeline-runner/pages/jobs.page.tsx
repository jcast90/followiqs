import { JobsTable } from "@/components/archetypes/pipeline-runner/JobsTable";
import { RunButton } from "@/components/archetypes/pipeline-runner/RunButton";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Long-running pipelines that __VENTURE_NAME__ executes on schedule
          or on demand.
        </p>
      </div>
      <RunButton />
      <JobsTable />
    </div>
  );
}
