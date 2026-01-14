export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EBF5FF] via-[#F5F9FF] to-white flex flex-col">
      <main className="px-10 pt-20 pb-20 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full">
          {/* Left Side Skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-40 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-16 w-full bg-gray-300 rounded animate-pulse"></div>
            <div className="h-20 w-full bg-gray-300 rounded animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="h-14 w-48 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-14 w-48 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          {/* Right Side Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 w-full">
            <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mx-auto"></div>
            <div className="border-2 border-gray-200 rounded-xl p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 w-20 bg-gray-300 rounded animate-pulse flex-shrink-0"></div>
              </div>
              <div className="h-10 w-full bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
