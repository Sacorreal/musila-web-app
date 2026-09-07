export enum LegalIdentificationType {
  CC = 'CC',
  CE = 'CE',
  PA = 'PA',
  TI = 'TI',
}

export const LEGAL_IDENTIFICATION_TYPE_LABELS: Record<LegalIdentificationType, string> = {
  [LegalIdentificationType.CC]: 'Cédula de ciudadanía',
  [LegalIdentificationType.CE]: 'Cédula de extranjería',
  [LegalIdentificationType.PA]: 'Pasaporte',
  [LegalIdentificationType.TI]: 'Tarjeta de identidad',
};

export interface LegalIdentityDto {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  tipoIdentificacion: LegalIdentificationType;
  numeroIdentificacion: string;
  fechaExpedicion: string;
  numeroCelular: string;
  indicativoPais: string;
  identidadLegalVerificada: boolean;
  verifiedAt: string | null;
}
