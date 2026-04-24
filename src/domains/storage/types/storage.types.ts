export interface UploadableFileDto {
    field: UploadField
    file: File
    folder: StorageFolder
  }
  


  export interface PresignedUrlResponse {
    urls: {
      field: UploadField
      uploadUrl: string
      publicUrl: string
      key: string;
    }[]
  }

  export enum StorageFolder {
    TRACK_AUDIO = 'tracks/audio',
    TRACK_COVER = 'tracks/covers',
    USER_AVATAR = 'users/avatars',
    DOCUMENTS = 'documents',
  }

export interface UploadedFileDto {
  field: string;
  key: string;
  publicUrl: string;
}


  export type UploadField = "audio" | "cover" | "avatar" | "document";