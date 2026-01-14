import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 md:px-10 pt-12 md:pt-20 pb-16 md:pb-24 relative overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/4"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Pametni izbor interneta
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Pronađi savršen internet paket <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                bez glavobolje.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              Uspoređujemo ponude svih top pružatelja u Hrvatskoj. Nema skrivenih troškova, samo transparentne cijene i brzine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/pretraga" 
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-blue-600/20 text-base"
              >
                Usporedi pakete
              </Link>
              <Link 
                href="/pomoc" 
                className="inline-flex items-center justify-center text-slate-700 bg-white border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-base"
              >
                Kako funkcionira?
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
              </div>
              <p>Pridruži se <span className="font-bold text-slate-900">10,000+</span> zadovoljnih korisnika</p>
            </div>
          </div>

          {/* Right Side - Top Offers Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl rotate-1 opacity-10 scale-105 blur-lg"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-8 border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Top Preporuke</h2>
                  <p className="text-slate-500 text-sm mt-1">Ažurirano danas</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">Live</span>
              </div>
              
              <div className="space-y-4">
                {/* Offer 1 */}
                <div className="group flex items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 cursor-pointer">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">T</div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-slate-900">T-HOME Supernet</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">⚡ 300 Mbps</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>Neograničeno</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">€24.99</div>
                    <div className="text-xs text-slate-500">mjesečno</div>
                  </div>
                </div>

                {/* Offer 2 */}
                <div className="group flex items-center p-4 rounded-2xl border border-slate-100 bg-white hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow">
                  <div className="h-12 w-12 rounded-xl bg-[#2C2C2C] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">A1</div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-slate-900">A1 Brzi Net</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">⚡ 200 Mbps</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>Wifi 6</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">€21.99</div>
                    <div className="text-xs text-slate-500">mjesečno</div>
                  </div>
                </div>

                {/* Offer 3 */}
                <div className="group flex items-center p-4 rounded-2xl border border-slate-100 bg-white hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow">
                  <div className="h-12 w-12 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">T2</div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-slate-900">Telemach Optika</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">⚡ 1 Gbps</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>HBO Gratis</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">€26.50</div>
                    <div className="text-xs text-slate-500">mjesečno</div>
                  </div>
                </div>
              </div>

              <Link href="/pretraga" className="block w-full py-3.5 bg-slate-900 text-white text-center rounded-xl font-medium hover:bg-slate-800 transition-colors">
                Pogledaj sve ponude
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
                <li><Link href="/pretraga" className="hover:text-white transition-colors">Usporedba interneta</Link></li>
                <li><Link href="/pretraga" className="hover:text-white transition-colors">Mobilne tarife</Link></li>
                <li><Link href="/pretraga" className="hover:text-white transition-colors">TV paketi</Link></li>
                <li><Link href="/usporedba" className="hover:text-white transition-colors">Poslovni korisnici</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Podrška</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pomoc" className="hover:text-white transition-colors">Centar za pomoć</Link></li>
                <li><Link href="/pomoc" className="hover:text-white transition-colors">Kontakt</Link></li>
                <li><Link href="/pomoc" className="hover:text-white transition-colors">O nama</Link></li>
                <li><Link href="/pomoc" className="hover:text-white transition-colors">Uvjeti korištenja</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
                {/* Social icons styled minimally */}
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
    </div>
  );
} 
