import { PageStatusGuard } from "@/app/_components/PageStatusGuard";

export default function Page() {
  return (
    <PageStatusGuard slug="pomoc">
    <main className="min-h-screen w-full bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white">
      <div className="px-4 sm:px-6 md:px-10 pt-16 sm:pt-24 pb-16 sm:pb-24 max-w-5xl mx-auto">
        
        <header className="text-center mb-16 sm:mb-20">
          <span className="inline-block bg-[#4A90E2]/10 text-[#4A90E2] px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
            Pomoć i podrška
          </span>
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
            Kako ti možemo pomoći?
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Brzo pronađi odgovore na pitanja ili nas kontaktiraj direktno.
          </p>

          <nav className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3">
            <a href="#upute" className="px-6 py-3 rounded-xl bg-white text-gray-700 border border-gray-200 hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all font-medium shadow-sm">
              📖 Upute za korištenje
            </a>
            <a href="#kontakt" className="px-6 py-3 rounded-xl bg-white text-gray-700 border border-gray-200 hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all font-medium shadow-sm">
              💬 Kontakt
            </a>
            <a href="/pretraga" className="px-6 py-3 rounded-xl bg-[#1E1B8F] text-white font-semibold hover:bg-[#2E2BA0] transition-all shadow-lg shadow-[#1E1B8F]/20">
              Idi na pretragu →
            </a>
          </nav>
        </header>

        <section id="upute" className="mb-16 sm:mb-20 scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-[#4A90E2] flex items-center justify-center text-white text-xl">
              📖
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kako koristiti CroNet</h2>
          </div>
          
          <div className="relative">
            <div className="hidden sm:block absolute left-[39px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#4A90E2] to-[#4A90E2]/20"></div>
            
            <div className="space-y-6">
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4A90E2] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shadow-[#4A90E2]/30 z-10">
                  1
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Unesi svoj grad</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">Na stranici Pretraga upiši ime svog grada (npr. Zagreb, Split, Rijeka...).</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4A90E2]/80 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shadow-[#4A90E2]/20 z-10">
                  2
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Postavi filtre</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">Odaberi željenu brzinu, maksimalnu cijenu i tip mreže (FTTH, DSL, 5G...).</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4A90E2]/60 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg shadow-[#4A90E2]/10 z-10">
                  3
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Pregledaj ponude</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">Klikni „Prikaži ponude" i pregledaj sve dostupne opcije u tvom području.</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4A90E2]/40 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg z-10">
                  4
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Usporedi i odaberi</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">Usporedi pakete po brzini, cijeni i ocjenama. Klikni za detalje ili posjetu webu pružatelja.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="kontakt" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-[#4CAF82] flex items-center justify-center text-white text-xl">
              💬
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kontaktiraj nas</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#4CAF82] to-[#45a076] p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Imaš pitanja?</h3>
              <p className="mt-2 text-white/90 text-base sm:text-lg">Tu smo da ti pomognemo pronaći savršen internet paket.</p>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="grid sm:grid-cols-3 gap-6">
                <a href="mailto:jzlopa00@fesb.hr" className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-[#4A90E2]/5 transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-[#4A90E2]/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📧
                  </div>
                  <span className="mt-4 font-semibold text-gray-900">Email</span>
                  <span className="mt-1 text-[#4A90E2] text-sm">jzlopa00@fesb.hr</span>
                </a>

                <a href="tel:+385924203347" className="flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-[#4A90E2]/5 transition-colors group">
                  <div className="w-14 h-14 rounded-full bg-[#4A90E2]/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📞
                  </div>
                  <span className="mt-4 font-semibold text-gray-900">Telefon</span>
                  <span className="mt-1 text-[#4A90E2] text-sm">092 420 3347</span>
                </a>

                <div className="flex flex-col items-center p-6 rounded-2xl bg-gray-50">
                  <div className="w-14 h-14 rounded-full bg-[#4A90E2]/10 flex items-center justify-center text-2xl">
                    🕒
                  </div>
                  <span className="mt-4 font-semibold text-gray-900">Radno vrijeme</span>
                  <span className="mt-1 text-gray-600 text-sm">Pon-Pet, 9-17h</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-16 sm:mt-20 text-center">
          <p className="text-gray-600 mb-4">Spreman za pronalazak savršenog internet paketa?</p>
          <a href="/pretraga" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1E1B8F] text-white font-semibold hover:bg-[#2E2BA0] transition-all shadow-lg shadow-[#1E1B8F]/20 text-lg">
            Započni pretragu
            <span>→</span>
          </a>
        </div>
      </div>
    </main>
    </PageStatusGuard>
  );
}
