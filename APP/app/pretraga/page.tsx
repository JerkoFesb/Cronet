"use client";

import Link from "next/link";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { Pagination } from "@/app/_components/Pagination";
import { FormSkeleton, ChatSkeleton, SearchResultsSkeleton } from "@/app/_components/SkeletonLoader";

const PAGE_SIZE = 5;

export default function PretragaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );
  
  // Form state
  const [formData, setFormData] = useState({
    lokacija: "",
    brzina: "",
    cijena: "",
    tip: ""
  });

  // Results state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Comparison state
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  // Restore last search when returning to the page (e.g. back from detalji)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("pretraga-state");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || { lokacija: "", brzina: "", cijena: "", tip: "" });
      setSearchResults(parsed.searchResults || []);
      setSearchPerformed(Boolean(parsed.searchPerformed));
      if (parsed.page) {
        void setPage(parsed.page);
      }
    } catch (err) {
      console.error("[PretragaPage] Failed to restore search state", err);
    }
  }, [setPage]);

  const currentPage = page ?? 1;
  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedResults = searchResults.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  useEffect(() => {
    const clamped = Math.min(Math.max(currentPage, 1), totalPages);
    if (clamped !== currentPage) {
      void setPage(clamped);
    }
  }, [currentPage, totalPages, setPage]);

  useEffect(() => {
    if (typeof window === "undefined" || !searchPerformed) return;
    sessionStorage.setItem("pretraga-state", JSON.stringify({
      formData,
      searchResults,
      searchPerformed,
      page: safePage,
    }));
  }, [formData, searchResults, searchPerformed, safePage]);

  // Restore and save selected providers
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("compare-selected");
    if (saved) {
      try {
        setSelectedProviders(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to restore selected providers", err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("compare-selected", JSON.stringify(selectedProviders));
  }, [selectedProviders]);

  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviders(prev =>
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  // Tehničko znanje korisnika
  const [tehnickoZnanje, setTehnickoZnanje] = useState<"početnik" | "srednje" | "napredno">("početnik");

  // AI Chatbot state - initialize from localStorage or with default greeting
  const [messages, setMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([
    { role: "assistant", content: "Bok! 👋 Kako vam mogu pomoći sa odabirom mreže?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  // Load chat messages from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedMessages = localStorage.getItem('cronet_chat_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          console.log('[Chat] Loaded', parsed.length, 'messages from localStorage');
        }
      } catch (e) {
        console.error('Error loading chat from localStorage:', e);
      }
    }
    setMessagesLoaded(true);
  }, []);

  // Save chat messages to localStorage whenever they change (keep last 20)
  const updateMessages = (newMessages: Array<{role: "user" | "assistant", content: string}>) => {
    setMessages(newMessages);
    // Keep only last 20 messages
    const toStore = newMessages.slice(-20);
    if (typeof window !== "undefined") {
      localStorage.setItem('cronet_chat_messages', JSON.stringify(toStore));
      console.log('[Chat] Saved', toStore.length, 'messages to localStorage');
    }
  };

  // Auto-save messages to localStorage whenever they change
  useEffect(() => {
    if (messagesLoaded && messages.length > 1) { // Only save if there are messages beyond the default greeting
      const toStore = messages.slice(-20);
      if (typeof window !== "undefined") {
        localStorage.setItem('cronet_chat_messages', JSON.stringify(toStore));
      }
    }
  }, [messages, messagesLoaded]);

  // Debug logging
  console.log('[PretragaPage] loading:', loading, 'user:', user);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FormSkeleton />
              <div className="mt-6">
                <SearchResultsSkeleton />
              </div>
            </div>
            <div>
              <ChatSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-12 w-12 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Morate biti ulogirani</h2>
          <p className="text-gray-600 mb-6">
            Da biste pristupili stranici za pretragu, potrebno je da se prijavite.
          </p>
          <button
            onClick={() => router.push("/prijava?callback=/pretraga")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Prijava
          </button>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchPerformed(true);

    try {
      // Kreiraj query parametre
      const params = new URLSearchParams();
      if (formData.lokacija) params.append("city", formData.lokacija);
      if (formData.brzina) params.append("minSpeed", formData.brzina);
      if (formData.cijena) params.append("maxPrice", formData.cijena);
      if (formData.tip) {
        // Mapiranje tip mreže na accessType
        const typeMap: Record<string, string> = {
          "optika": "FTTH",
          "adsl": "DSL",
          "kabel": "DOCSIS",
          "mobilna": "5G"
        };
        params.append("accessType", typeMap[formData.tip] || formData.tip);
      }
      params.append("sortBy", "price"); // Default sortiranje po cijeni

      console.log('[Search] Querying:', params.toString());

      const response = await fetch(`/api/provideri/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
      const nextPage = 1;
      void setPage(nextPage);
      sessionStorage.setItem("pretraga-state", JSON.stringify({
        formData,
        searchResults: data.results || [],
        searchPerformed: true,
        page: nextPage,
      }));
      
      console.log(`[Search] Found ${data.count} results`);
    } catch (error: any) {
      console.error('[Search] Error:', error);
      alert('Greška pri pretraz: ' + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent, quickMessage?: string) => {
    e.preventDefault();
    const messageToSend = quickMessage || inputMessage;
    if (!messageToSend.trim() || isLoading) return;

    // Dodaj korisničku poruku
    const userMessage = { role: "user" as const, content: messageToSend };
    const newMessages = [...messages, userMessage];
    updateMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    // Pripremi kontekst iz forme
    const context = {
      lokacija: formData.lokacija,
      brzina: formData.brzina,
      cijena: formData.cijena,
      tip: formData.tip,
      tehnickoZnanje: tehnickoZnanje === "početnik" 
        ? "Početnik - koristi jednostavne termine bez žargona" 
        : tehnickoZnanje === "srednje"
        ? "Srednje znanje - može razumjeti osnovne tehničke pojmove"
        : "Napredno - slobodno koristi tehničke detalje i metrike",
    };

    try {
      console.log('[Chat] Sending message with context:', context);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          context: context 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      console.log('[Chat] ✅ Received response');
      
      updateMessages([...newMessages, { 
        role: "assistant" as const, 
        content: data.message 
      }]);
    } catch (error: any) {
      console.error('[Chat] ❌ Error:', error);
      updateMessages([...newMessages, { 
        role: "assistant" as const, 
        content: "Ups! Došlo je do greške. " + (error.message || "Pokušajte ponovno.") 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Logika za smart tips
  const getSmartTip = () => {
    const hasLocation = formData.lokacija.trim() !== "";
    const hasBrzina = formData.brzina !== "";
    const hasCijena = formData.cijena !== "";
    const hasTip = formData.tip !== "";
    const filledFields = [hasLocation, hasBrzina, hasCijena, hasTip].filter(Boolean).length;
    const hasAskedAI = messages.length > 1; // Više od početne poruke

    if (filledFields === 0 && !hasAskedAI) {
      return {
        icon: "🎯",
        title: "Započni pretragu!",
        message: "Unesi svoje preferencije u formu ili pitaj AI asistenta za pomoć.",
        color: "bg-blue-50 border-blue-200 text-blue-800"
      };
    }

    if (!hasLocation) {
      return {
        icon: "📍",
        title: "Savjet: Dodaj lokaciju",
        message: "Unesi grad ili mjesto za točnije rezultate o dostupnosti providera.",
        color: "bg-yellow-50 border-yellow-200 text-yellow-800"
      };
    }

    if (!hasBrzina && !hasTip) {
      return {
        icon: "⚡",
        title: "Odaberi brzinu ili tip mreže",
        message: "Koja brzina ti treba? Gaming, streaming ili casual korištenje?",
        color: "bg-purple-50 border-purple-200 text-purple-800"
      };
    }

    if (filledFields >= 2 && !hasAskedAI) {
      return {
        icon: "💬",
        title: "Pitaj AI asistenta!",
        message: "Imaš pitanja o providerima ili tehnologijama? Naš AI može pomoći!",
        color: "bg-green-50 border-green-200 text-green-800"
      };
    }

    if (filledFields === 4) {
      return {
        icon: "✅",
        title: "Spremno za pretragu!",
        message: "Sve informacije su popunjene. Klikni 'Pretraži' za rezultate.",
        color: "bg-green-50 border-green-200 text-green-800"
      };
    }

    return {
      icon: "📝",
      title: "Nastavi popunjavati",
      message: `Popunjeno ${filledFields}/4 polja. Dodaj više detalja za bolje rezultate.`,
      color: "bg-gray-50 border-gray-200 text-gray-800"
    };
  };

  const currentTip = getSmartTip();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      {/* Smart Progress Bar sa Savjetima */}
      <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border-2 ${currentTip.color} transition-all duration-300`}>
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <span className="text-xl sm:text-2xl">{currentTip.icon}</span>
          <div className="flex-1">
            <h2 className="font-bold text-base sm:text-lg mb-1">{currentTip.title}</h2>
            <p className="text-xs sm:text-sm">{currentTip.message}</p>
          </div>
          
          {/* Progress indicator */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 w-full sm:w-auto">
            <span className="text-xs font-semibold opacity-70">Progres</span>
            <div className="flex gap-1">
              {[formData.lokacija, formData.brzina, formData.cijena, formData.tip].map((field, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    field ? 'bg-green-500 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* LIJEVA STRANA - FORMA */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8 flex flex-col" style={{minHeight: "400px"}}>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Filtriraj mreže</h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5 flex-1 flex flex-col">
              <div className="flex-1 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grad
                </label>
                <input
                  type="text"
                  value={formData.lokacija}
                  onChange={(e) => setFormData({...formData, lokacija: e.target.value})}
                  placeholder="Npr. Zagreb, Split..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brzina (Mbps)
                </label>
                <select
                  value={formData.brzina}
                  onChange={(e) => setFormData({...formData, brzina: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF82] focus:border-transparent"
                >
                  <option value="">Odaberi brzinu</option>
                  <option value="10">Do 10 Mbps</option>
                  <option value="50">Do 50 Mbps</option>
                  <option value="100">Do 100 Mbps</option>
                  <option value="200">Do 200 Mbps</option>
                  <option value="500">500+ Mbps</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cijena (€/mjesec)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.cijena}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") {
                      setFormData({ ...formData, cijena: "" });
                      return;
                    }
                    const num = Number(v);
                    setFormData({ ...formData, cijena: num < 0 ? "0" : v });
                  }}
                  placeholder="Max cijena"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF82] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tip mreže
                </label>
                <select
                  value={formData.tip}
                  onChange={(e) => setFormData({...formData, tip: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF82] focus:border-transparent"
                >
                  <option value="">Svi tipovi</option>
                  <option value="optika">Optika</option>
                  <option value="adsl">ADSL</option>
                  <option value="kabel">Kablovska</option>
                  <option value="mobilna">Mobilna</option>
                </select>
              </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4CAF82] text-white py-3 px-4 rounded-lg hover:bg-[#45a076] transition font-semibold shadow-md mt-auto"
              >
                Pretraži
              </button>
            </form>
          </div>
        </div>

        {/* DESNA STRANA - CHATBOT (3/4 širine lijeve forme) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 sm:p-6 flex flex-col" style={{minHeight: "400px", maxHeight: "600px"}}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 pb-4 border-b">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4CAF82] to-[#45a076] rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                AI
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">CroNet Asistent</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online · Powered by Groq AI
                </p>
              </div>
              
              {/* Tehničko znanje selector */}
              <div className="flex flex-col items-start sm:items-end gap-1 w-full sm:w-auto">
                <label className="text-xs text-gray-600 font-medium whitespace-nowrap">
                  Razina iskustva sa mrežama
                </label>
                <select 
                  value={tehnickoZnanje}
                  onChange={(e) => setTehnickoZnanje(e.target.value as any)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:ring-1 focus:ring-[#4CAF82] w-full"
                >
                  <option value="početnik">👶 Početnik</option>
                  <option value="srednje">👤 Srednje</option>
                  <option value="napredno">🎓 Napredno</option>
                </select>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={(e) => handleSendMessage(e, "Koja brzina mi treba za gaming?")}
                disabled={isLoading}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition disabled:opacity-50"
              >
                🎮 Gaming
              </button>
              <button
                onClick={(e) => handleSendMessage(e, "Što je razlika između optike i ADSL-a?")}
                disabled={isLoading}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition disabled:opacity-50"
              >
                💡 Tipovi mreža
              </button>
              <button
                onClick={(e) => handleSendMessage(e, "Preporuči mi najbolji paket za obitelj")}
                disabled={isLoading}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition disabled:opacity-50"
              >
                👨‍👩‍👧‍👦 Obitelj
              </button>
              <button
                onClick={(e) => handleSendMessage(e, "Koji provider je najbolji u mojoj lokaciji?")}
                disabled={isLoading}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition disabled:opacity-50"
              >
                📍 Moja lokacija
              </button>
            </div>

            {/* Chat messages sa auto-scroll */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 scroll-smooth">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-[#4CAF82] text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pitajte nešto..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF82] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-[#4CAF82] text-white px-6 py-2 rounded-lg hover:bg-[#45a076] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '...' : 'Pošalji'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Rezultati pretrage */}
      <div className="mt-8 sm:mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            {searchPerformed ? `Rezultati pretrage (${searchResults.length})` : 'Rezultati'}
          </h2>
          {searchResults.length > 0 && (
            <button
              onClick={() => {
                setSearchResults([]);
                setSearchPerformed(false);
                setFormData({ lokacija: "", brzina: "", cijena: "", tip: "" });
                void setPage(1);
                sessionStorage.removeItem("pretraga-state");
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Očisti pretragu
            </button>
          )}
        </div>

        {isSearching ? (
          <SearchResultsSkeleton />
        ) : searchPerformed && searchResults.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-6xl">😕</span>
            <p className="mt-4 text-xl font-semibold text-gray-800">Nema rezultata</p>
            <p className="mt-2 text-gray-600">Pokušaj promijeniti filtere pretrage</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            {selectedProviders.length > 0 && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-[#4CAF82] to-[#45a076] rounded-lg text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 shadow-lg">
                <div>
                  <p className="text-xs sm:text-sm font-semibold">Odabrano za usporedbu: <span className="text-xl sm:text-2xl font-bold">{selectedProviders.length}</span></p>
                </div>
                <Link
                  href={`/usporedba?providers=${selectedProviders.join(',')}`}
                  className="w-full sm:w-auto text-center px-4 sm:px-6 py-2 bg-white text-[#4CAF82] rounded-lg hover:bg-gray-100 transition font-semibold text-sm sm:text-base"
                >
                  Usporedi odabrane
                </Link>
              </div>
            )}
            <div className="grid gap-4">
            {paginatedResults.map((provider: any) => (
              <div 
                key={provider.id} 
                className="p-4 sm:p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-[#4CAF82] hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{provider.providerName}</h3>
                      <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-full">
                        {provider.accessType === 'FTTH' ? '🌟 Optika' : 
                         provider.accessType === 'DOCSIS' ? '📺 Kabel' :
                         provider.accessType === 'DSL' ? '📞 ADSL' :
                         provider.accessType === '5G' ? '📡 5G' : provider.accessType}
                      </span>
                      {provider.promotionActive && (
                        <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 text-xs sm:text-sm font-semibold rounded-full animate-pulse">
                          🔥 Akcija!
                        </span>
                      )}
                    </div>
                    
                    <p className="text-base sm:text-lg text-gray-700 mb-3">{provider.packageName}</p>
                    
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-2xl">⚡</span>
                        <div>
                          <p className="text-xs text-gray-500">Brzina</p>
                          <p className="font-bold text-sm sm:text-base">{provider.downloadMbps}/{provider.uploadMbps} Mbps</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-2xl">📍</span>
                        <div>
                          <p className="text-xs text-gray-500">Lokacija</p>
                          <p className="font-bold text-sm sm:text-base">{provider.city}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-2xl">⏱️</span>
                        <div>
                          <p className="text-xs text-gray-500">Latencija</p>
                          <p className="font-bold text-sm sm:text-base">{provider.latencyMs}ms</p>
                        </div>
                      </div>
                      
                      {provider.contractMonths > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-2xl">📝</span>
                          <div>
                            <p className="text-xs text-gray-500">Ugovor</p>
                            <p className="font-bold text-sm sm:text-base">{provider.contractMonths} mj</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ocjene */}
                    <div className="flex flex-wrap gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <span>🎮</span>
                        <span className="text-xs sm:text-sm font-semibold">{provider.scoreGaming}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📺</span>
                        <span className="text-xs sm:text-sm font-semibold">{provider.scoreStreaming}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>💼</span>
                        <span className="text-xs sm:text-sm font-semibold">{provider.scoreWork}/10</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👨‍👩‍👧‍👦</span>
                        <span className="text-xs sm:text-sm font-semibold">{provider.scoreFamily}/10</span>
                      </div>
                    </div>

                    {provider.promotionDescription && (
                      <p className="text-xs sm:text-sm text-red-600 font-semibold mb-2">
                        🎁 {provider.promotionDescription}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-gray-600">
                      {provider.ipv6Support && <span className="px-2 py-1 bg-green-100 text-green-700 rounded">✓ IPv6</span>}
                      {!provider.cgnat && <span className="px-2 py-1 bg-green-100 text-green-700 rounded">✓ Bez CGNAT</span>}
                      {provider.tvIncluded && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">📺 TV uključen</span>}
                      {provider.phoneIncluded && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">📞 Telefon uključen</span>}
                    </div>
                  </div>

                  <div className="w-full lg:w-auto text-left lg:text-right flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                    <div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4CAF82] mb-1">
                        {provider.priceEur.toFixed(2)}€
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1 lg:mb-2">/mjesec</p>
                      
                      {provider.installationFeeEur > 0 && (
                        <p className="text-xs text-gray-600 mb-2 lg:mb-3">
                          + {provider.installationFeeEur}€ instalacija
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`compare-${provider.id}`}
                          checked={selectedProviders.includes(provider.id)}
                          onChange={() => toggleProviderSelection(provider.id)}
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-[#4CAF82] focus:ring-[#4CAF82] cursor-pointer"
                        />
                        <label htmlFor={`compare-${provider.id}`} className="text-xs sm:text-sm text-gray-600 cursor-pointer">
                          Usporedi
                        </label>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/pretraga/${provider.id}`}
                          className="inline-block px-4 sm:px-6 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#3A7BC8] transition font-semibold text-center text-sm sm:text-base"
                        >
                          Detalji
                        </Link>
                        {provider.websiteUrl && (
                          <a
                            href={provider.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 sm:px-6 py-2 bg-[#4CAF82] text-white rounded-lg hover:bg-[#45a076] transition font-semibold text-sm sm:text-base text-center"
                          >
                            Saznaj više →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
            {totalPages > 1 && (
              <Pagination currentPage={safePage} totalPages={totalPages} className="mt-6" />
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-6xl">🔍</span>
            <p className="mt-4 text-xl font-semibold text-gray-800">Popuni formu i pretraži</p>
            <p className="mt-2 text-gray-600">Unesi svoje preferencije za prilagođene rezultate</p>
          </div>
        )}
      </div>
    </div>
  );
}