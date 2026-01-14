"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useEffect, useState, useMemo, memo } from "react";

type Page = {
  title: string;
  path: `/${string}`;
};

const basePages: Page[] = [
  { title: "Početna", path: "/" },
  { title: "Pretraga", path: "/pretraga" },
  { title: "Pomoć", path: "/pomoc" },
];

// Memoized auth button component to prevent unnecessary re-renders
const AuthButton = memo(function AuthButton({ 
  user, 
  loading, 
  onSignOut, 
  isMobile = false,
  onMobileClose
}: { 
  user: { name?: string; email?: string } | null;
  loading: boolean;
  onSignOut: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}) {
  const isLoggedIn = user && (user.name || user.email);
  const displayName = user?.name ?? user?.email ?? '';
  
  // Truncate long names
  const truncatedName = displayName.length > 12 
    ? displayName.slice(0, 12) + '...' 
    : displayName;

  // Common button styles to ensure consistent sizing
  const desktopStyles = "px-4 lg:px-6 py-2.5 rounded-full text-sm lg:text-base font-medium min-w-[90px] lg:min-w-[100px] text-center";
  const mobileStyles = "w-full px-4 py-3 rounded-lg font-medium text-center";

  // During SSR or initial load, show placeholder with same dimensions to prevent layout shift
  if (loading) {
    return (
      <div 
        className={`
          ${isMobile ? mobileStyles : desktopStyles}
          bg-gray-200 animate-pulse h-[42px] ${isMobile ? 'h-[48px]' : ''}
        `}
        aria-hidden="true"
      />
    );
  }

  if (isLoggedIn) {
    return (
      <button 
        onClick={() => {
          onSignOut();
          onMobileClose?.();
        }} 
        className={`
          ${isMobile ? mobileStyles : desktopStyles}
          bg-red-600 text-white hover:bg-red-700 
          transition-all duration-200 ease-out
          active:scale-[0.98]
        `}
        title={displayName}
      >
        Odjava ({truncatedName})
      </button>
    );
  }

  return (
    <Link 
      href="/prijava" 
      onClick={onMobileClose}
      className={`
        ${isMobile ? mobileStyles + ' block' : desktopStyles}
        bg-[#1E1B8F] text-white hover:bg-[#2E2BA0] 
        transition-all duration-200 ease-out
        active:scale-[0.98]
      `}
    >
      Prijava
    </Link>
  );
});

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use effect to sync pathname on client-side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      // Clear search state (form fields)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pretraga-state");
        // Keep chat messages in localStorage - don't delete them!
      }
      await signOut();
      // show a signed-out toast on the homepage
      router.push(`/?toast=signedout`);
    } catch (e) {
      console.error("signOut error", e);
      router.push("/");
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm py-4 md:py-6 px-4 md:px-10 border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl md:text-3xl font-bold text-[#4A90E2] hover:opacity-80 transition">
          CroNet
        </Link>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop navigation */}
        <ul className="hidden md:flex space-x-2 items-center">
          {basePages.map((page, index) => {
            const isActive =
              page.path === "/"
                ? currentPath === page.path
                : currentPath?.startsWith(page.path);
            
            return (
              <li key={index}>
                <Link
                  href={page.path}
                  className={`px-4 lg:px-6 py-2.5 rounded-full font-medium transition-all text-sm lg:text-base ${
                    isActive
                      ? "bg-[#4A90E2] text-white border-2 border-[#4A90E2]"
                      : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#4A90E2]"
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}

          <li className="ml-4 lg:ml-8 min-w-[100px] lg:min-w-[120px]">
            <AuthButton 
              user={user} 
              loading={loading} 
              onSignOut={handleSignOut} 
            />
          </li>
        </ul>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
          <ul className="flex flex-col space-y-3">
            {basePages.map((page, index) => {
              const isActive =
                page.path === "/"
                  ? currentPath === page.path
                  : currentPath?.startsWith(page.path);
              
              return (
                <li key={index}>
                  <Link
                    href={page.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all text-center ${
                      isActive
                        ? "bg-[#4A90E2] text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}

            <li className="pt-2 border-t border-gray-100">
              <AuthButton 
                user={user} 
                loading={loading} 
                onSignOut={handleSignOut}
                isMobile={true}
                onMobileClose={closeMobileMenu}
              />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
