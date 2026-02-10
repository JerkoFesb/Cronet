"use client";

import { useEffect } from "react";

const PREFETCH_CACHE_KEY = "cronet_prefetch_providers";
const PREFETCH_TIMESTAMP_KEY = "cronet_prefetch_timestamp";
const CACHE_DURATION = 5 * 60 * 1000;

export function PrefetchProviders() {
  useEffect(() => {
    const prefetchData = async () => {
      try {
        const cachedTimestamp = sessionStorage.getItem(PREFETCH_TIMESTAMP_KEY);
        if (cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp, 10);
          if (age < CACHE_DURATION) {
            return;
          }
        }
        
        const firstPagePromise = fetch("/api/provideri/search?limit=5&sortBy=price")
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              sessionStorage.setItem(
                `${PREFETCH_CACHE_KEY}_first_page`,
                JSON.stringify(data.results)
              );
            }
          });

        const allProvidersPromise = fetch("/api/provideri/search?limit=100&sortBy=price")
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              sessionStorage.setItem(
                `${PREFETCH_CACHE_KEY}_all`,
                JSON.stringify(data.results)
              );
              sessionStorage.setItem(PREFETCH_TIMESTAMP_KEY, Date.now().toString());
            }
          });

        await firstPagePromise;
        await allProvidersPromise;
        
      } catch (error) {
        console.error("[Prefetch] Error during prefetch:", error);
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(() => prefetchData(), { timeout: 2000 });
    } else {
      setTimeout(prefetchData, 100);
    }
  }, []);

  return null;
}

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
