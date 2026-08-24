import { redirect } from 'next/navigation';

export default async function TripEditorIndexPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/trips/${id}/basics`);
}
