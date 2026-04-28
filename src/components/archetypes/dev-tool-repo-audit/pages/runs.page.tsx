import { RunsTable } from "@/components/archetypes/dev-tool-repo-audit/RunsTable";
import { ResultDiffViewer } from "@/components/archetypes/dev-tool-repo-audit/ResultDiffViewer";

export default function RunsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Runs</h1>
        <p className="text-sm text-muted-foreground">
          History of __VENTURE_NAME__ audit runs with coverage deltas.
        </p>
      </div>
      <RunsTable />
      <ResultDiffViewer />
    </div>
  );
}
