import { apiClient } from "@shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";

export const chatListService = {
  async getConversations() {
    const { data } = await apiClient.get<any>(apiURLs.requestedTracks.base);
    return data.data; // The backend returns { data: [], total: N }
  }
};
