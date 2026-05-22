import { EditTrackForm } from "@/src/domains/tracks/components/EditTrackForm";

export default async function EditTrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-8">
      <EditTrackForm trackId={id} />
    </div>
  );
}
