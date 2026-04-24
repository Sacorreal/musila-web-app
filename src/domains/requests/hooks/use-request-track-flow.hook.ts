import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { useUploadStorage } from "@/src/domains/storage/hooks/use-upload-storage";
import { createRequestedTrack } from "@/src/domains/requests/services/requested-tracks.actions";
import { chatSocketService } from "@/src/domains/chat/services/chat-socket.service";
import { LicenseType } from "@/src/domains/tracks/types/track.types";
import { StorageFolder, UploadField } from "@/src/domains/storage/types/storage.types";

export interface RequestTrackFlowInput {
  trackId: string;
  licenseType: LicenseType;
  message: string;
  file?: File;
}

export function useRequestTrackFlow() {
  const { user, token } = useAuthStore();
  const uploadStorage = useUploadStorage();
  const [isConnectingSocket, setIsConnectingSocket] = useState(false);

  const mutation = useMutation({
    mutationFn: async (input: RequestTrackFlowInput) => {
      if (!user || !token) {
        throw new Error("Debes iniciar sesión para realizar esta acción.");
      }

      let fileUrl: string | undefined;
      let fileKey: string | undefined;
      let fileName: string | undefined;

      // 1. Upload File if present
      if (input.file) {
        const uploadResult = await uploadStorage.mutateAsync([{
          field: "document" as UploadField,
          file: input.file,
          folder: StorageFolder.DOCUMENTS,
        }]);

        const documentUpload = uploadResult.find((r) => r.field === "document");
        if (documentUpload) {
          fileUrl = documentUpload.publicUrl;
          fileKey = documentUpload.key;
          fileName = input.file.name;
        }
      }

      // 2. Create the Request
      const requestResponse = await createRequestedTrack({
        trackId: input.trackId,
        licenseType: input.licenseType,
      });

      const chatId = requestResponse.chat?.id;
      if (!chatId) {
        throw new Error("No se pudo obtener el chat de la solicitud.");
      }

      // 3. Connect to WebSocket & Send Message
      setIsConnectingSocket(true);
      
      try {
        const socket = chatSocketService.connect(token);
        
        // Esperamos un momento breve para que la conexión se establezca si es la primera vez
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        chatSocketService.joinChat(chatId);
        
        chatSocketService.sendMessage({
          userId: user.id,
          chatId,
          content: input.message,
          type: input.file ? "FILE" : "TEXT",
          fileUrl,
          filekey: fileKey,
          fileName,
        });
      } finally {
        setIsConnectingSocket(false);
      }

      return requestResponse;
    },
  });

  return {
    ...mutation,
    uploadProgress: uploadStorage.progresses["document"] || 0,
    isConnectingSocket,
  };
}
