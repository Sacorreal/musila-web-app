import { redirect } from 'next/navigation'

export default async function OrgIndexPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = await params
  redirect(`/org/${organizationId}/settings/roles`)
}
