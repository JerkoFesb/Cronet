"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const providerStyles: Record<string, { bg: string; text: string; initials: string }> = {
  "a1": { bg: "bg-[#2C2C2C]", text: "text-white", initials: "A1" },
  "ht": { bg: "bg-gradient-to-br from-pink-500 to-rose-500", text: "text-white", initials: "HT" },
  "telemach": { bg: "bg-orange-500", text: "text-white", initials: "T2" },
  "iskon": { bg: "bg-emerald-600", text: "text-white", initials: "IS" },
  "evo": { bg: "bg-purple-600", text: "text-white", initials: "EV" },
};

function getProviderStyle(name: string) {
  const key = name.toLowerCase();
  return providerStyles[key] || { bg: "bg-blue-600", text: "text-white", initials: name.slice(0, 2).toUpperCase() };
}

interface ProviderSummary {
  name: string;
  slug: string;
  packageCount: number;
  cities: string[];
  accessTypes: string[];
  priceRange: { min: number; max: number };
  maxSpeed: number;
  avgScores: {
    gaming: number;
    streaming: number;
    work: number;
    family: number;
  };
  hasPromotion: boolean;
  websiteUrl: string | null;
}

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8
      ? "bg-green-100 text-green-700"
      : score >= 5
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label} {score}/10
    </span>
  );
}

function ProviderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-14 w-14 rounded-xl bg-slate-200" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-slate-100 rounded-full w-20" />
          <div className="h-6 bg-slate-100 rounded-full w-20" />
          <div className="h-6 bg-slate-100 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

export default function TrzistePage() {
  const [providers, setProviders] = useState<ProviderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch("/api/trziste");
        const data = await res.json();
        if (data.success) {
          setProviders(data.providers);
        } else {
          setError("Greška pri dohvaćanju podataka");
        }
      } catch {
        setError("Greška pri dohvaćanju podataka");
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-40 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-40 -translate-x-1/3 translate-y-1/4" />

        <div className="container mx-auto px-4 sm:px-6 md:px-10 pt-12 md:pt-20 pb-10 md:pb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Upoznaj pružatelje
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-4">
              Internet pružatelji{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                u Hrvatskoj
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Sve što trebate znati o pružateljima internetskih usluga — njihove pakete, cijene, 
              pokrivenost i ocjene za gaming, streaming, rad od kuće i obitelj.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 md:px-10 pb-16 md:pb-24">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProviderCardSkeleton key={i} />)
            : providers.map((provider) => {
                const style = getProviderStyle(provider.name);
                return (
                  <Link
                    key={provider.slug}
                    href={`/trziste/${provider.slug}`}
                    className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className={`h-14 w-14 rounded-xl ${style.bg} flex items-center justify-center ${style.text} font-bold text-lg shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      >
                        {style.initials}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {provider.name}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {provider.packageCount} {provider.packageCount === 1 ? "paket" : provider.packageCount < 5 ? "paketa" : "paketa"} 
                        </p>
                      </div>
                      {provider.hasPromotion && (
                        <span className="ml-auto bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
                          Akcija
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-0.5">Cijena od</p>
                        <p className="text-lg font-bold text-slate-900">€{provider.priceRange.min.toFixed(2)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-0.5">Maks. brzina</p>
                        <p className="text-lg font-bold text-slate-900">
                          {provider.maxSpeed >= 1000
                            ? `${(provider.maxSpeed / 1000).toFixed(0)} Gbps`
                            : `${provider.maxSpeed} Mbps`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {provider.accessTypes.map((type) => (
                        <span
                          key={type}
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <ScoreBadge label="🎮" score={provider.avgScores.gaming} />
                      <ScoreBadge label="📺" score={provider.avgScores.streaming} />
                      <ScoreBadge label="💼" score={provider.avgScores.work} />
                      <ScoreBadge label="👨‍👩‍👧‍👦" score={provider.avgScores.family} />
                    </div>

                    <div className="text-xs text-slate-400">
                      📍 {provider.cities.slice(0, 4).join(", ")}
                      {provider.cities.length > 4 && ` +${provider.cities.length - 4}`}
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        Saznaj više
                      </span>
                      <svg
                        className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
        </div>

        {!loading && providers.length > 0 && (
          <div className="mt-16 bg-white rounded-3xl border border-slate-100 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Kako odabrati pravog pružatelja?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-600">
              <div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-3">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Definirajte potrebe</h3>
                <p className="text-sm leading-relaxed">
                  Razmislite što vam je najvažnije — gaming, streaming, rad od kuće ili obiteljsko korištenje. 
                  Svaki pružatelj ima različite prednosti.
                </p>
              </div>
              <div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-3">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Usporedite ponude</h3>
                <p className="text-sm leading-relaxed">
                  Pogledajte detaljne profile pružatelja, njihove pakete, cijene i ocjene. 
                  Koristite našu{" "}
                  <Link href="/pretraga" className="text-blue-600 hover:underline">
                    pretragu
                  </Link>{" "}
                  za filtriranje.
                </p>
              </div>
              <div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-3">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Provjerite dostupnost</h3>
                <p className="text-sm leading-relaxed">
                  Nemaju svi pružatelji pokrivenost u svakom gradu. Provjerite je li vaš 
                  odabrani paket dostupan na vašoj lokaciji.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
