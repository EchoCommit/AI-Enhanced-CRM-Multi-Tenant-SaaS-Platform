export default function DealsPage({
  params,
}: {
  params: { pipelineId: string };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">
        Pipeline: {params.pipelineId}
      </h1>
      <p className="text-muted-foreground">Deals pipeline view scaffold.</p>
    </div>
  );
}
