import { FlowsTable } from "@/components/archetypes/workflow-automation/FlowsTable";

export default function FlowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Flows</h1>
        <p className="text-sm text-muted-foreground">
          Chained, triggered automations that fan data across the systems
          __VENTURE_NAME__ orchestrates for you.
        </p>
      </div>
      <FlowsTable />
    </div>
  );
}
