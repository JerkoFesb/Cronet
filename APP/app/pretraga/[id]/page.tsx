"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DetailPageSkeleton } from "@/app/_components/SkeletonLoader";

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
  promotionActive: boolean;
  promotionDetails: string | null;
}

export default function DetaljiProvidera() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProvider() {
      try {
        const response = await fetch(`/api/provideri/search?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch provider');
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setProvider(data.results[0]);
        } else {
          setError('Provider nije pronađen');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProvider();
  }, [id]);

  const handleCompare = () => {
    if (provider) {
      // Dohvati postojeće odabrane providere
      const saved = sessionStorage.getItem("compare-selected");
      let selected: string[] = [];
      
      if (saved) {
        try {
          selected = JSON.parse(saved);
        } catch (err) {
          selected = [];
        }
      }
      
      // Dodaj trenutni provider ako nije već dodan
      if (!selected.includes(provider.id)) {
        selected.push(provider.id);
      }
      
      // Spremi ažurirane odabrane providere
      sessionStorage.setItem("compare-selected", JSON.stringify(selected));
      
      // Idi na pretragu stranicu
      router.push("/pretraga");
    }
  };

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white flex items-center justify-center">
        <div className="text-center p-8">
          <span className="text-6xl">😕</span>
          <h1 className="text-3xl font-bold mt-4 text-gray-900">Greška</h1>
          <p className="text-gray-600 mt-2 mb-6">{error || 'Provider nije pronađen'}</p>
          <Link href="/pretraga" className="inline-block px-6 py-3 bg-[#4A90E2] text-white rounded-xl font-semibold hover:bg-[#3A7BC8] transition shadow-lg">
            ← Natrag na pretragu
          </Link>
        </div>
      </div>
    );
  }

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

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
            <div className="hidden sm:block absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32"></div>
            <div className="hidden sm:block absolute bottom-0 left-0 w-36 md:w-48 h-36 md:h-48 bg-white/10 rounded-full -ml-18 md:-ml-24 -mb-18 md:-mb-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold shadow-2xl border-2 border-white/30 flex-shrink-0">
                  {provider.providerName.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2 drop-shadow-lg">{provider.providerName}</h1>
                  <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium mb-2 sm:mb-3">{provider.packageName}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full border border-white/30">
                      {provider.accessType === 'FTTH' ? '🌟 Optika' : 
                       provider.accessType === 'DOCSIS' ? '📺 Kabel' :
                       provider.accessType === 'DSL' ? '📞 ADSL' :
                       provider.accessType === '5G' ? '📡 5G' : provider.accessType}
                    </span>
                    {provider.promotionActive && (
                      <span className="px-2 sm:px-3 py-1 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full animate-pulse">
                        🔥 Akcija!
                      </span>
                    )}
                    <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full border border-white/30">
                      📍 {provider.city}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-white/30 shadow-2xl w-full md:w-auto">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                  €{provider.priceEur}
                </div>
                <p className="text-base sm:text-lg text-white/90 mt-1">mjesečno</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⬇️</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.downloadMbps}</div>
              <p className="text-xs sm:text-sm text-gray-600">Mbps Download</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⬆️</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.uploadMbps}</div>
              <p className="text-xs sm:text-sm text-gray-600">Mbps Upload</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">⏱️</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.latencyMs}ms</div>
              <p className="text-xs sm:text-sm text-gray-600">Latencija</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📝</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{provider.contractMonths || 0}</div>
              <p className="text-xs sm:text-sm text-gray-600">Mjeseci ugovora</p>
            </div>
          </div>

          {/* Promotion Banner */}
          {provider.promotionActive && provider.promotionDetails && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 sm:p-6 mx-4 sm:mx-6 my-4 sm:my-6 rounded-xl">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <span className="text-3xl sm:text-4xl">🔥</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-1 sm:mb-2">Aktivna akcijska ponuda!</h3>
                  <p className="text-sm sm:text-base text-gray-700">{provider.promotionDetails}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">O paketu</h2>
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  {provider.packageName} od {provider.providerName} nudi odličan omjer cijene i performansi. 
                  Sa brzinama do <strong>{provider.downloadMbps} Mbps</strong>, idealan je za {
                    provider.downloadMbps >= 500 ? 'zahtjevne korisnike, velike obitelji i poslovne korisnike' :
                    provider.downloadMbps >= 200 ? 'streaming, gaming i rad od kuće' :
                    provider.downloadMbps >= 100 ? 'uobičajeno korištenje interneta i streaming' :
                    'osnovno surfanje i email'
                  }.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Prednosti</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {provider.accessType === 'FTTH' && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🌟</div>
                    <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Optička tehnologija</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Najbrža i najpouzdanija veza</p>
                  </div>
                )}
                {provider.downloadMbps >= 200 && (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border border-green-200">
                      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎮</div>
                      <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Idealno za gaming</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Niska latencija i visoke brzine</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl border border-purple-200">
                      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📺</div>
                      <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">4K streaming</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Bez prekida i čekanja</p>
                    </div>
                  </>
                )}
                {provider.contractMonths === 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-xl border border-yellow-200">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🆓</div>
                    <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Bez obveze</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Otkažite bilo kada</p>
                  </div>
                )}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 sm:p-6 rounded-xl border border-pink-200">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🛡️</div>
                  <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">24/7 podrška</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Uvijek tu za vas</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-xl border border-indigo-200">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📱</div>
                  <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Brza instalacija</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Jednostavna aktivacija</p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Tehnički detalji</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                  <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <span>📡</span> Performanse
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between pb-2 border-b text-sm sm:text-base">
                      <span className="text-gray-600">Download</span>
                      <span className="font-bold">{provider.downloadMbps} Mbps</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b text-sm sm:text-base">
                      <span className="text-gray-600">Upload</span>
                      <span className="font-bold">{provider.uploadMbps} Mbps</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b text-sm sm:text-base">
                      <span className="text-gray-600">Latencija</span>
                      <span className="font-bold">{provider.latencyMs} ms</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Tehnologija</span>
                      <span className="font-bold">{provider.accessType}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
                  <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <span>💰</span> Cijena
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between pb-2 border-b text-sm sm:text-base">
                      <span className="text-gray-600">Mjesečno</span>
                      <span className="font-bold">€{provider.priceEur}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b text-sm sm:text-base">
                      <span className="text-gray-600">Godišnje</span>
                      <span className="font-bold">€{(provider.priceEur * 12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b text-sm sm:text-base">
                      <span className="text-gray-600">Ugovor</span>
                      <span className="font-bold">{provider.contractMonths || 'Bez'} mj</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">€ po Mbps</span>
                      <span className="font-bold">€{(provider.priceEur / provider.downloadMbps).toFixed(3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-gray-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Spremni za prelazak?</h3>
                  <p className="text-sm sm:text-base text-gray-600">Kontaktirajte providera za više informacija</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#4A90E2] to-[#3A7BC8] text-white font-bold rounded-xl hover:shadow-xl transition text-sm sm:text-base">
                    Kontaktiraj
                  </button>
                  <button 
                    onClick={handleCompare}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-[#4A90E2] hover:bg-blue-50 transition text-center text-sm sm:text-base"
                  >
                    Usporedi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
