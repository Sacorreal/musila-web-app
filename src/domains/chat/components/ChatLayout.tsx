"use client";

import React, { useState } from "react";
import { ConversationList } from "@/src/domains/chat/components/ConversationList";
import { ChatWindow } from "@/src/domains/chat/components/ChatWindow";
import { ChatEmptyState } from "@/src/domains/chat/components/ChatEmptyState";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { cn } from "@/src/shared/libs/cn";

export function ChatLayout() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <main className="flex h-[calc(100dvh-80px)] md:h-[calc(100vh-120px)] bg-background rounded-lg sm:rounded-2xl md:rounded-3xl overflow-hidden border border-border shadow-2xl m-1 sm:m-2 md:m-8">
      {/* Left Sidebar: Conversations — hidden on mobile when a chat is selected */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 border-r border-border bg-card flex-shrink-0",
          selectedChatId ? "hidden md:flex md:flex-col" : "flex flex-col",
        )}
      >
        <ConversationList
          selectedChatId={selectedChatId || undefined}
          onSelectChat={setSelectedChatId}
        />
      </div>

      {/* Right Content: Chat Window — full screen on mobile when selected */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          selectedChatId ? "flex" : "hidden md:flex",
        )}
      >
        {selectedChatId ? (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Mobile back button */}
            <div className="md:hidden flex items-center px-3 py-2 border-b border-border bg-card flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChatId(null)}
                className="gap-2 text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Conversaciones
              </Button>
            </div>
            <ChatWindow chatId={selectedChatId} />
          </div>
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </main>
  );
}
