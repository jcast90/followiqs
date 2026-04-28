"use client";

import * as React from "react";
import {
  FlowCanvas,
  DEFAULT_STEPS,
  type FlowStep,
} from "@/components/archetypes/workflow-automation/FlowCanvas";
import { StepInspector } from "@/components/archetypes/workflow-automation/StepInspector";

export default function FlowDetailPage() {
  const [selectedId, setSelectedId] = React.useState<string>(
    DEFAULT_STEPS[0]!.id
  );
  const selected: FlowStep | null =
    DEFAULT_STEPS.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          enrich-contact-from-clearbit
        </h1>
        <p className="text-sm text-muted-foreground">
          Edit the step graph and inspect individual step config for this
          __VENTURE_NAME__ flow.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <FlowCanvas
          steps={DEFAULT_STEPS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <StepInspector step={selected} />
      </div>
    </div>
  );
}
