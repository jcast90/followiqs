import { FieldMapper } from "@/components/archetypes/integration-hub/FieldMapper";

export default function MappingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Field mappings</h1>
        <p className="text-sm text-muted-foreground">
          Choose how __VENTURE_NAME__ maps fields from each source system to
          the destination.
        </p>
      </div>
      <FieldMapper />
    </div>
  );
}
