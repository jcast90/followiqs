import { AuditPanel } from "@/components/archetypes/dev-tool-repo-audit/AuditPanel";
import { LiveLogPanel } from "@/components/archetypes/dev-tool-repo-audit/LiveLogPanel";

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit</h1>
        <p className="text-sm text-muted-foreground">
          Run a __VENTURE_NAME__ audit on a connected repository and review
          risk-ranked results.
        </p>
      </div>
      <AuditPanel productName="__VENTURE_NAME__" />
      <LiveLogPanel />
    </div>
  );
}
