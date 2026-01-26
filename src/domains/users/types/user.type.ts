import { User } from '../models/user.model'

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
  AUTOR = "Autor",
  INTERPRETE = "Interprete",
  CANTAUTOR = "Cantautor",
}


type BaseUser = Pick<
  User,
  | 'email'
  | 'name'
  | 'lastName'
  | 'rol'
  | 'password'
  | 'repeatPassword'
  | 'countryCode'
  | 'phone'
>

type OptionalUser = Partial<
  Pick<User, 'secondName' | 'secondLastName'>
>

export type CreateUserDTO = BaseUser & OptionalUser



export type UpdateUserDTO = Partial<CreateUserDTO>

export type UserResponseDTO = Omit<User, ''>
