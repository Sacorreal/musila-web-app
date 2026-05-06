import { GuestResponse } from "../../guests/types/guests.types";

export enum CollaboratorPermission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
}

export interface PlaylistCollaboratorResponse {
  id: string;
  playlistId: string;
  guestId: string;
  permission: CollaboratorPermission;
  addedAt: string;
  guest?: GuestResponse;
}

export interface AddCollaboratorInput {
  guestId: string;
  permission?: CollaboratorPermission;
}

export interface AddMultipleCollaboratorsInput {
  collaborators: AddCollaboratorInput[];
}
