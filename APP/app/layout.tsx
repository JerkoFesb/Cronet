import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "./_components/navigation";
import { FloatingChatWrapper } from "./_components/FloatingChatWrapper";
import { AuthProvider } from "./_providers/AuthProvider";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CroNet",
  description: "Odabir mreže - po vašim potrebama.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolve session on the server to avoid hydration flicker in the header
  let initialUser: { name?: string; email?: string } | null = null;
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });
    if (session?.user) {
      initialUser = { name: session.user.name, email: session.user.email };
    }
  } catch (e) {
    // Fail silently; client will revalidate
  }
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap the whole app UI with AuthProvider so header/navigation can use auth state */}
        <AuthProvider initialUser={initialUser}>
          <header className="fixed top-0 left-0 right-0 z-50 bg-white">
            <Navigation />
          </header>

          <main className="pt-20">
            <NuqsAdapter>{children}</NuqsAdapter>
          </main>

          <FloatingChatWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
