'use client';

import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/browser';

/**
 * Capa exclusiva de navegador que ejecuta las ceremonias WebAuthn con
 * `navigator.credentials`. El usuario nunca introduce RP ID, challenge ni
 * credentialId: esta capa solo reenvía las opciones que emite el backend y
 * devuelve la respuesta opaca del autenticador (§8, §10, §11).
 */
export function isPasskeySupported(): boolean {
  return browserSupportsWebAuthn();
}

export async function runRegistrationCeremony(
  optionsJSON: PublicKeyCredentialCreationOptionsJSON,
): Promise<RegistrationResponseJSON> {
  return startRegistration({ optionsJSON });
}

export async function runAuthenticationCeremony(
  optionsJSON: PublicKeyCredentialRequestOptionsJSON,
): Promise<AuthenticationResponseJSON> {
  return startAuthentication({ optionsJSON });
}
