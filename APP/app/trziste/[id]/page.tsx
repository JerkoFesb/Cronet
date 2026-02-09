"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const providerStyles: Record<string, { bg: string; text: string; initials: string; accent: string }> = {
  "a1": { bg: "bg-[#2C2C2C]", text: "text-white", initials: "A1", accent: "from-gray-700 to-gray-900" },
  "ht": { bg: "bg-gradient-to-br from-pink-500 to-rose-500", text: "text-white", initials: "HT", accent: "from-pink-500 to-rose-500" },
  "telemach": { bg: "bg-orange-500", text: "text-white", initials: "T2", accent: "from-orange-400 to-orange-600" },
  "iskon": { bg: "bg-emerald-600", text: "text-white", initials: "IS", accent: "from-emerald-500 to-emerald-700" },
  "evo": { bg: "bg-purple-600", text: "text-white", initials: "EV", accent: "from-purple-500 to-purple-700" },
};

function getProviderStyle(name: string) {
  const key = name.toLowerCase();
  return (
    providerStyles[key] || {
      bg: "bg-blue-600",
      text: "text-white",
      initials: name.slice(0, 2).toUpperCase(),
      accent: "from-blue-500 to-blue-700",
    }
  );
}

interface Package {
  id: string;
  packageName: string;
  city: string;
  accessType: string;
  downloadMbps: number;
  uploadMbps: number;
  latencyMs: number;
  jitterMs: number;
  packetLossPercent: number;
  priceEur: number;
  installationFeeEur: number;
  contractMonths: number;
  dataLimitGB: number | null;
  tvIncluded: boolean;
  phoneIncluded: boolean;
  routerIncluded: boolean;
  cgnat: boolean;
  ipv6Support: boolean;
  scoreGaming: number;
  scoreStreaming: number;
  scoreWork: number;
  scoreFamily: number;
  availability: string;
  promotionActive: boolean;
  promotionDescription: string | null;
}

interface ProviderDetail {
  name: string;
  slug: string;
  cities: string[];
  accessTypes: string[];
  priceRange: { min: number; max: number };
  speedRange: { min: number; max: number };
  avgScores: { gaming: number; streaming: number; work: number; family: number };
  hasIPv6: boolean;
  hasCGNAT: boolean;
  hasPromotion: boolean;
  websiteUrl: string | null;
  packageCount: number;
  packages: Package[];
}

