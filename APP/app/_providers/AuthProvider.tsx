"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient();

type User = { name?: string; email?: string } | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let sessionCache: { user: User; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export function AuthProvider({ children, initialUser }: { children: React.ReactNode; initialUser?: User }) {
  const [user, setUserState] = useState<User>(initialUser ?? null);
  const [loading, setLoading] = useState<boolean>(!initialUser);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  const setUser = useCallback((u: User) => {
    setUserState(u);
    if (u) {
      sessionCache = { user: u, timestamp: Date.now() };
    } else {
      sessionCache = null;
    }
  }, []);

  const fetchSession = useCallback(async (force = false) => {
    if (fetchingRef.current) return;
    
    if (!force && sessionCache && (Date.now() - sessionCache.timestamp) < CACHE_TTL) {
      if (mountedRef.current) {
        setUserState(sessionCache.user);
        setLoading(false);
      }
      return;
    }

    fetchingRef.current = true;
    
    try {
      const response = await fetch('/api/auth/get-session', {
        credentials: 'include',
        cache: 'no-store',
      });
      
      if (!response.ok) {
        if (mountedRef.current) {
          setUserState(null);
          sessionCache = null;
        }
        return;
      }
      
      const data = await response.json();
      
      if (mountedRef.current) {
        if (data?.data?.user) {
          const userData = {
            name: data.data.user.name,
            email: data.data.user.email
          };
          setUserState(userData);
          sessionCache = { user: userData, timestamp: Date.now() };
        } else {
          setUserState(null);
          sessionCache = null;
        }
      }
    } catch (error) {
      console.error('[AuthProvider] Error:', error);
      if (mountedRef.current) {
        setUserState(null);
        sessionCache = null;
      }
    } finally {
      fetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    if (initialUser) {
      sessionCache = { user: initialUser, timestamp: Date.now() };
      setLoading(false);
    } else {
      fetchSession();
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [initialUser, fetchSession]);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
      setUserState(null);
      sessionCache = null;
    } catch (e) {
      console.error("[AuthProvider] signOut error", e);
      setUserState(null);
      sessionCache = null;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    await fetchSession(true);
  }, [fetchSession]);

  const contextValue = useMemo(() => ({
    user,
    setUser,
    signOut,
    loading,
    refreshSession,
  }), [user, setUser, signOut, loading, refreshSession]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
