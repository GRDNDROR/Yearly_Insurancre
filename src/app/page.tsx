export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-b from-blue-50 to-white rounded-2xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">
          ביטוח נסיעות לאנשי עסקים
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          מילוי טופס ביטוח נסיעות דיגיטלי - פשוט, מהיר ונוח.
          <br />
          ענו על השאלות ואנחנו נמלא את הטופס עבורכם ונשלח אותו להפקה.
        </p>
        <a
          href="/form"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors"
        >
          התחל מילוי טופס ←
        </a>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="font-semibold text-lg mb-2">מילוי פשוט</h3>
          <p className="text-gray-500 text-sm">
            שאלות ברורות בעברית - בלי טפסים טכניים מסובכים
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-semibold text-lg mb-2">מהיר ויעיל</h3>
          <p className="text-gray-500 text-sm">
            תהליך קצר שלוקח דקות ספורות במקום מילוי ידני ארוך
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
          <div className="text-4xl mb-3">📧</div>
          <h3 className="font-semibold text-lg mb-2">שליחה אוטומטית</h3>
          <p className="text-gray-500 text-sm">
            הטופס הממולא נשלח אוטומטית במייל להפקת הפוליסה
          </p>
        </div>
      </section>
    </div>
  );
}
