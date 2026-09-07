export enum CollaboratorPermission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
}

export interface AdminPlaylistCollaboratorDto {
  id: string
  guest: { id: string; name: string; lastName: string; email: string }
  permission: CollaboratorPermission
  createdAt: string
}

export interface AddCollaboratorAdminInput {
  guestId: string
  permission?: CollaboratorPermission
}
