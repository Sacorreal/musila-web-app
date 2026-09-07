import { Suspense } from "react";
import { ChatLayout } from "@/src/domains/chat/components/ChatLayout";

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatLayout />
    </Suspense>
  );
}
