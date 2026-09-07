/**
 * Espejo exacto de
 * `musila-backend/src/organizations/constants/business-document-catalog.ts`.
 * Cualquier cambio aquí debe replicarse allá — el backend es quien valida en
 * última instancia, este catálogo solo controla las opciones del select.
 */
export enum BusinessDocumentType {
  NIT = 'NIT',
  RUC = 'RUC',
  RFC = 'RFC',
  CNPJ = 'CNPJ',
  CIF = 'CIF',
  EIN = 'EIN',
  RUT_CL = 'RUT_CL',
  CUIT = 'CUIT',
  TAX_ID_GENERIC = 'TAX_ID_GENERIC',
}

export const BUSINESS_DOCUMENT_TYPE_LABELS: Record<BusinessDocumentType, string> = {
  [BusinessDocumentType.NIT]: 'NIT (Número de Identificación Tributaria)',
  [BusinessDocumentType.RUC]: 'RUC (Registro Único de Contribuyentes)',
  [BusinessDocumentType.RFC]: 'RFC (Registro Federal de Contribuyentes)',
  [BusinessDocumentType.CNPJ]: 'CNPJ (Cadastro Nacional da Pessoa Jurídica)',
  [BusinessDocumentType.CIF]: 'CIF (Código de Identificación Fiscal)',
  [BusinessDocumentType.EIN]: 'EIN (Employer Identification Number)',
  [BusinessDocumentType.RUT_CL]: 'RUT (Rol Único Tributario)',
  [BusinessDocumentType.CUIT]: 'CUIT (Clave Única de Identificación Tributaria)',
  [BusinessDocumentType.TAX_ID_GENERIC]: 'Tax ID / Business Registration Number',
};

export const COUNTRY_DOCUMENT_TYPES: Record<string, BusinessDocumentType[]> = {
  CO: [BusinessDocumentType.NIT],
  EC: [BusinessDocumentType.RUC],
  PE: [BusinessDocumentType.RUC],
  MX: [BusinessDocumentType.RFC],
  BR: [BusinessDocumentType.CNPJ],
  ES: [BusinessDocumentType.CIF],
  US: [BusinessDocumentType.EIN],
  CL: [BusinessDocumentType.RUT_CL],
  AR: [BusinessDocumentType.CUIT],
};

/** Tipos de documento válidos para un país; fallback genérico si no está en el catálogo. */
export function allowedDocumentTypesFor(countryCode: string | undefined): BusinessDocumentType[] {
  if (!countryCode) return [BusinessDocumentType.TAX_ID_GENERIC];
  return COUNTRY_DOCUMENT_TYPES[countryCode.toUpperCase()] ?? [BusinessDocumentType.TAX_ID_GENERIC];
}
