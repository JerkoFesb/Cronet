import Toast from "@/app/_components/Toast";
import Link from "next/link";
import { Suspense } from "react";
import { PrefetchProviders } from "@/app/_components/PrefetchProviders";
import TypewriterText from "@/app/_components/TypewriterText";
import { PageStatusGuard } from "@/app/_components/PageStatusGuard";

function HomeContent() {
  return (
    <PageStatusGuard slug="home">
    <>
      <Toast />
      <PrefetchProviders />
      
      <main className="container mx-auto px-4 sm:px-6 md:px-10 pt-12 md:pt-20 pb-16 md:pb-24 relative overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-4">
            <div className="inline-block bg-[#D4E9FF] text-[#4A90E2] px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
              Pametni izbor interneta
            </div>
            
            <div className="min-h-[160px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[220px]">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                <TypewriterText 
                  text="Pronađi idealan internet paket u par klikova."
                  speed={40}
                />
              </h1>
            </div>
            
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              CroNet uspoređuje ponude svih glavnih internet pružatelja u Hrvatskoj i pomaže vam odabrati najbolju opciju za vaše potrebe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link 
                href="/pretraga" 
                className="inline-block bg-[#1E1B8F] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[#2E2BA0] transition text-center text-sm sm:text-base"
              >
                Otkrij ponude za tebe
              </Link>
              <Link 
                href="/pomoc" 
                className="inline-block text-[#4A90E2] px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:underline transition text-center text-sm sm:text-base"
              >
                Saznaj kako CroNet radi →
              </Link>
            </div>
          </div>

          <Suspense fallback={<SkeletonCard />}>
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 border-2 border-gray-100">
            <div className="bg-gradient-to-r from-[#4A90E2] to-[#1E1B8F] -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8 px-4 sm:px-6 md:px-8 py-4 rounded-t-2xl mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center">🏆 Top ponude</h2>
              <p className="text-white/80 text-sm text-center mt-1">Najbolje ocijenjeni paketi</p>
            </div>
            
            <a href="https://www.t.ht.hr/" target="_blank" rel="noopener noreferrer" className="block border-2 border-gray-200 rounded-xl p-4 sm:p-6 space-y-3 hover:border-[#4A90E2] transition cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E20074] text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">
                    T
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">T-HOME</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Supernet paket</p>
                    <p className="text-gray-500 text-xs sm:text-sm">300 Mbps</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">€24<span className="text-base sm:text-lg">,99</span><span className="text-xs sm:text-sm font-normal">/mj.</span></div>
                </div>
              </div>
              <div className="w-full bg-[#E6F3FF] text-[#4A90E2] py-2 rounded-lg font-medium hover:bg-[#4A90E2] hover:text-white transition text-center text-sm sm:text-base">
                Najbolji odabir
              </div>
            </a>

            <a href="https://www.a1.hr/" target="_blank" rel="noopener noreferrer" className="block border-2 border-gray-200 rounded-xl p-4 sm:p-6 space-y-3 hover:border-[#4A90E2] transition cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
                    vip
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">VIP</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Brzi paket</p>
                    <p className="text-gray-500 text-xs sm:text-sm">200 Mbps</p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">€21<span className="text-base sm:text-lg">,99</span><span className="text-xs sm:text-sm font-normal">/mj.</span></div>
                </div>
              </div>
            </a>
            </div>
          </Suspense>
        </div>

        <div className="hidden sm:block absolute top-20 right-10 md:right-20 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 bg-[#D4E9FF] rounded-full opacity-30 blur-3xl -z-10"></div>
        <div className="hidden sm:block absolute bottom-40 left-5 md:left-10 w-36 md:w-56 lg:w-72 h-36 md:h-56 lg:h-72 bg-[#D4E9FF] rounded-full opacity-40 blur-3xl -z-10"></div>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">CroNet</h2>
              <p className="text-sm leading-relaxed max-w-sm">
                Vaš pouzdani vodič kroz svijet telekomunikacija. Pomažemo vam uštedjeti novac i pronaći najbolju uslugu.
              </p>
              <p className="text-xs opacity-50 pt-4">© 2024 CroNet d.d. Sva prava pridržana.</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Usluge</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/trziste" className="hover:text-white transition-colors">Pregled dostupnih providera</Link></li>
                <li><Link href="/pretraga" className="hover:text-white transition-colors">Tablična Usporedba</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Podrška</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pomoc" className="hover:text-white transition-colors">Centar za pomoć</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 sm:pr-20">
            <div className="flex gap-4">
                {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a key={social} href="#" className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors" aria-label={social}>
                    <span className="w-4 h-4 rounded-full bg-slate-400"></span>
                  </a>
                ))}
            </div>
            <div className="text-xs text-slate-500">
              Made with ❤️ in Croatia
            </div>
          </div>
        </div>
      </footer>
    </>
    </PageStatusGuard>
  );
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white flex flex-col">
      <Suspense fallback={<SkeletonHome />}>
        <HomeContent />
      </Suspense>
    </div>
  );
}

function SkeletonHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white flex flex-col">
      <main className="container mx-auto px-4 sm:px-6 md:px-10 pt-12 md:pt-20 pb-16 md:pb-24 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
            <div className="h-20 w-full bg-gray-300 rounded animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="h-14 w-48 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-14 w-48 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          
          <SkeletonCard />
        </div>
      </main>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="relative bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-8 border border-slate-100">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-6 w-12 bg-slate-200 rounded-full animate-pulse"></div>
      </div>
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
          <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse flex-shrink-0"></div>
          <div className="ml-4 flex-1 space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
        </div>
      ))}
      
      <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>
    </div>
  );
}