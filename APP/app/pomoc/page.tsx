export default function Page() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white">
      <div className="px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 pb-16 sm:pb-24 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-block bg-[#D4E9FF] text-[#4A90E2] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium">Pomoć i podrška</div>
          <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Kako koristiti CroNet i kako nas kontaktirati</h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 max-w-3xl">Brzo do najboljeg internet paketa za tvoj dom. U nastavku su kratke upute za korištenje, a ako zapneš – tu smo.</p>

          {/* Quick nav */}
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
            <a href="#upute" className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-gray-700 border-2 border-gray-300 hover:border-[#4A90E2] transition font-medium text-sm sm:text-base">Upute</a>
            <a href="#kontakt" className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-gray-700 border-2 border-gray-300 hover:border-[#4A90E2] transition font-medium text-sm sm:text-base">Kontakt</a>
            <a href="/pretraga" className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#1E1B8F] text-white font-medium hover:bg-[#2E2BA0] transition text-sm sm:text-base">Idi na pretragu</a>
          </div>
        </div>

        {/* Upute */}
        <section id="upute" className="mb-10 sm:mb-14 scroll-mt-28">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Kako koristiti CroNet</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="text-[#4A90E2] font-bold text-sm sm:text-base">1</div>
              <h3 className="mt-1 sm:mt-2 font-semibold text-gray-900 text-sm sm:text-base">Unesi grad</h3>
              <p className="mt-1 text-gray-700 text-xs sm:text-sm">Na stranici Pretraga upiši Grad (npr. Zagreb, Split...).</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="text-[#4A90E2] font-bold text-sm sm:text-base">2</div>
              <h3 className="mt-1 sm:mt-2 font-semibold text-gray-900 text-sm sm:text-base">Postavi filtre</h3>
              <p className="mt-1 text-gray-700 text-xs sm:text-sm">Po želji odaberi Brzinu, maksimalnu Cijenu i Tip mreže (FTTH, DSL, 5G...).</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="text-[#4A90E2] font-bold text-sm sm:text-base">3</div>
              <h3 className="mt-1 sm:mt-2 font-semibold text-gray-900 text-sm sm:text-base">Prikaži ponude</h3>
              <p className="mt-1 text-gray-700 text-xs sm:text-sm">Klikni „Prikaži ponude" i pregledaj rezultate dostupne u tvom području.</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="text-[#4A90E2] font-bold text-sm sm:text-base">4</div>
              <h3 className="mt-1 sm:mt-2 font-semibold text-gray-900 text-sm sm:text-base">Usporedi i odaberi</h3>
              <p className="mt-1 text-gray-700 text-xs sm:text-sm">Usporedi pakete po brzini, cijeni, dostupnosti i ocjenama. Klikni na ponudu za detalje ili posjetu webu pružatelja.</p>
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section id="kontakt" className="scroll-mt-28">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Kontaktiraj nas</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">Imate pitanja ili trebate pomoć? Tu smo da vam pomognemo!</p>
            <div className="space-y-2 text-sm sm:text-base">
              <p>📧 Email: <a className="text-[#4A90E2] hover:underline" href="mailto:jzlopa00@fesb.hr">jzlopa00@fesb.hr</a></p>
              <p>📞 Telefon: <a className="text-[#4A90E2] hover:underline" href="tel:+385924203347">092 420 3347</a></p>
              <p>🕒 Radno vrijeme: Pon-Pet, 9:00-17:00</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
