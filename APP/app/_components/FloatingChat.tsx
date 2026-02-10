"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface FloatingChatProps {
  onOpenPretragaChat?: () => void;
  isPretragaChatOpen?: boolean;
}

export function FloatingChat({ onOpenPretragaChat, isPretragaChatOpen }: FloatingChatProps) {
  const pathname = usePathname();
  const isPretragaPage = pathname === "/pretraga";
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([
    { role: "assistant", content: "Bok! Ja sam tvoj CroNet asistent. Kako ti mogu pomoći?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  
  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasBeenDragged, setHasBeenDragged] = useState(false);
  const chatPanelRef = useRef<HTMLDivElement>(null);

  // Reset drag state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setHasBeenDragged(false);
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || 
        (e.target as HTMLElement).tagName === 'BUTTON' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }
    // On first drag, capture the current CSS position and switch to left/top positioning
    if (!hasBeenDragged && chatPanelRef.current) {
      const rect = chatPanelRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
      setHasBeenDragged(true);
    }
    setIsDragging(true);
    if (hasBeenDragged) {
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    } else if (chatPanelRef.current) {
      const rect = chatPanelRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Keep within viewport bounds
    const panelWidth = 320; 
    const panelHeight = 500; 
    const maxX = window.innerWidth; // Dopusti da ide do kraja + malo dalje
    const maxY = window.innerHeight - panelHeight;
    
    setPosition({
      x: Math.max(-panelWidth + 50, Math.min(newX, maxX)), 
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  // Load chat messages from localStorage on mount (samo za ne-pretraga stranice)
  useEffect(() => {
    if (isPretragaPage || typeof window === "undefined") return;
    
    const savedMessages = localStorage.getItem('cronet_floating_chat_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Error loading chat from localStorage:', e);
      }
    }
    setMessagesLoaded(true);
  }, [isPretragaPage]);

  // Save messages to localStorage (samo za ne-pretraga stranice)
  useEffect(() => {
    if (isPretragaPage || !messagesLoaded || messages.length <= 1) return;
    
    const toStore = messages.slice(-20);
    if (typeof window !== "undefined") {
      localStorage.setItem('cronet_floating_chat_messages', JSON.stringify(toStore));
    }
  }, [messages, messagesLoaded, isPretragaPage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message) {
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error("No message in response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Oprosti, došlo je do greške. Pokušaj ponovo." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Bok! Ja sam tvoj CroNet asistent. Kako ti mogu pomoći?" }]);
    if (!isPretragaPage && typeof window !== "undefined") {
      localStorage.removeItem('cronet_floating_chat_messages');
    }
  };

  const handleButtonClick = () => {
    if (isPretragaPage && onOpenPretragaChat) {
      // Na pretraga stranici, otvori postojeći chat
      onOpenPretragaChat();
    } else {
      // Na drugim stranicama, otvori floating chat
      setIsOpen(!isOpen);
    }
  };

  // Ne prikazuj floating chat panel ako smo na pretraga stranici
  const showFloatingPanel = !isPretragaPage && isOpen;

  return (
    <>
      {/* Chat Panel - samo na drugim stranicama */}
      {showFloatingPanel && (
        <div 
          ref={chatPanelRef}
          onMouseDown={handleMouseDown}
          className="fixed w-[calc(100vw-3rem)] sm:w-80 h-[min(500px,80vh)] bg-white rounded-2xl shadow-2xl border-2 border-[#4CAF82] flex flex-col z-50 animate-chat-slide-up"
          style={hasBeenDragged ? {
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          } : {
            right: '24px',
            bottom: '120px',
            cursor: 'grab'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4CAF82] to-[#45a076] text-white p-3 rounded-t-2xl flex justify-between items-center cursor-grab">
            <div>
              <h3 className="font-bold text-base">CroNet AI</h3>
              <p className="text-xs opacity-90">Brzi chat · Povuci za pomicanje</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="text-white hover:bg-white/20 px-2 py-1 rounded text-xs transition"
              >
                Očisti
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-6 h-6 rounded-full flex items-center justify-center transition text-sm"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-[#4CAF82] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-xl rounded-bl-none">
                  <p className="text-sm">...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pitaj nešto..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF82] focus:border-transparent disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-[#4CAF82] text-white px-4 py-2 rounded-lg hover:bg-[#45a076] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? '...' : '→'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button sa labelom */}
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-2 z-50">
        {/* Label */}
        <div className="bg-white px-3 py-1 rounded-full shadow-lg border border-gray-200">
          <span className="text-xs font-semibold text-gray-700">AI asistent</span>
        </div>
        
        {/* Button */}
        <button
          onClick={handleButtonClick}
          className={`w-14 h-14 bg-gradient-to-r from-[#4CAF82] to-[#45a076] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center ${
            isPretragaPage && isPretragaChatOpen ? 'ring-4 ring-[#4CAF82]/30' : ''
          }`}
          aria-label="Otvori chat"
        >
          {(isPretragaPage && isPretragaChatOpen) || (!isPretragaPage && isOpen) ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">💬</span>
          )}
        </button>
      </div>
    </>
  );
}
