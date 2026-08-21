export const LEGAL_IDENTITY_REQUIRED_EVENT = 'legal-identity:required';
export const LEGAL_IDENTITY_REQUIRED_CODE = 'LEGAL_IDENTITY_REQUIRED';

/**
 * Detecta el 403 `LEGAL_IDENTITY_REQUIRED` que devuelve el backend (splits,
 * reproducción de tracks de terceros) y despacha el evento global que abre el
 * modal bloqueante (`LegalIdentityRequiredWatcher`). Devuelve `true` si el
 * error correspondía a este caso, para que el llamador decida si aún debe
 * mostrar su toast genérico.
 */
export function notifyIfLegalIdentityRequired(error: unknown): boolean {
  const code = (error as { response?: { data?: { code?: string } } })?.response?.data?.code;
  if (code !== LEGAL_IDENTITY_REQUIRED_CODE) return false;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LEGAL_IDENTITY_REQUIRED_EVENT));
  }
  return true;
}
