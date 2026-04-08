import { TrackSummary } from '@/src/domains/tracks/types/track.types';

export interface User {

    id: string
    name: string
    secondName: string
    lastName: string
    secondLastName: string
    role: UserRoleRegister
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
    tracks: TrackSummary[] | string[]
    preferredGenres: string[]
    guests: string[]
    playlists: string[]
    requestSent: string[]
    isUserFree: boolean;
    repeatPassword: string
}


export enum UserRole {
  ADMIN = "admin",
  AUTOR = "autor",
  INTERPRETE = "interprete",
  CANTAUTOR = "cantautor",
  INVITADO = "invitado",
  EDITOR = "editor",
}

/**
 * roles para el registro de usuario permitidos temporalmente, durante *MVP
 */
export enum UserRoleRegister {
  AUTOR = "autor",
  INTERPRETE = "interprete",
  CANTAUTOR = "cantautor",
}


type BaseUser = Pick<
  User,
  | 'email'
  | 'name'
  | 'lastName'
  | 'role'
  | 'password'
  | 'repeatPassword'
  | 'countryCode'
  | 'phone'
  | 'typeCitizenID'
  | 'citizenID'
>

type OptionalUser = Partial<
  Pick<User, 'secondName' | 'secondLastName'>
>

export type CreateUserDTO = BaseUser & OptionalUser



export type UpdateUserDTO = Partial<CreateUserDTO>

export type UserResponseDTO = Omit<User, ''>


