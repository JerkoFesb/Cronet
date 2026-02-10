"use client";

import { createAuthClient } from "better-auth/react";
import { useState, Suspense, useCallback, useRef, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";

const authClient = createAuthClient();

function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }
    
    timeoutRef.current = setTimeout(() => {
      abortRef.current = new AbortController();
      fn(...args);
    }, delay);
  }, [fn, delay]);
}

function extractMessage(err: any): string {
  if (!err) return "Pogreška.";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;

  try {
    if (typeof err.message === "string") return err.message;
    if (typeof err.error === "string") return err.error;
    if (err?.error && typeof err.error?.message === "string") return err.error.message;
    if (err?.data && typeof err.data?.message === "string") return err.data.message;
    if (typeof err === "object") {
      if (err.status && err.statusText) return `${err.status} ${err.statusText}`;
      const str = JSON.stringify(err);
      if (str !== undefined && str !== "{}") return str;
    }
  } catch (e) {
  }

  try {
    const s = String(err);
    if (s && s !== "[object Object]") return s;
  } catch (e) {
  }

  return "Pogreška.";
}

function LoginForm({ onSwitch, callback }: { onSwitch: () => void; callback?: string | null }) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectUrl = callback || "/";
  useEffect(() => {
    router.prefetch(redirectUrl);
  }, [router, redirectUrl]);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPasswordValid = (val: string) => val.length >= 8;

  const validateEmail = useCallback((val: string) => {
    const ok = isEmailValid(val);
    setEmailError(ok ? null : "Unesite valjan email.");
    return ok;
  }, []);

  const validatePassword = useCallback((val: string) => {
    const ok = isPasswordValid(val);
    setPasswordError(ok ? null : "Lozinka mora imati barem 8 znakova.");
    return ok;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const emailVal = email.trim().toLowerCase();
    const passVal = password;

    const v1 = validateEmail(emailVal);
    const v2 = validatePassword(passVal);
    if (!v1 || !v2) return;

    setIsSubmitting(true);

    try {
      const authPromise = authClient.signIn.email({
        email: emailVal,
        password: passVal,
      });

      const { data, error: authError }: any = await authPromise;

      if (authError || (data && typeof data === "object" && (data.error || data.status === "error" || data.ok === false))) {
        const msg = extractMessage(authError || data) || "Prijava nije uspjela.";
        setError(new Error(msg));
        setIsSubmitting(false);
        return;
      }

      const displayName = data?.user?.name || emailVal;
      
      setUser({ name: displayName, email: emailVal });

      router.push(`${redirectUrl}?toast=loggedin&name=${encodeURIComponent(displayName)}`);
    } catch (err: any) {
      setError(new Error(extractMessage(err)));
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isPending || googleLoading;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailTouched) validateEmail(e.target.value.trim());
            }}
            onBlur={(e) => { setEmailTouched(true); validateEmail(e.target.value.trim()); }}
            aria-invalid={!!emailError}
            aria-describedby="login-email-desc"
            disabled={isLoading}
            className="w-full p-2 border rounded transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p id="login-email-desc" className={`text-sm mt-1 ${emailError ? "text-red-600" : "text-gray-500"}`}>
            {emailError ?? "Unesite svoj email (npr. ime@domena.com)."}
          </p>
        </div>

        <div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Lozinka"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordTouched) validatePassword(e.target.value);
              }}
              onBlur={(e) => { setPasswordTouched(true); validatePassword(e.target.value); }}
              aria-invalid={!!passwordError}
              aria-describedby="login-password-desc"
              disabled={isLoading}
              className="w-full p-2 pr-10 border rounded transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829m4.243 4.243L17.657 17.657M17.657 17.657L21 21m-3.343-3.343l-2.829-2.829a3 3 0 01-4.243-4.243" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p id="login-password-desc" className={`text-sm mt-1 ${passwordError ? "text-red-600" : "text-gray-500"}`}>
            {passwordError ?? "Lozinka mora imati barem 8 znakova."}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isEmailValid(email) || !isPasswordValid(password)}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 transition-all hover:bg-blue-700 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Prijavljivanje...
            </>
          ) : "Prijavi se"}
        </button>
        {error && <p className="text-red-600 text-sm animate-shake" role="alert">{error.message}</p>}
      </form>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">ili</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => {
          setGoogleLoading(true);
          authClient.signIn.social({
            provider: "google",
            callbackURL: redirectUrl,
          });
        }}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded py-2 px-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-gray-500">Preusmjeravanje na Google...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Nastavi s Googleom</span>
          </>
        )}
      </button>

      <p className="text-sm text-center mt-4">
        Nemaš račun?{" "}
        <button onClick={onSwitch} disabled={isLoading} className="text-blue-600 underline hover:text-blue-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
          Registriraj se
        </button>
      </p>
    </>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();
  const { setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const validateUsername = useCallback((val: string) => {
    const ok = /^[a-zA-Z0-9_]{3,32}$/.test(val);
    setUsernameError(ok ? null : "Korisničko ime: 3-32 znaka, slova, brojevi ili _.");
    return ok;
  }, []);

  const validateEmailFormat = useCallback((val: string) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    return ok;
  }, []);

  const validatePassword = useCallback((val: string) => {
    const ok = val.length >= 8;
    setPasswordError(ok ? null : "Lozinka mora imati barem 8 znakova.");
    return ok;
  }, []);

  const checkEmailAvailability = useCallback(async (val: string) => {
    const emailVal = val.trim().toLowerCase();
    if (!validateEmailFormat(emailVal)) {
      setEmailError("Unesite valjan email.");
      setEmailAvailable(null);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setCheckingEmail(true);
    
    try {
      const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(emailVal)}`, {
        signal: abortControllerRef.current.signal,
      });
      if (res.ok) {
        const data = await res.json();
        setEmailAvailable(!data.exists);
        if (data.exists) {
          setEmailError("Email je već u upotrebi.");
        } else {
          setEmailError(null);
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Email check error:', e);
      }
    } finally {
      setCheckingEmail(false);
    }
  }, [validateEmailFormat]);

  const debouncedEmailCheck = useDebounce(checkEmailAvailability, 300);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const uname = username.trim();
    const emailVal = email.trim().toLowerCase();
    const passVal = password;

    const v1 = validateUsername(uname);
    const v2 = validateEmailFormat(emailVal);
    const v3 = validatePassword(passVal);
    
    if (!v2) setEmailError("Unesite valjan email.");
    if (!v1 || !v2 || !v3) return;

    if (emailAvailable === false) {
      setEmailError("Email je već u upotrebi. Molimo prijavite se ili koristite drugi email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authClient.signUp.email({ email: emailVal, password: passVal, name: uname });
      
      setUser({ name: uname, email: emailVal });
      
      startTransition(() => {
        router.push(`/?toast=registered&name=${encodeURIComponent(uname)}`);
      });
    } catch (err: any) {
      const msg = extractMessage(err);
      if (/unique|already|exist/i.test(msg)) {
        setError(new Error("Email je već u upotrebi. Molimo prijavite se ili koristite drugi email."));
      } else {
        setError(new Error(msg));
      }
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isPending || googleLoading;
  const canSubmit = !isLoading && !usernameError && !emailError && !passwordError && 
                    username && email && password && !checkingEmail && emailAvailable !== false;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="username"
            type="text"
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => validateUsername(e.target.value)}
            aria-invalid={!!usernameError}
            aria-describedby="reg-username-desc"
            disabled={isLoading}
            className="w-full p-2 border rounded transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p id="reg-username-desc" className={`text-sm mt-1 ${usernameError ? "text-red-600" : "text-gray-500"}`}>
            {usernameError ?? "3-32 znaka; slova, brojevi i _ su dopušteni."}
          </p>
        </div>

        <div>
          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { 
                setEmail(e.target.value); 
                setEmailAvailable(null);
                setEmailError(null);
                if (e.target.value.includes('@')) {
                  debouncedEmailCheck(e.target.value);
                }
              }}
              onBlur={(e) => checkEmailAvailability(e.target.value)}
              aria-invalid={!!emailError}
              aria-describedby="reg-email-desc"
              disabled={isLoading}
              className="w-full p-2 border rounded transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed pr-8"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {checkingEmail && (
                <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {!checkingEmail && emailAvailable === true && (
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {!checkingEmail && emailAvailable === false && (
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>
          <p id="reg-email-desc" className={`text-sm mt-1 ${emailError ? "text-red-600" : emailAvailable === true ? "text-green-600" : "text-gray-500"}`}>
            {emailError ?? (checkingEmail ? "Provjeravam dostupnost..." : (emailAvailable === true ? "✓ Email je dostupan!" : (emailAvailable === false ? "Email je već u upotrebi." : "Unesite svoj email (npr. ime@domena.com).")))}
          </p>
        </div>

        <div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => validatePassword(e.target.value)}
              aria-invalid={!!passwordError}
              aria-describedby="reg-password-desc"
              disabled={isLoading}
              className="w-full p-2 pr-10 border rounded transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              aria-label={showPassword ? "Sakrij lozinku" : "Prikaži lozinku"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 013.168-4.477M6.343 6.343A9.97 9.97 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.168 4.477M6.343 6.343L3 3m3.343 3.343l2.829 2.829m4.243 4.243L17.657 17.657M17.657 17.657L21 21m-3.343-3.343l-2.829-2.829a3 3 0 01-4.243-4.243" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p id="reg-password-desc" className={`text-sm mt-1 ${passwordError ? "text-red-600" : "text-gray-500"}`}>
            {passwordError ?? "Lozinka mora imati barem 8 znakova."}
          </p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50 transition-all hover:bg-green-700 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Registracija...
            </>
          ) : "Registriraj se"}
        </button>
        {error && <p className="text-red-600 text-sm" role="alert">{error.message}</p>}
      </form>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">ili</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => {
          setGoogleLoading(true);
          authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
          });
        }}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded py-2 px-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium text-gray-500">Preusmjeravanje na Google...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Registriraj se s Googleom</span>
          </>
        )}
      </button>

      <p className="text-sm text-center mt-4">
        Već imaš račun?{" "}
        <button onClick={onSwitch} disabled={isLoading} className="text-blue-600 underline hover:text-blue-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
          Prijavi se
        </button>
      </p>
    </>
  );
}

function PrijavaContent() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");

  return (
    <div className="w-full max-w-md mx-4 sm:mx-0 p-6 sm:p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        {mode === "login" ? "Prijava na CroNet" : "Registracija na CroNet"}
      </h1>

      {mode === "login" ? (
        <LoginForm onSwitch={() => setMode("register")} callback={callback} />
      ) : (
        <RegisterForm onSwitch={() => setMode("login")} />
      )}
    </div>
  );
}

export default function PrijavaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-0">
      <Suspense fallback={
        <div className="w-full max-w-md mx-4 sm:mx-0 p-6 sm:p-8 bg-white rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }>
        <PrijavaContent />
      </Suspense>
    </div>
  );
}
