import { RepoConnector } from "@/components/archetypes/dev-tool-repo-audit/RepoConnector";

export default function ConnectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Connect repositories</h1>
        <p className="text-sm text-muted-foreground">
          Install the __VENTURE_NAME__ GitHub App to grant read access to
          the repositories you want to audit.
        </p>
      </div>
      <RepoConnector />
    </div>
  );
}
