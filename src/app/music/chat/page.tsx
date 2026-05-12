"use client";

import React, { useState } from "react";
import { ConversationList } from "@/src/domains/chat/components/ConversationList";
import { ChatWindow } from "@/src/domains/chat/components/ChatWindow";
import { ArrowLeft, Music2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <main className="flex h-[calc(100vh-120px)] bg-background rounded-2xl md:rounded-3xl overflow-hidden border border-border shadow-2xl m-2 md:m-8">
      {/* Left Sidebar: Conversations — hidden on mobile when a chat is selected */}
      <div
        className={`
          w-full md:w-80 lg:w-96 border-r border-border bg-card flex-shrink-0
          ${selectedChatId ? "hidden md:flex md:flex-col" : "flex flex-col"}
        `}
      >
        <ConversationList
          selectedChatId={selectedChatId || undefined}
          onSelectChat={setSelectedChatId}
        />
      </div>

      {/* Right Content: Chat Window — full screen on mobile when selected */}
      <div
        className={`
          flex-1 flex flex-col min-w-0
          ${selectedChatId ? "flex" : "hidden md:flex"}
        `}
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
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.01] p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Music2 className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Selecciona un chat</h3>
            <p className="text-muted-foreground max-w-sm">
              Elige una conversación de la lista para empezar a chatear sobre tus licencias y colaboraciones.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
