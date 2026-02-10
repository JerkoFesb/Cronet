"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Toast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toast = searchParams.get("toast");
  const name = searchParams.get("name");

  const [visible, setVisible] = useState(!!toast);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("toast");
        url.searchParams.delete("name");
        router.replace(url.pathname + url.search);
      } catch (e) {
        router.replace(window.location.pathname);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [toast, name, router]);

  if (!toast || !visible) return null;

  const decodedName = name ? decodeURIComponent(name) : null;
  const message =
    toast === "registered"
      ? `Uspješno ste registrirani${decodedName ? `, ${decodedName}` : ""}.`
      : toast === "signedout"
      ? `Uspješno ste odjavljeni.`
      : `Uspješno ste prijavljeni${decodedName ? `, ${decodedName}` : ""}.`;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow z-[9999] pointer-events-auto">
      {message}
    </div>
  );
}
