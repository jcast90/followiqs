import { QueueStatus } from "@/components/archetypes/pipeline-runner/QueueStatus";

export default function QueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Queue</h1>
        <p className="text-sm text-muted-foreground">
          Live view of queued and in-flight jobs across all __VENTURE_NAME__
          pipelines.
        </p>
      </div>
      <QueueStatus />
    </div>
  );
}
