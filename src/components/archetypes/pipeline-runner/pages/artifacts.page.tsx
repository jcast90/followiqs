import { ArtifactList } from "@/components/archetypes/pipeline-runner/ArtifactList";

export default function ArtifactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Artifacts</h1>
        <p className="text-sm text-muted-foreground">
          Every __VENTURE_NAME__ job produces artifacts — reports, datasets,
          builds, and logs — available here for download.
        </p>
      </div>
      <ArtifactList />
    </div>
  );
}