function ScoreBar({ label, icon, score }: { label: string; icon: string; score: number }) {
  const percentage = (score / 10) * 100;
  const color =
    score >= 8 ? "bg-green-500" : score >= 5 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-600">
          {icon} {label}
        </span>
        <span className="text-sm font-bold text-slate-900">{score}/10</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AvailabilityBadge({ availability }: { availability: string }) {
  const map: Record<string, { label: string; color: string }> = {
    excellent: { label: "Izvrsna", color: "bg-green-100 text-green-700" },
    good: { label: "Dobra", color: "bg-blue-100 text-blue-700" },
    limited: { label: "Ograničena", color: "bg-yellow-100 text-yellow-700" },
    poor: { label: "Slaba", color: "bg-red-100 text-red-700" },
  };
  const style = map[availability] || { label: availability, color: "bg-slate-100 text-slate-700" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.color}`}>
      {style.label}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 pt-12 pb-24">
        <div className="h-4 bg-slate-200 rounded w-32 mb-8" />
        <div className="flex items-center gap-4 mb-8">
          <div className="h-20 w-20 rounded-2xl bg-slate-200" />
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="h-4 bg-slate-100 rounded w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrzisteProviderPage() {
  const params = useParams();
  const id = params.id as string;

  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("all");

  useEffect(() => {
    async function fetchProvider() {
      try {
        const res = await fetch(`/api/trziste?slug=${id}`);
        if (!res.ok) throw new Error("Provider nije pronađen");
        const data = await res.json();
        if (data.success && data.provider) {
          setProvider(data.provider);
        } else {
          setError(data.error || "Provider nije pronađen");
        }
      } catch {
        setError("Greška pri dohvaćanju podataka");
      } finally {
        setLoading(false);
      }
    }
    fetchProvider();
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Provider nije pronađen</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link
            href="/trziste"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Natrag na pregled pružatelja
          </Link>
        </div>
      </div>
    );
  }

  const style = getProviderStyle(provider.name);
  const filteredPackages =
    selectedCity === "all"
      ? provider.packages
      : provider.packages.filter((p) => p.city === selectedCity);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${style.accent} opacity-5`} />
        <div className="container mx-auto px-4 sm:px-6 md:px-10 pt-8 md:pt-12 pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/trziste" className="hover:text-blue-600 transition-colors">
              Pružatelji
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{provider.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className={`h-20 w-20 rounded-2xl ${style.bg} flex items-center justify-center ${style.text} font-bold text-2xl shadow-lg flex-shrink-0`}
            >
              {style.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{provider.name}</h1>
                {provider.hasPromotion && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                    Aktivna akcija
                  </span>
                )}
              </div>
              <p className="text-slate-500 mt-2">
                {provider.packageCount} {provider.packageCount === 1 ? "paket" : "paketa"} •{" "}
                {provider.cities.length} {provider.cities.length === 1 ? "grad" : "gradova"} •{" "}
                {provider.accessTypes.join(", ")}
              </p>
              {provider.websiteUrl && (
                <a
                  href={provider.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Posjeti web stranicu →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 md:px-10 pb-16 md:pb-24">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-500 mb-1">Cijena</p>
            <p className="text-xl font-bold text-slate-900">
              €{provider.priceRange.min.toFixed(2)}
              {provider.priceRange.min !== provider.priceRange.max && (
                <span className="text-sm font-normal text-slate-500">
                  {" "}
                  – €{provider.priceRange.max.toFixed(2)}
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">mjesečno</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-500 mb-1">Brzina</p>
            <p className="text-xl font-bold text-slate-900">
              {provider.speedRange.max >= 1000
                ? `${(provider.speedRange.max / 1000).toFixed(0)} Gbps`
                : `${provider.speedRange.max} Mbps`}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">maksimalno</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-500 mb-1">IPv6</p>
            <p className="text-xl font-bold text-slate-900">{provider.hasIPv6 ? "Da ✓" : "Ne ✗"}</p>
            <p className="text-xs text-slate-400 mt-0.5">podrška</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <p className="text-xs text-slate-500 mb-1">CGNAT</p>
            <p className="text-xl font-bold text-slate-900">{provider.hasCGNAT ? "Da ⚠" : "Ne ✓"}</p>
            <p className="text-xs text-slate-400 mt-0.5">{provider.hasCGNAT ? "prisutan" : "bez CGNAT-a"}</p>
          </div>
        </div>

        {/* Scores + Cities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Scores */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Prosječne ocjene</h2>
            <div className="space-y-4">
              <ScoreBar label="Gaming" icon="🎮" score={provider.avgScores.gaming} />
              <ScoreBar label="Streaming" icon="📺" score={provider.avgScores.streaming} />
              <ScoreBar label="Rad od kuće" icon="💼" score={provider.avgScores.work} />
              <ScoreBar label="Obitelj" icon="👨‍👩‍👧‍👦" score={provider.avgScores.family} />
            </div>
          </div>

          {/* Cities */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Dostupnost po gradovima</h2>
            <div className="flex flex-wrap gap-2">
              {provider.cities.map((city) => (
                <span
                  key={city}
                  className="bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-100"
                >
                  📍 {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Package List */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Paketi</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-500">Grad:</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Svi gradovi</option>
                {provider.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPackages.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Nema paketa za odabrani grad.
              </p>
            ) : (
              filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Package info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-slate-900">{pkg.packageName}</h3>
                        {pkg.promotionActive && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                            Akcija
                          </span>
                        )}
                        <AvailabilityBadge availability={pkg.availability} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                        <span>📍 {pkg.city}</span>
                        <span>🔌 {pkg.accessType}</span>
                        <span>
                          ⚡ {pkg.downloadMbps}/{pkg.uploadMbps} Mbps
                        </span>
                        <span>📡 {pkg.latencyMs}ms latencija</span>
                      </div>
                      {pkg.promotionDescription && (
                        <p className="text-sm text-green-600 mt-2">🎁 {pkg.promotionDescription}</p>
                      )}
                    </div>

                    {/* Price and extras */}
                    <div className="flex flex-col items-end gap-1 min-w-[140px]">
                      <div className="text-2xl font-bold text-slate-900">€{pkg.priceEur.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">mjesečno</div>
                      {pkg.contractMonths > 0 && (
                        <div className="text-xs text-slate-400">
                          Ugovor {pkg.contractMonths} mj.
                        </div>
                      )}
                      {pkg.installationFeeEur > 0 && (
                        <div className="text-xs text-slate-400">
                          Instalacija €{pkg.installationFeeEur.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-50">
                    {pkg.tvIncluded && (
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">📺 TV uključen</span>
                    )}
                    {pkg.phoneIncluded && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">📞 Telefon uključen</span>
                    )}
                    {pkg.routerIncluded && (
                      <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">📶 Router uključen</span>
                    )}
                    {pkg.ipv6Support && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">🌐 IPv6</span>
                    )}
                    {pkg.cgnat && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">⚠ CGNAT</span>
                    )}
                    {pkg.dataLimitGB == null ? (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">∞ Neograničeno</span>
                    ) : (
                      <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                        📊 {pkg.dataLimitGB} GB
                      </span>
                    )}
                    <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">
                      🎮 {pkg.scoreGaming}/10
                    </span>
                    <span className="text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full">
                      📺 {pkg.scoreStreaming}/10
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/trziste"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Natrag na sve pružatelje
          </Link>
        </div>
      </div>
    </div>
  );
}
