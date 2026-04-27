import { UserDto } from "../../users/types/user.types";

export type MessageType = "TEXT" | "FILE" | "IMAGE";

export interface Message {
  id: string;
  chatId: string;
  sender: UserDto;
  content: string;
  type: MessageType;
  fileUrl?: string;
  fileKey?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  request: any; // We'll use the request data to show track info
  messages?: Message[];
  guests?: any[];
  createdAt: string;
}
