"use client";

import { FloatingChat } from "./FloatingChat";

export function FloatingChatWrapper() {
  const handleOpenPretragaChat = () => {
    const chatElement = document.querySelector('[data-chat-section]');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return <FloatingChat onOpenPretragaChat={handleOpenPretragaChat} />;
}
