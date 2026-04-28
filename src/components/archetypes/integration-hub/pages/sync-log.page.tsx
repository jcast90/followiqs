import { SyncLogTable } from "@/components/archetypes/integration-hub/SyncLogTable";

export default function SyncLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sync log</h1>
        <p className="text-sm text-muted-foreground">
          Every event __VENTURE_NAME__ has processed across all active
          connections.
        </p>
      </div>
      <SyncLogTable />
    </div>
  );
}
