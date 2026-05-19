import { EditTrackForm } from "@/src/domains/tracks/components/EditTrackForm";

export default function EditTrackPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <EditTrackForm trackId={params.id} />
    </div>
  );
}
