import { ConnectionsTable } from "@/components/archetypes/integration-hub/ConnectionsTable";

export default function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Connections</h1>
        <p className="text-sm text-muted-foreground">
          All external systems __VENTURE_NAME__ is currently syncing data
          to and from.
        </p>
      </div>
      <ConnectionsTable />
    </div>
  );
}
