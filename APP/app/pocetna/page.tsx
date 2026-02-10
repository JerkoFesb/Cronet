import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-white">
      <main className="relative container mx-auto px-10 pt-16 pb-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="inline-block bg-[#D4E9FF] text-[#4A90E2] px-4 py-2 rounded-lg text-sm font-medium">
              Pametni izbor interneta
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Ne ostavljaj svoj internet slučaju - pronađi najbolji paket za svoj dom u samo par klikova.
            </h1>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              CroNet uspoređuje ponude svih glavnih internet pružatelja u Hrvatskoj i pomaže vam odabrati najbolju opciju za vaše potrebe.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/pretraga" 
                className="inline-block bg-[#1E1B8F] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2E2BA0] transition text-center"
              >
                Otkrij ponude za tebe
              </Link>
              <Link 
                href="/pomoc" 
                className="inline-block text-[#4A90E2] px-8 py-4 rounded-lg font-semibold hover:underline transition text-center"
              >
                Saznaj kako CroNet radi →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Top ponude</h2>
            
            <div className="border-2 border-gray-200 rounded-xl p-6 space-y-3 hover:border-[#4A90E2] transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#E20074] text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
                    T
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">T-HOME</h3>
                    <p className="text-gray-600 text-sm">Supernet paket</p>
                    <p className="text-gray-500 text-sm">300 Mbps</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">€24<span className="text-lg">,99</span><span className="text-sm font-normal">/mj.</span></div>
                </div>
              </div>
              <button className="w-full bg-[#E6F3FF] text-[#4A90E2] py-2 rounded-lg font-medium hover:bg-[#4A90E2] hover:text-white transition">
                Najbolji odabir
              </button>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6 space-y-3 hover:border-[#4A90E2] transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    vip
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">VIP</h3>
                    <p className="text-gray-600 text-sm">Brzi paket</p>
                    <p className="text-gray-500 text-sm">200 Mbps</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">€21<span className="text-lg">,99</span><span className="text-sm font-normal">/mj.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4E9FF] rounded-full opacity-30 blur-3xl -z-10"></div>
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-[#D4E9FF] rounded-full opacity-40 blur-3xl -z-10"></div>
      </main>

      <footer className="bg-[#A8C5E0] py-8 mt-20">
        <div className="container mx-auto px-10">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">CroNet</h2>
              <p className="text-white text-sm">© CroNet d.d. (Inc) Sva prava pridržana</p>
            </div>
            
            <div className="flex gap-8 items-start">
              <div className="space-y-2">
                <Link href="/pomoc" className="block text-white hover:underline">O nama</Link>
                <Link href="/pomoc" className="block text-white hover:underline">Kontaktirajte nas</Link>
              </div>
              
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A90E2] hover:bg-gray-100 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A90E2] hover:bg-gray-100 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A90E2] hover:bg-gray-100 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4A90E2] hover:bg-gray-100 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
