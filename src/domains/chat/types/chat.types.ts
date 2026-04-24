import { UserDto } from "../../users/types/user.types";

export interface Message {
  id: string;
  chatId: string;
  sender: UserDto;
  content: string;
  type: "TEXT" | "FILE";
  fileUrl?: string;
  fileKey?: string;
  fileName?: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  request: any; // We'll use the request data to show track info
  messages?: Message[];
  guests?: any[];
  createdAt: string;
}
