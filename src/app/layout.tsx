import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipToContent } from "@/components/SkipToContent";
import { LiveAnnouncerProvider } from "@/components/LiveAnnouncer";

export const metadata: Metadata = {
  title: "ביטוח נסיעות לאנשי עסקים | גארדיאן",
  description: "מילוי טופס ביטוח נסיעות דיגיטלי - פשוט, מהיר ונוח | גארדיאן סוכנות לביטוח",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <SkipToContent />
        <LiveAnnouncerProvider>
          <ErrorBoundary level="app">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-guardian-primary text-guardian-cream border-b-2 border-guardian-gold">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/brand/logo.png"
                alt="גארדיאן"
                className="h-8 sm:h-10 w-auto"
              />
              <div>
                <h1 className="text-base sm:text-lg font-semibold tracking-wide">גארדיאן</h1>
                <p className="text-[10px] sm:text-xs text-guardian-gold opacity-90 hidden sm:block">סוכנות לביטוח פנסיוני</p>
              </div>
            </div>
            <nav className="flex gap-4 sm:gap-5 text-sm">
              <a href="/" className="hover:text-guardian-gold transition-colors">
                דף הבית
              </a>
              <a href="/form" className="hover:text-guardian-gold transition-colors">
                מילוי טופס
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content - full width */}
        <main id="main-content" className="flex-1 w-full" tabIndex={-1}>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-guardian-primary text-guardian-cream border-t-2 border-guardian-gold">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
            <p className="text-xs sm:text-sm opacity-80">
              {new Date().getFullYear()} &copy; גארדיאן סוכנות לביטוח פנסיוני (2023) בע&quot;מ - כל הזכויות שמורות
            </p>
            <p className="text-[10px] sm:text-xs text-guardian-gold mt-1 opacity-70">
              ח.פ. 516850682
            </p>
          </div>
        </footer>
          </ErrorBoundary>
        </LiveAnnouncerProvider>
      </body>
    </html>
  );
}
