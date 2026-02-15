"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";

export default function PaymentStep() {
  const { personalInfo, paymentInfo, setPaymentInfo, nextStep, prevStep } =
    useFormContext();

  const [mode, setMode] = useState<"choose" | "self" | "skip" | "done">(
    paymentInfo.last4Digits ? "done" : "choose"
  );

  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState(paymentInfo.expiryMonth || "");
  const [expiryYear, setExpiryYear] = useState(paymentInfo.expiryYear || "");
  const [cvv, setCvv] = useState("");
  const [numPayments, setNumPayments] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));

  const isSelfFormValid =
    cardNumber.replace(/\s/g, "").length >= 15 &&
    expiryMonth !== "" &&
    expiryYear !== "" &&
    cvv.length >= 3;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleSelfSubmit = () => {
    if (!isSelfFormValid) return;
    setIsProcessing(true);

    const digits = cardNumber.replace(/\s/g, "");
    const last4 = digits.slice(-4);

    setTimeout(() => {
      setPaymentInfo({
        token: "",
        last4Digits: last4,
        expiryMonth,
        expiryYear,
        cardNumber: digits,
        cvv,
        numPayments: parseInt(numPayments),
        cardHolderName: `${personalInfo.firstName} ${personalInfo.lastName}`,
        cardHolderId: personalInfo.idNumber,
      });
      setIsProcessing(false);
      setMode("done");
    }, 800);
  };

  const handleSkip = () => {
    setPaymentInfo({
      token: "",
      last4Digits: "",
      expiryMonth: "",
      expiryYear: "",
      skippedByCustomer: true,
    });
    setMode("skip");
  };

  const handleReset = () => {
    setPaymentInfo({
      token: "",
      last4Digits: "",
      expiryMonth: "",
      expiryYear: "",
    });
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setMode("choose");
  };

  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] mb-5 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2c43]">פרטי תשלום</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          הזנת פרטי כרטיס אשראי לחיוב הפוליסה
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-l from-[#5784be] to-[#bca562] mx-auto mt-4 rounded-full" />
      </div>

      <div className="space-y-5">
        {/* ── Choose Mode ── */}
        {mode === "choose" && (
          <>
            <div className="space-y-3">
              {/* Option 1: Self fill */}
              <button
                type="button"
                onClick={() => setMode("self")}
                className="w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden text-end group"
              >
                <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] flex items-center justify-center flex-shrink-0 shadow-sm
                      group-hover:scale-105 transition-transform duration-200">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[#1a2c43] text-base">אזין את הפרטים בעצמי</p>
                      <p className="text-xs text-gray-400 mt-1">
                        הזנת מספר כרטיס, תוקף ו-CVV ישירות בטופס
                      </p>
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 2: Agent fills later */}
              <button
                type="button"
                onClick={handleSkip}
                className="w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden text-end group"
              >
                <div className="h-1 bg-gradient-to-l from-amber-400 to-amber-300" />
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0
                      group-hover:scale-105 transition-transform duration-200">
                      <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[#1a2c43] text-base">הסוכן ישלים את התשלום</p>
                      <p className="text-xs text-gray-400 mt-1">
                        אמסור את פרטי האשראי טלפונית או שהסוכן יזין עבורי
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Security note */}
            <div className="bg-[#f6f3ea] border border-[#ede8db] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ede8db] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#5784be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm text-[#1a2c43] leading-relaxed">
                  החיבור מאובטח (HTTPS). פרטי האשראי מועברים ישירות להראל ולא נשמרים במערכת.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── Self-Fill Mode ── */}
        {mode === "self" && (
          <>
            {/* Card holder info */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-[#1a2c43]">בעל הכרטיס</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">שם</label>
                    <input type="text" value={`${personalInfo.firstName} ${personalInfo.lastName}`} readOnly
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">ת.ז.</label>
                    <input type="text" value={personalInfo.idNumber} readOnly
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-[#1a2c43]">פרטי כרטיס אשראי</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-600 mb-1.5">מספר כרטיס</label>
                    <input id="cardNumber" type="text" inputMode="numeric" value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000" maxLength={19}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-center text-lg tracking-widest font-mono transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] hover:border-gray-300"
                      dir="ltr" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-600 mb-1.5">חודש</label>
                      <select id="expiryMonth" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}
                        className="w-full px-2 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] text-center">
                        <option value="">--</option>
                        {months.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-600 mb-1.5">שנה</label>
                      <select id="expiryYear" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}
                        className="w-full px-2 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] text-center">
                        <option value="">----</option>
                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-600 mb-1.5">CVV</label>
                      <input id="cvv" type="password" inputMode="numeric" value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="***" maxLength={4}
                        className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-center font-mono transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be]"
                        dir="ltr" />
                    </div>
                    <div>
                      <label htmlFor="numPayments" className="block text-sm font-medium text-gray-600 mb-1.5">תשלומים</label>
                      <select id="numPayments" value={numPayments} onChange={(e) => setNumPayments(e.target.value)}
                        className="w-full px-2 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] text-center">
                        {[1, 2, 3, 4, 6, 10, 12].map((n) => <option key={n} value={String(n)}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <button type="button" onClick={handleSelfSubmit}
                    disabled={!isSelfFormValid || isProcessing}
                    className={`w-full py-4 rounded-xl text-white font-semibold text-base transition-all duration-200
                      ${isSelfFormValid && !isProcessing
                        ? "bg-gradient-to-l from-[#1a2c43] to-[#253f60] hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
                        : "bg-gray-300 cursor-not-allowed"
                      }`}>
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        שומר פרטי תשלום...
                      </span>
                    ) : "אשר פרטי תשלום"}
                  </button>

                  <button type="button" onClick={() => setMode("choose")}
                    className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                    חזרה לבחירת אופן תשלום
                  </button>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="bg-[#f6f3ea] border border-[#ede8db] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ede8db] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#5784be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm text-[#1a2c43] leading-relaxed">
                  הפרטים מועברים בחיבור מוצפן (HTTPS) ישירות להראל חברה לביטוח.
                  המערכת לא שומרת את פרטי הכרטיס.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── Done (Self-Filled) ── */}
        {mode === "done" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-l from-green-400 to-green-300" />
            <div className="text-center py-10 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-bold text-[#1a2c43] mb-1">פרטי כרטיס נקלטו</p>
              <p className="text-gray-400 text-base font-mono">
                **** **** **** {paymentInfo.last4Digits}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                תוקף: {paymentInfo.expiryMonth}/{paymentInfo.expiryYear}
              </p>
              <button type="button" onClick={handleReset}
                className="mt-5 text-sm text-[#5784be] hover:text-[#1a2c43] font-medium underline underline-offset-2 transition-colors">
                החלף כרטיס
              </button>
            </div>
          </div>
        )}

        {/* ── Skip Mode (Agent will fill) ── */}
        {mode === "skip" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-l from-amber-400 to-amber-300" />
            <div className="text-center py-10 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 mb-5">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-lg font-bold text-[#1a2c43] mb-1">הסוכן ישלים את פרטי התשלום</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                לאחר שליחת הטופס, הסוכן יצור איתך קשר להשלמת פרטי האשראי באופן מאובטח.
              </p>
              <button type="button" onClick={handleReset}
                className="mt-5 text-sm text-[#5784be] hover:text-[#1a2c43] font-medium underline underline-offset-2 transition-colors">
                בעצם, אזין את הפרטים בעצמי
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-6">
          <button type="button" onClick={nextStep}
            disabled={mode === "choose" || mode === "self"}
            className={`flex-1 py-4 rounded-xl text-white font-semibold text-base transition-all duration-200
              ${mode === "done" || mode === "skip"
                ? "bg-gradient-to-l from-[#1a2c43] to-[#253f60] hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
                : "bg-gray-300 cursor-not-allowed"
              }`}>
            הבא
          </button>
          <button type="button" onClick={prevStep}
            className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-base
              hover:border-[#bca562] hover:bg-[#f6f3ea] active:scale-[0.98] transition-all duration-200">
            הקודם
          </button>
        </div>
      </div>
    </div>
  );
}
