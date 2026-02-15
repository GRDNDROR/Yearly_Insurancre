export default function Home() {
  return (
    <div>
      {/* Hero Section - full width */}
      <section className="bg-guardian-primary py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-semibold text-guardian-cream mb-4 sm:mb-6 tracking-wide leading-tight">
            ביטוח נסיעות לאנשי עסקים
          </h2>
          <p className="text-guardian-gold text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            מילוי טופס ביטוח נסיעות דיגיטלי - פשוט, מהיר ונוח.
            <br className="hidden sm:block" />
            ענו על השאלות ואנחנו נמלא את הטופס עבורכם ונשלח אותו להפקה.
          </p>
          <a
            href="/form"
            className="inline-block bg-guardian-cream text-guardian-primary font-semibold px-8 sm:px-12 py-3.5 sm:py-4 text-base sm:text-lg border-2 border-guardian-gold hover:bg-guardian-cream-dark transition-colors"
          >
            התחל מילוי טופס
          </a>
        </div>
      </section>

      {/* Features - full width with padding */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white border border-guardian-gold rounded-sm p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-guardian-primary flex items-center justify-center">
              <svg className="w-7 h-7 text-guardian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-guardian-primary">מילוי פשוט</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              שאלות ברורות בעברית - בלי טפסים טכניים מסובכים
            </p>
          </div>
          <div className="bg-white border border-guardian-gold rounded-sm p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-guardian-primary flex items-center justify-center">
              <svg className="w-7 h-7 text-guardian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-guardian-primary">מהיר ויעיל</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              תהליך קצר שלוקח דקות ספורות במקום מילוי ידני ארוך
            </p>
          </div>
          <div className="bg-white border border-guardian-gold rounded-sm p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-guardian-primary flex items-center justify-center">
              <svg className="w-7 h-7 text-guardian-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-guardian-primary">שליחה אוטומטית</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              הטופס הממולא נשלח אוטומטית במייל להפקת הפוליסה
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
