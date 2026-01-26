import type { UserRole } from '@/src/domains/users/types/user.type'
import type { ComponentType } from "react"

export interface User {
  id: string
  email: string
  name: string
  lastName?: string
  artisticName?: string
  role: "COMPOSER" | "INTERPRETER" | "ADMIN"
  avatar?: string
  bio?: string
  preferredGenres?: MusicalGenre[]
  createdAt: string
}

export interface Track {
  id: string
  title: string
  description?: string
  audioUrl: string
  coverUrl?: string
  duration: number
  bpm?: number
  key?: string
  genre?: MusicalGenre
  language?: Language
  author: User
  authorId: string
  isPublished: boolean
  allowRequests: boolean
  createdAt: string
  updatedAt: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  coverUrl?: string
  isPublic: boolean
  tracks: Track[]
  user: User
  userId: string
  createdAt: string
  updatedAt: string
}

export interface RequestedTrack {
  id: string
  track: Track
  trackId: string
  requester: User
  requesterId: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  message?: string
  response?: string
  createdAt: string
  updatedAt: string
}

export interface MusicalGenre {
  id: string
  name: string
  description?: string
}

export interface Language {
  id: string
  name: string
  code: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name: string
  lastName?: string
  artisticName?: string
  role: "COMPOSER" | "INTERPRETER"
}


export interface MenuRoute {
  href: string
  icon: ComponentType<{ className?: string }>
  label: string
  rolAccess: UserRole[]
}

export type NavItems = MenuRoute[]