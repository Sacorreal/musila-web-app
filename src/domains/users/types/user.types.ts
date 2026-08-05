import { TrackResponse } from '@/src/domains/tracks/types/track.types';

export interface UserDto {

    id: string
    name: string
    secondName: string
    lastName: string
    secondLastName: string
    planType: UserPlanTypeRegister
    role: MusicRole
    email: string
    password: string;
    countryCode: string;
    phone: string;
    typeCitizenID: string;
    citizenID: string;
    avatar: string;
    isVerified: boolean;
    biography: string;
    socialNetworks: Record<string, string>;
    tracks: TrackResponse[] | string[]
    preferredGenres: string[]
    guests: string[]
    playlists: string[]
    requestSent: string[]
    isUserFree: boolean;
    repeatPassword: string
}


export enum UserPlanType {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  PLAN_AUTOR = "plan_autor",
  PLAN_360 = "plan_360",
  PLAN_DESCUBRIDOR = "plan_descubridor",
  INVITADO = "invitado",
  PLAN_PUBLISHER = "plan_publisher",
}

/** Planes con privilegios administrativos: superadmin hereda todo lo que tiene admin. */
export const ADMIN_PLAN_TYPES: UserPlanType[] = [
  UserPlanType.SUPERADMIN,
  UserPlanType.ADMIN,
]

export const isAdminPlanType = (planType?: UserPlanType | string | null): boolean =>
  !!planType && (ADMIN_PLAN_TYPES as string[]).includes(planType)

/**
 * planes permitidos temporalmente para el registro de usuario, durante *MVP
 */
export enum UserPlanTypeRegister {
  PLAN_AUTOR = "plan_autor",
  PLAN_DESCUBRIDOR = "plan_descubridor",
  PLAN_360 = "plan_360",
}

/**
 * Rol descriptivo (disciplina musical) del usuario. No tiene ningún efecto
 * en permisos/acceso — solo es informativo.
 */
export enum MusicRole {
  AGRUPACION = "agrupacion",
  INTERPRETE = "interprete",
  COMPOSITOR = "compositor",
  CANTAUTOR = "cantautor",
  PRODUCTOR = "productor",
  INGENIERO = "ingeniero",
  MANAGER = "manager",
  A_R = "a_r",
}

export const MUSIC_ROLE_LABELS: Record<MusicRole, string> = {
  [MusicRole.AGRUPACION]: "Agrupación",
  [MusicRole.INTERPRETE]: "Intérprete",
  [MusicRole.COMPOSITOR]: "Compositor",
  [MusicRole.CANTAUTOR]: "Cantautor",
  [MusicRole.PRODUCTOR]: "Productor",
  [MusicRole.INGENIERO]: "Ingeniero",
  [MusicRole.MANAGER]: "Manager",
  [MusicRole.A_R]: "A&R",
}


type BaseUser = Pick<
  UserDto,
  | 'email'
  | 'name'
  | 'lastName'
  | 'planType'
  | 'role'
  | 'password'
  | 'repeatPassword'
  | 'countryCode'
  | 'phone'
  | 'typeCitizenID'
  | 'citizenID'
>

type OptionalUser = Partial<
  Pick<UserDto, 'secondName' | 'secondLastName'>
>

export type CreateUserInput = BaseUser & OptionalUser & {
  externalReference?: string
  /** Timestamp (epoch ms) de cuándo se mostró el formulario. Trampa de tiempo anti-bot. */
  formStartedAt: number
  /** Campo trampa anti-bot: debe llegar siempre vacío, nunca mostrar en la UI. */
  companyWebsite?: string
}



export type UpdateUserInput = Partial<CreateUserInput>

export type UserResponse = Omit<UserDto, ''>

