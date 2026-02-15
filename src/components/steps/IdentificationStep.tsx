"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useFormContext } from "@/lib/form-context";

/**
 * Israeli ID number validation using the Luhn-like algorithm.
 */
function validateIsraeliId(id: string): boolean {
  const trimmed = id.replace(/\D/g, "");
  if (trimmed.length === 0 || trimmed.length > 9) return false;

  const padded = trimmed.padStart(9, "0");
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    const digit = parseInt(padded[i], 10);
    let product = digit * ((i % 2 === 0) ? 1 : 2);
    if (product > 9) {
      product = Math.floor(product / 10) + (product % 10);
    }
    sum += product;
  }

  return sum % 10 === 0;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

function stripPhone(value: string): string {
  return value.replace(/\D/g, "");
}

function validatePhone(phone: string): boolean {
  const digits = stripPhone(phone);
  return digits.length === 10 && digits.startsWith("05");
}

const MOCK_OTP = "123456";
const COUNTDOWN_SECONDS = 60;

/* ── Sub-components ─────────────────────────────────────────────── */

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] flex items-center justify-center flex-shrink-0 shadow-sm">
            {icon}
          </div>
          <h3 className="text-base font-bold text-[#1a2c43]">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormInput({
  id,
  label,
  type = "text",
  inputMode,
  value,
  onChange,
  placeholder,
  maxLength,
  hasError,
  isValid,
  autoFocus,
  className: extraClass,
  endIcon,
}: {
  id: string;
  label: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  hasError?: boolean;
  isValid?: boolean;
  autoFocus?: boolean;
  className?: string;
  endIcon?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#1a2c43] mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className={`w-full px-4 py-3.5 rounded-xl border-2 text-end transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#5784be]/20
            ${
              hasError
                ? "border-red-300 focus:border-red-400"
                : isValid
                ? "border-green-300 focus:border-green-400"
                : "border-gray-200 focus:border-[#5784be]"
            }
            ${extraClass || ""}`}
        />
        {endIcon && (
          <div className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2">
            {endIcon}
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

export default function IdentificationStep() {
  const {
    personalInfo,
    setPersonalInfo,
    setIsOtpVerified,
    setCrmCustomerId,
    setIsDataFromCrm,
    nextStep,
  } = useFormContext();

  const [step, setStep] = useState<"input" | "otp" | "loading" | "verified">(
    "input"
  );
  const [otpCode, setOtpCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      return;
    }

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [countdown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatCountdown = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  const handleIdChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    setPersonalInfo({ ...personalInfo, idNumber: digits });
    setError("");
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setPersonalInfo({ ...personalInfo, phone: formatted });
    setError("");
  };

  const fetchCustomerFromCrm = async (): Promise<boolean> => {
    setLoadingMessage("מחפש נתוני לקוח...");

    try {
      const response = await fetch("/api/customer/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idNumber: personalInfo.idNumber,
          phone: stripPhone(personalInfo.phone),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[CRM] API error:", data.message);
        return false;
      }

      if (data.found && data.personalInfo) {
        setPersonalInfo({
          ...personalInfo,
          ...data.personalInfo,
          phone: personalInfo.phone,
        });
        setCrmCustomerId(data.customerId || "");
        setIsDataFromCrm(true);
        console.log("[CRM] Customer data loaded successfully");
        return true;
      } else {
        console.log("[CRM] Customer not found, will use empty form");
        setIsDataFromCrm(false);
        return false;
      }
    } catch (err) {
      console.error("[CRM] Network error:", err);
      return false;
    }
  };

  const handleSendOtp = async () => {
    if (!personalInfo.idNumber || personalInfo.idNumber.length === 0) {
      setError("יש להזין מספר תעודת זהות");
      return;
    }
    if (!validateIsraeliId(personalInfo.idNumber)) {
      setError("מספר תעודת זהות אינו תקין");
      return;
    }

    if (!personalInfo.phone || stripPhone(personalInfo.phone).length === 0) {
      setError("יש להזין מספר טלפון נייד");
      return;
    }
    if (!validatePhone(personalInfo.phone)) {
      setError("מספר טלפון אינו תקין. יש להזין מספר בפורמט 05X-XXXXXXX");
      return;
    }

    setError("");
    setIsSending(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSending(false);
    setStep("otp");
    setCountdown(COUNTDOWN_SECONDS);
    setOtpCode("");
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setError("");
    setIsSending(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSending(false);
    setCountdown(COUNTDOWN_SECONDS);
    setOtpCode("");
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      setError("יש להזין את קוד האימות");
      return;
    }

    setError("");
    setIsVerifying(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (otpCode === MOCK_OTP) {
      setIsVerifying(false);
      setIsOtpVerified(true);

      setStep("loading");
      setLoadingMessage("אימות הושלם, טוען נתוני לקוח...");

      const foundInCrm = await fetchCustomerFromCrm();

      setLoadingMessage(
        foundInCrm
          ? "נתוני הלקוח נטענו בהצלחה!"
          : "ממשיך למילוי פרטים..."
      );

      setStep("verified");
      setTimeout(() => {
        nextStep();
      }, 1500);
    } else {
      setIsVerifying(false);
      setError("קוד אימות שגוי. נסה שנית");
      setOtpCode("");
    }
  };

  const handleOtpChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setOtpCode(digits);
    setError("");
  };

  const handleBackToInput = () => {
    setStep("input");
    setOtpCode("");
    setError("");
    setCountdown(0);
  };

  const idIsValid = personalInfo.idNumber?.length === 9 && validateIsraeliId(personalInfo.idNumber);
  const phoneIsValid = personalInfo.phone && validatePhone(personalInfo.phone);

  return (
    <div className="w-full max-w-lg mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] mb-5 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2c43]">זיהוי ואימות</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          {step === "input" && "הזן את פרטיך לאימות זהות"}
          {step === "otp" && "הזן את קוד האימות שנשלח לטלפון שלך"}
          {step === "loading" && "טוען נתונים..."}
          {step === "verified" && "האימות הושלם בהצלחה!"}
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-l from-[#5784be] to-[#bca562] mx-auto mt-4 rounded-full" />
      </div>

      {/* Loading State */}
      {step === "loading" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f6f3ea] mb-5">
              <Spinner className="w-8 h-8 text-[#bca562]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a2c43] mb-2">
              {loadingMessage}
            </h3>
            <p className="text-gray-400 text-sm">אנא המתן...</p>
          </div>
        </div>
      )}

      {/* Success State */}
      {step === "verified" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-l from-green-400 to-green-500" />
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-5">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-2">
              הזהות אומתה בהצלחה
            </h3>
            <p className="text-green-600 text-sm">{loadingMessage || "ממשיך לשלב הבא..."}</p>
          </div>
        </div>
      )}

      {/* Input Step */}
      {step === "input" && (
        <div className="space-y-6">
          <SectionCard
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            }
            title="פרטי זיהוי"
          >
            <div className="space-y-5">
              <FormInput
                id="idNumber"
                label="תעודת זהות"
                inputMode="numeric"
                value={personalInfo.idNumber}
                onChange={handleIdChange}
                placeholder="הזן 9 ספרות"
                maxLength={9}
                hasError={!!error && !personalInfo.idNumber}
                isValid={idIsValid}
                endIcon={
                  personalInfo.idNumber?.length === 9 ? (
                    idIsValid ? (
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )
                  ) : undefined
                }
              />

              <FormInput
                id="phone"
                label="טלפון נייד"
                type="tel"
                inputMode="tel"
                value={personalInfo.phone}
                onChange={handlePhoneChange}
                placeholder="050-1234567"
                hasError={!!error && !stripPhone(personalInfo.phone)}
                isValid={!!phoneIsValid}
              />
            </div>
          </SectionCard>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Send OTP Button */}
          <button
            onClick={handleSendOtp}
            disabled={isSending}
            className={`w-full py-4 rounded-xl font-medium text-base transition-all duration-200 flex items-center justify-center gap-2
              ${
                isSending
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-l from-[#1a2c43] to-[#253f60] text-white shadow-md hover:shadow-lg active:scale-[0.98]"
              }`}
          >
            {isSending ? (
              <>
                <Spinner />
                שולח קוד אימות...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                שלח קוד אימות
              </>
            )}
          </button>
        </div>
      )}

      {/* OTP Step */}
      {step === "otp" && (
        <div className="space-y-6">
          {/* Info banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f6f3ea] border border-[#bca562]/20">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-4 h-4 text-[#bca562]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[#1a2c43] text-sm">
              קוד אימות נשלח למספר{" "}
              <span className="font-bold ltr inline-block" dir="ltr">
                {personalInfo.phone}
              </span>
            </p>
          </div>

          {/* OTP Input Card */}
          <SectionCard
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="קוד אימות"
          >
            <div>
              <label htmlFor="otpCode" className="block text-sm font-semibold text-[#1a2c43] mb-2">
                הזן את הקוד שקיבלת
              </label>
              <input
                id="otpCode"
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => handleOtpChange(e.target.value)}
                placeholder="------"
                maxLength={6}
                autoFocus
                className={`w-full px-4 py-4 rounded-xl border-2 text-center text-2xl tracking-[0.5em] font-mono transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#5784be]/20
                  ${
                    error
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[#5784be]"
                  }`}
              />
            </div>

            {/* Countdown */}
            <div className="text-center mt-4">
              {countdown > 0 ? (
                <p className="text-gray-400 text-sm">
                  ניתן לשלוח קוד חדש בעוד{" "}
                  <span className="font-mono font-bold text-[#bca562]">
                    {formatCountdown(countdown)}
                  </span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isSending}
                  className="text-[#5784be] hover:text-[#1a2c43] text-sm font-semibold underline underline-offset-2 transition-colors"
                >
                  {isSending ? "שולח..." : "שלח קוד חדש"}
                </button>
              )}
            </div>
          </SectionCard>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={isVerifying || otpCode.length < 4}
            className={`w-full py-4 rounded-xl font-medium text-base transition-all duration-200 flex items-center justify-center gap-2
              ${
                isVerifying || otpCode.length < 4
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-l from-[#1a2c43] to-[#253f60] text-white shadow-md hover:shadow-lg active:scale-[0.98]"
              }`}
          >
            {isVerifying ? (
              <>
                <Spinner />
                מאמת...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                אמת
              </>
            )}
          </button>

          {/* Back link */}
          <div className="text-center">
            <button
              onClick={handleBackToInput}
              className="text-gray-400 hover:text-[#1a2c43] text-sm font-medium transition-colors"
            >
              חזרה לעריכת פרטים
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
