import { TriggerConfig } from "@/components/archetypes/workflow-automation/TriggerConfig";

export default function TriggersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Triggers</h1>
        <p className="text-sm text-muted-foreground">
          Pick how __VENTURE_NAME__ starts a flow — webhook, schedule, or
          an event from a connected integration.
        </p>
      </div>
      <TriggerConfig />
    </div>
  );
}
