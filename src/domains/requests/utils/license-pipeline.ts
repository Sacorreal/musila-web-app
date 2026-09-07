import { RequestStatus, TrackRequest } from "../types/request.types";
import {
  LicenseContractDto,
  LicenseContractStatus,
} from "@/src/domains/license-contracts/types/license-contract.types";

/**
 * Etapas del ciclo de vida de una licencia, en orden.
 *
 * El backend solo persiste un estado plano (`RequestStatus`), por lo que estas
 * etapas son **derivadas**: combinan el estado de la solicitud con las señales
 * del contrato de licencia de primer uso (`LicenseContractDto`) cuando existe.
 * Mantener esta derivación como una función pura permite reutilizarla tanto en
 * la vista de detalle (con contrato) como en la tabla (solo con la solicitud).
 */
export enum LicensePipelineStage {
  SOLICITUD = 0,
  NEGOCIACION = 1,
  OFERTA = 2,
  ACEPTADA = 3,
  CONTRATO = 4,
}

/** Estados terminales que interrumpen la vía feliz del pipeline. */
export type LicensePipelineTerminal = "rechazada" | "cancelada" | null;

export interface LicensePipelineStageMeta {
  stage: LicensePipelineStage;
  /** Clave estable para keys de React y tests. */
  key: string;
  label: string;
  description: string;
}

export const LICENSE_PIPELINE_STAGES: readonly LicensePipelineStageMeta[] = [
  {
    stage: LicensePipelineStage.SOLICITUD,
    key: "solicitud",
    label: "Solicitud",
    description: "El intérprete envió la solicitud de uso.",
  },
  {
    stage: LicensePipelineStage.NEGOCIACION,
    key: "negociacion",
    label: "En negociación",
    description: "Las partes conversan los términos de la licencia.",
  },
  {
    stage: LicensePipelineStage.OFERTA,
    key: "oferta",
    label: "Oferta",
    description: "El compositor propuso los términos o el precio de la licencia.",
  },
  {
    stage: LicensePipelineStage.ACEPTADA,
    key: "aceptada",
    label: "Aceptada",
    description: "Las partes aceptaron los términos de la licencia.",
  },
  {
    stage: LicensePipelineStage.CONTRATO,
    key: "contrato",
    label: "Contrato",
    description: "El contrato quedó formalizado y en firme.",
  },
] as const;

export interface LicensePipelineState {
  /** Etapa más avanzada alcanzada por la licencia (0–4). */
  reachedIndex: LicensePipelineStage;
  /** Etapa activa actual (coincide con `reachedIndex` en la vía feliz). */
  currentIndex: LicensePipelineStage;
  /** `true` si la licencia fue rechazada o cancelada. */
  isTerminal: boolean;
  /** Tipo de estado terminal, o `null` si sigue en curso. */
  terminal: LicensePipelineTerminal;
}

/** Mapea el estado del contrato online a la etapa mínima que representa. */
function contractStatusToStage(status: LicenseContractStatus): LicensePipelineStage {
  switch (status) {
    case LicenseContractStatus.FULFILLED:
      return LicensePipelineStage.CONTRATO;
    case LicenseContractStatus.SIGNED:
    case LicenseContractStatus.EXPIRED:
      // Firmado por todas las partes = aceptada. La etapa "Contrato" se reserva
      // para el cumplimiento (ISRC registrado / licencia en firme).
      return LicensePipelineStage.ACEPTADA;
    case LicenseContractStatus.AWAITING_SIGNATURES:
    case LicenseContractStatus.DRAFT:
      return LicensePipelineStage.OFERTA;
    case LicenseContractStatus.CANCELLED:
    default:
      return LicensePipelineStage.OFERTA;
  }
}

/**
 * Deriva la etapa del pipeline de una licencia.
 *
 * @param request  Solicitud de uso (fuente base, siempre disponible).
 * @param contract Contrato de licencia de primer uso, si ya se generó online.
 *                 Cuando se provee, sus estados tienen prioridad para precisar
 *                 las etapas Oferta / Aceptada / Contrato.
 */
export function deriveLicensePipeline(
  request: Pick<
    TrackRequest,
    "status" | "documentUrl" | "licensePrice" | "licensePaymentStatus"
  >,
  contract?: LicenseContractDto | null,
): LicensePipelineState {
  const { status } = request;

  // Una solicitud viva arranca, como mínimo, en negociación: existe un canal de
  // conversación abierto entre las partes desde su creación.
  let reached: LicensePipelineStage = LicensePipelineStage.NEGOCIACION;

  if (contract) {
    reached = contractStatusToStage(contract.status);
  } else {
    const hasPriceSet = request.licensePrice !== null && request.licensePrice !== undefined;
    const paymentApproved = request.licensePaymentStatus === "approved";
    const hasExternalDocument = !!request.documentUrl;

    if (hasPriceSet) reached = Math.max(reached, LicensePipelineStage.OFERTA);
    if (paymentApproved || hasExternalDocument) {
      reached = Math.max(reached, LicensePipelineStage.CONTRATO);
    }
  }

  // La aprobación directa de la solicitud siempre implica, al menos, "Aceptada".
  if (status === RequestStatus.APROBADA) {
    reached = Math.max(reached, LicensePipelineStage.ACEPTADA);
  }

  let terminal: LicensePipelineTerminal = null;
  if (status === RequestStatus.RECHAZADA) terminal = "rechazada";
  else if (status === RequestStatus.CANCELADA) terminal = "cancelada";
  else if (contract?.status === LicenseContractStatus.CANCELLED) terminal = "cancelada";

  return {
    reachedIndex: reached,
    currentIndex: reached,
    isTerminal: terminal !== null,
    terminal,
  };
}
