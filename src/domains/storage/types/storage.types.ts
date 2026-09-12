export interface UploadableFileDto {
    field: UploadField
    file: File
    folder: StorageFolder | string
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
    TRACK_SHEET_MUSIC = 'tracks/sheet-music',
    USER_AVATAR = 'users/avatars',
    DOCUMENTS = 'documents',
    CHAT_DOCUMENTS = 'chat',
    INTELLECTUAL_PROPERTY = 'intellectual-property',
    BLOG_ARTICLE_COVER = 'blog/articles/covers',
    BLOG_AUTHOR_AVATAR = 'blog/authors/avatars',
    REGISTRATION_FILE_DOCUMENTS = 'registration-file/documents',
    PUBLISHING_CONTRACT_DOCS = 'publishing-contracts/documents',
    CAMPAIGN_COVER = 'campaigns/covers',
  }

export interface UploadedFileDto {
  field: string;
  key: string;
  publicUrl: string;
}


  export type UploadField = "audio" | "cover" | "sheetMusic" | "avatar" | "document" | "chatFile" | `ip_doc_${number}` | "blogArticleCover" | "blogAuthorAvatar" | "publishingContractDoc" | `rf_doc_${string}`;