"use client";

import Link from "next/link";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Provider {
  id: string;
  providerName: string;
  packageName: string;
  city: string;
  downloadMbps: number;
  uploadMbps: number;
  priceEur: number;
  accessType: string;
  latencyMs: number;
  contractMonths: number;
  installationFeeEur: number;
  promotionActive: boolean;
  promotionDetails: string | null;
  scoreGaming: number;
  scoreStreaming: number;
  scoreWork: number;
  scoreFamily: number;
  ipv6Support: boolean;
  cgnat: boolean;
  tvIncluded: boolean;
  phoneIncluded: boolean;
  websiteUrl: string;
}

export default function UsporedbaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/prijava?callback=/usporedba");
      return;
    }

    const providersParam = searchParams.get("providers");
    if (!providersParam) {
      setError("Nisu odabrani provideri za usporedbu");
      setIsLoading(false);
      return;
    }

    const providerIds = providersParam.split(",").map(id => id.trim()).filter(id => id.length > 0);
    if (providerIds.length === 0) {
      setError("Nisu odabrani provideri za usporedbu");
      setIsLoading(false);
      return;
    }

    const fetchProviders = async () => {
      try {
        console.log('[Usporedba] Fetching providers:', providerIds);
        const responses = await Promise.all(
          providerIds.map(id =>
            fetch(`/api/provideri/search?id=${encodeURIComponent(id)}`)
              .then(res => {
                console.log(`[Usporedba] Response for ID ${id}:`, res.status);
                return res.json();
              })
              .then(data => {
                console.log(`[Usporedba] Data for ID ${id}:`, data);
                return data.results?.[0];
              })
              .catch(err => {
                console.error(`[Usporedba] Error fetching ID ${id}:`, err);
                return null;
              })
          )
        );

        console.log('[Usporedba] All responses:', responses);
        const validProviders = responses.filter(Boolean);
        if (validProviders.length === 0) {
          setError("Provideri nisu pronađeni. Provjerite URL.");
        } else {
          setProviders(validProviders);
        }
      } catch (err: any) {
        setError("Greška pri učitavanju providera: " + err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [loading, user, searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF82] mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF82] mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje providera...</p>
        </div>
      </div>
    );
  }

  if (error || providers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Link
            href="/pretraga"
            className="inline-flex items-center text-[#4A90E2] hover:text-[#3A7BC8] font-semibold mb-6 md:mb-8 transition group text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Natrag na pretragu
          </Link>
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-4xl sm:text-6xl">😕</span>
            <p className="mt-4 text-lg sm:text-xl font-semibold text-gray-800">{error || "Nema dostupnih providera"}</p>
            <p className="mt-2 text-sm sm:text-base text-gray-600">Odaberi bar dva providera za usporedbu</p>
          </div>
        </div>
      </div>
    );
  }

  // Računanje preporuka
  const getRecommendations = () => {
    const recommendations = {
      bestGaming: providers.reduce((best, p) => p.scoreGaming > best.scoreGaming ? p : best),
      bestStreaming: providers.reduce((best, p) => p.scoreStreaming > best.scoreStreaming ? p : best),
      bestWork: providers.reduce((best, p) => p.scoreWork > best.scoreWork ? p : best),
      bestFamily: providers.reduce((best, p) => p.scoreFamily > best.scoreFamily ? p : best),
      bestValue: providers.reduce((best, p) => (p.downloadMbps / p.priceEur) > (best.downloadMbps / best.priceEur) ? p : best),
      cheapest: providers.reduce((best, p) => p.priceEur < best.priceEur ? p : best),
      fastest: providers.reduce((best, p) => p.downloadMbps > best.downloadMbps ? p : best),
    };
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <Link
          href="/pretraga"
          className="inline-flex items-center text-[#4A90E2] hover:text-[#3A7BC8] font-semibold mb-6 md:mb-8 transition group text-sm sm:text-base"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Natrag na pretragu
        </Link>

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Usporedba providera</h1>
          <p className="text-sm sm:text-base text-gray-600">Detaljno poređenje odabranih mrežnih providera</p>
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="text-2xl sm:text-3xl mb-2">🏆</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Najbolji za Gaming</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">{recommendations.bestGaming.providerName}</p>
            <div className="bg-white/20 p-2 rounded">
              <p className="text-xl sm:text-2xl font-bold">{recommendations.bestGaming.scoreGaming}/10</p>
              <p className="text-xs text-white/80">Gaming ocjena</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="text-2xl sm:text-3xl mb-2">📺</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Najbolji za Streaming</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">{recommendations.bestStreaming.providerName}</p>
            <div className="bg-white/20 p-2 rounded">
              <p className="text-xl sm:text-2xl font-bold">{recommendations.bestStreaming.scoreStreaming}/10</p>
              <p className="text-xs text-white/80">Streaming ocjena</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="text-2xl sm:text-3xl mb-2">💼</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Najbolji za Rad</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">{recommendations.bestWork.providerName}</p>
            <div className="bg-white/20 p-2 rounded">
              <p className="text-xl sm:text-2xl font-bold">{recommendations.bestWork.scoreWork}/10</p>
              <p className="text-xs text-white/80">Rad od kuće ocjena</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="text-2xl sm:text-3xl mb-2">👨‍👩‍👧‍👦</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Najbolji za Obitelj</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">{recommendations.bestFamily.providerName}</p>
            <div className="bg-white/20 p-2 rounded">
              <p className="text-xl sm:text-2xl font-bold">{recommendations.bestFamily.scoreFamily}/10</p>
              <p className="text-xs text-white/80">Obitelj ocjena</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="text-2xl sm:text-3xl mb-2">💰</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Najbolja Vrijednost</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">{recommendations.bestValue.providerName}</p>
            <div className="bg-white/20 p-2 rounded">
              <p className="text-xl sm:text-2xl font-bold">{(recommendations.bestValue.downloadMbps / recommendations.bestValue.priceEur).toFixed(2)}</p>
              <p className="text-xs text-white/80">Mbps po €</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition">
            <div className="text-2xl sm:text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Najbrži</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-2 sm:mb-3">{recommendations.fastest.providerName}</p>
            <div className="bg-white/20 p-2 rounded">
              <p className="text-xl sm:text-2xl font-bold">{recommendations.fastest.downloadMbps}</p>
              <p className="text-xs text-white/80">Mbps Download</p>
            </div>
          </div>
        </div>

        {/* Ai Insights */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border-2 border-indigo-200">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="text-3xl sm:text-4xl md:text-5xl">🤖</div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">AI Analiza i Preporuke</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">📊 Analiza Cijena</h3>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    <strong>{recommendations.cheapest.providerName}</strong> je <strong>najjeftiniji</strong> sa €{recommendations.cheapest.priceEur}/mj.
                    Razlika od skupljeg je do €{(providers.reduce((max, p) => Math.max(max, p.priceEur), 0) - recommendations.cheapest.priceEur).toFixed(2)}/mj.
                  </p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">⚡ Analiza Brzine</h3>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    <strong>{recommendations.fastest.providerName}</strong> je <strong>najbrži</strong> sa {recommendations.fastest.downloadMbps} Mbps.
                    To je {recommendations.fastest.downloadMbps - providers.reduce((min, p) => Math.min(min, p.downloadMbps), recommendations.fastest.downloadMbps)} Mbps više od sporijeg.
                  </p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">💎 Najbolja Vrijednost</h3>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    <strong>{recommendations.bestValue.providerName}</strong> daje <strong>najbolji omjer cijena/performansi</strong> sa {(recommendations.bestValue.downloadMbps / recommendations.bestValue.priceEur).toFixed(2)} Mbps za svaki euro.
                  </p>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">🎯 Moja Preporuka</h3>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    Za <strong>opću namjenu</strong>, preporučujem <strong>{recommendations.bestValue.providerName}</strong> jer nudi najbolji balans između cijene i performansi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Headers - Sticky na vrhu */}
        <div className="overflow-x-auto mb-6 md:mb-8 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: `repeat(${providers.length}, minmax(250px, 1fr))`, minWidth: providers.length > 1 ? '500px' : 'auto' }}>
            {providers.map(provider => (
              <div key={provider.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#4CAF82]">
                <div className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] p-4 sm:p-6 text-white">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">€{provider.priceEur.toFixed(2)}</div>
                  <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{provider.providerName}</p>
                  <p className="text-xs sm:text-sm text-white/90">{provider.packageName}</p>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/30">
                    <span className="px-2 sm:px-3 py-1 bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-full">
                      {provider.accessType === 'FTTH' ? '🌟 Optika' :
                       provider.accessType === 'DOCSIS' ? '📺 Kabel' :
                       provider.accessType === 'DSL' ? '📞 ADSL' :
                       provider.accessType === '5G' ? '📡 5G' : provider.accessType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="space-y-3 sm:space-y-4">
          {/* Brzine */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 font-bold text-gray-800 border-l-4 border-[#4CAF82] text-sm sm:text-base">
              ⚡ Brzina i performanse
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="grid gap-3 sm:gap-4 p-4 sm:p-6" style={{ gridTemplateColumns: `minmax(100px, 150px) repeat(${providers.length}, minmax(150px, 1fr))`, minWidth: providers.length > 1 ? '400px' : 'auto' }}>
                <div className="font-semibold text-gray-700 text-sm sm:text-base">Download</div>
                {providers.map(p => (
                  <div key={p.id} className="text-lg sm:text-xl md:text-2xl font-bold text-[#4CAF82]">{p.downloadMbps} Mbps</div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">Upload</div>
                {providers.map(p => (
                  <div key={p.id} className="text-lg sm:text-xl md:text-2xl font-bold text-[#4CAF82]">{p.uploadMbps} Mbps</div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">Latencija</div>
                {providers.map(p => (
                  <div key={p.id} className="text-base sm:text-lg font-semibold text-gray-700">{p.latencyMs} ms</div>
                ))}
              </div>
            </div>
          </div>

          {/* Cijena */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 font-bold text-gray-800 border-l-4 border-green-500 text-sm sm:text-base">
              💰 Cijena
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="grid gap-3 sm:gap-4 p-4 sm:p-6" style={{ gridTemplateColumns: `minmax(100px, 150px) repeat(${providers.length}, minmax(150px, 1fr))`, minWidth: providers.length > 1 ? '400px' : 'auto' }}>
                <div className="font-semibold text-gray-700 text-sm sm:text-base">Mjesečna cijena</div>
                {providers.map(p => (
                  <div key={p.id} className="text-xl sm:text-2xl md:text-3xl font-bold text-[#4CAF82]">€{p.priceEur.toFixed(2)}</div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">Godišnja cijena</div>
                {providers.map(p => (
                  <div key={p.id} className="text-base sm:text-lg font-semibold text-gray-600">€{(p.priceEur * 12).toFixed(2)}</div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">Instalacija</div>
                {providers.map(p => (
                  <div key={p.id} className="text-base sm:text-lg font-semibold text-gray-600">€{p.installationFeeEur.toFixed(2)}</div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">Ugovor</div>
                {providers.map(p => (
                  <div key={p.id} className="text-base sm:text-lg font-semibold text-gray-600">{p.contractMonths > 0 ? `${p.contractMonths} mj` : 'Bez'}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Ocjene */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 font-bold text-gray-800 border-l-4 border-blue-500 text-sm sm:text-base">
              ⭐ Ocjene za različite namjene
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="grid gap-3 sm:gap-4 p-4 sm:p-6" style={{ gridTemplateColumns: `minmax(100px, 150px) repeat(${providers.length}, minmax(150px, 1fr))`, minWidth: providers.length > 1 ? '400px' : 'auto' }}>
                <div className="font-semibold text-gray-700 text-sm sm:text-base">🎮 Gaming</div>
                {providers.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div className="bg-[#4CAF82] h-1.5 sm:h-2 rounded-full" style={{ width: `${p.scoreGaming * 10}%` }}></div>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700 w-10 sm:w-12 text-right text-xs sm:text-sm">{p.scoreGaming}/10</span>
                  </div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">📺 Streaming</div>
                {providers.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div className="bg-purple-500 h-1.5 sm:h-2 rounded-full" style={{ width: `${p.scoreStreaming * 10}%` }}></div>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700 w-10 sm:w-12 text-right text-xs sm:text-sm">{p.scoreStreaming}/10</span>
                  </div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">💼 Rad od kuće</div>
                {providers.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div className="bg-blue-500 h-1.5 sm:h-2 rounded-full" style={{ width: `${p.scoreWork * 10}%` }}></div>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700 w-10 sm:w-12 text-right text-xs sm:text-sm">{p.scoreWork}/10</span>
                  </div>
                ))}

                <div className="font-semibold text-gray-700 text-sm sm:text-base">👨‍👩‍👧‍👦 Za obitelj</div>
                {providers.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div className="bg-pink-500 h-1.5 sm:h-2 rounded-full" style={{ width: `${p.scoreFamily * 10}%` }}></div>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-700 w-10 sm:w-12 text-right text-xs sm:text-sm">{p.scoreFamily}/10</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Opcije */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 font-bold text-gray-800 border-l-4 border-yellow-500 text-sm sm:text-base">
              ✨ Dodatne opcije
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="grid gap-3 sm:gap-4 p-4 sm:p-6" style={{ gridTemplateColumns: `minmax(100px, 150px) repeat(${providers.length}, minmax(120px, 1fr))`, minWidth: providers.length > 1 ? '400px' : 'auto' }}>
                <div className="font-semibold text-gray-700 text-sm sm:text-base">IPv6 podrška</div>
                {providers.map(p => (
                  <div key={p.id}>
                    {p.ipv6Support ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-semibold">✓ DA</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded font-semibold">✗ NE</span>
                    )}
                  </div>
                ))}

                <div className="font-semibold text-gray-700">Bez CGNAT</div>
                {providers.map(p => (
                  <div key={p.id}>
                    {!p.cgnat ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-semibold">✓ DA</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded font-semibold">✗ CGNAT</span>
                    )}
                  </div>
                ))}

                <div className="font-semibold text-gray-700">TV uključen</div>
                {providers.map(p => (
                  <div key={p.id}>
                    {p.tvIncluded ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-semibold">✓ DA</span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded font-semibold">✗ NE</span>
                    )}
                  </div>
                ))}

                <div className="font-semibold text-gray-700">Telefon uključen</div>
                {providers.map(p => (
                  <div key={p.id}>
                    {p.phoneIncluded ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-semibold">✓ DA</span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded font-semibold">✗ NE</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 md:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Kontaktiraj Providera</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {providers.map(provider => (
                <div key={provider.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-[#4A90E2] transition">
                  <div className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] p-4 sm:p-6 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">{provider.providerName}</h3>
                    <p className="text-white/90 text-xs sm:text-sm">{provider.packageName}</p>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Cijena:</p>
                      <p className="text-2xl sm:text-3xl font-bold text-[#4CAF82]">€{provider.priceEur.toFixed(2)}/mj</p>
                    </div>

                    <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl">⚡</span>
                        <div>
                          <p className="text-xs text-gray-600">Brzina</p>
                          <p className="font-semibold text-sm sm:text-base">{provider.downloadMbps} Mbps</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl">📍</span>
                        <div>
                          <p className="text-xs text-gray-600">Lokacija</p>
                          <p className="font-semibold text-sm sm:text-base">{provider.city}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {provider.websiteUrl && (
                        <a
                          href={provider.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full block text-center px-4 py-2 sm:py-3 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white font-bold rounded-lg hover:shadow-lg transition text-sm sm:text-base"
                        >
                          Posjeti stranicu →
                        </a>
                      )}
                      <button
                        onClick={() => router.push("/pretraga")}
                        className="w-full px-4 py-2 sm:py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm sm:text-base"
                      >
                        Vrati se na pretragu
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
