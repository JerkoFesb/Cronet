"use client";

import { useEffect } from "react";

const PREFETCH_CACHE_KEY = "cronet_prefetch_providers";
const PREFETCH_TIMESTAMP_KEY = "cronet_prefetch_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuta

/**
 * Komponenta koja prefetch-a providere iz baze podataka u pozadini
 * čim se stranica učita. Podaci se spremaju u sessionStorage za brzi pristup.
 */
export function PrefetchProviders() {
  useEffect(() => {
    const prefetchData = async () => {
      try {
        // Provjeri da li već imamo svježe podatke u cache-u
        const cachedTimestamp = sessionStorage.getItem(PREFETCH_TIMESTAMP_KEY);
        if (cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp, 10);
          if (age < CACHE_DURATION) {
            console.log("[Prefetch] Cache is fresh, skipping prefetch");
            return;
          }
        }

        console.log("[Prefetch] Starting background data prefetch...");
        
        // Dohvati prvih 5 providera za prvu stranicu (sortirano po cijeni)
        const firstPagePromise = fetch("/api/provideri/search?limit=5&sortBy=price")
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              sessionStorage.setItem(
                `${PREFETCH_CACHE_KEY}_first_page`,
                JSON.stringify(data.results)
              );
              console.log(`[Prefetch] First page cached: ${data.results.length} providers`);
            }
          });

        // Dohvati sve providere za ostale stranice (u pozadini)
        const allProvidersPromise = fetch("/api/provideri/search?limit=100&sortBy=price")
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              sessionStorage.setItem(
                `${PREFETCH_CACHE_KEY}_all`,
                JSON.stringify(data.results)
              );
              sessionStorage.setItem(PREFETCH_TIMESTAMP_KEY, Date.now().toString());
              console.log(`[Prefetch] All providers cached: ${data.results.length} providers`);
            }
          });

        // Prvih 5 ima prioritet
        await firstPagePromise;
        // Ostali se dohvaćaju u pozadini
        await allProvidersPromise;
        
      } catch (error) {
        console.error("[Prefetch] Error during prefetch:", error);
      }
    };

    // Koristi requestIdleCallback za prefetch kad je browser "idle"
    // ili setTimeout kao fallback
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => prefetchData(), { timeout: 2000 });
    } else {
      setTimeout(prefetchData, 100);
    }
  }, []);

  // Ova komponenta ne renderira ništa
  return null;
}

/**
 * Hook za pristup prefetch-anim podacima
 */
export function usePrefetchedProviders() {
  const getFirstPage = (): any[] | null => {
    if (typeof window === "undefined") return null;
    try {
      const cached = sessionStorage.getItem(`${PREFETCH_CACHE_KEY}_first_page`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const getAllProviders = (): any[] | null => {
    if (typeof window === "undefined") return null;
    try {
      const cached = sessionStorage.getItem(`${PREFETCH_CACHE_KEY}_all`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const isCacheValid = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const timestamp = sessionStorage.getItem(PREFETCH_TIMESTAMP_KEY);
      if (!timestamp) return false;
      return Date.now() - parseInt(timestamp, 10) < CACHE_DURATION;
    } catch {
      return false;
    }
  };

  const clearCache = () => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(`${PREFETCH_CACHE_KEY}_first_page`);
    sessionStorage.removeItem(`${PREFETCH_CACHE_KEY}_all`);
    sessionStorage.removeItem(PREFETCH_TIMESTAMP_KEY);
  };

  return {
    getFirstPage,
    getAllProviders,
    isCacheValid,
    clearCache,
  };
}
