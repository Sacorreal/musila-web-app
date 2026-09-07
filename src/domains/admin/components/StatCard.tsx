// Re-exporta el primitivo compartido para no duplicar la implementación (DRY).
// El StatCard vive en `shared/components/ui` y se reutiliza en admin, afiliados
// y el dashboard del autor.
export { StatCard, type StatCardColor } from '@/src/shared/components/UI/StatCard'
