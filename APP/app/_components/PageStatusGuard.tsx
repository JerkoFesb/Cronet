"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

type PageStatus = {
  slug: string;
  title: string;
  enabled: boolean;
};

interface PageStatusGuardProps {
  slug: string;
  children: React.ReactNode;
}

export function PageStatusGuard({ slug, children }: PageStatusGuardProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPageStatus = async () => {
      try {
        const res = await fetch('/api/page-status');
        const data = await res.json();
        const page = data.pages?.find((p: PageStatus) => p.slug === slug);
        
        const enabled = page?.enabled === true;
        setIsEnabled(enabled);
      } catch (error) {
        console.error('Failed to fetch page status:', error);
        setIsEnabled(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkPageStatus();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Učitavanje...</div>
      </div>
    );
  }

  if (isEnabled === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Ova stranica nije dostupna</p>
          <a 
            href="/" 
            className="px-6 py-3 bg-[#1E1B8F] text-white rounded-lg hover:bg-[#2E2BA0] transition-colors"
          >
            Povratak na početnu
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
