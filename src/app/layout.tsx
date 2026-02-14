import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ביטוח נסיעות לאנשי עסקים",
  description: "מילוי טופס ביטוח נסיעות דיגיטלי - פשוט, מהיר ונוח",
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
      <body className="antialiased">
        <header className="bg-blue-800 text-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">✈️ ביטוח נסיעות עסקי</h1>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="hover:text-blue-200 transition-colors">
                דף הבית
              </a>
              <a href="/form" className="hover:text-blue-200 transition-colors">
                מילוי טופס
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-100 text-gray-500 text-center text-sm py-4 mt-12">
          <p>© {new Date().getFullYear()} ביטוח נסיעות עסקי - כל הזכויות שמורות</p>
        </footer>
      </body>
    </html>
  );
}
