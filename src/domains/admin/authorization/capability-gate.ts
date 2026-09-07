import { fetchMyCapabilities } from './authorization.actions'

/**
 * Gate server-side por sección del panel admin, contra las capabilities
 * `platform.*` del motor unificado (semántica OR). Solo UX: la autorización
 * real la hace el backend en cada request vía AuthorizationGuard.
 */
export async function hasAnyCapability(anyOf: string[]): Promise<boolean> {
  const { capabilities } = await fetchMyCapabilities().catch(() => ({ capabilities: [] as string[] }))
  return anyOf.some((key) => capabilities.includes(key))
}
