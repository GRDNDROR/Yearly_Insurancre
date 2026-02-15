"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useFormContext } from "@/lib/form-context";

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

function CheckboxItem({
  checked,
  onChange,
  children,
  required,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
        checked
          ? "bg-[#f6f3ea] border-[#bca562]/30"
          : "bg-white border-gray-100 hover:bg-gray-50"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? "bg-gradient-to-br from-[#1a2c43] to-[#253f60] border-[#1a2c43]"
              : "border-gray-300 bg-white"
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1">
        <span className="text-sm sm:text-base text-[#1a2c43] leading-relaxed">
          {children}
          {required && <span className="text-red-500 me-1">*</span>}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
      </div>
    </label>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

export default function SignatureStep() {
  const { signatureData, setSignatureData, nextStep, prevStep } =
    useFormContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(
    signatureData.agreedToTerms
  );
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(
    signatureData.agreedToPrivacy
  );
  const canSubmit = hasContent && agreedToTerms && agreedToPrivacy;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution for crisp lines
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.strokeStyle = "#1a2c43";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Restore existing signature if present
    if (signatureData.signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasContent(true);
      };
      img.src = signatureData.signatureDataUrl;
    }
  }, [signatureData.signatureDataUrl]);

  const getPosition = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();

      if ("touches" in e) {
        const touch = e.touches[0];
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const pos = getPosition(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    },
    [getPosition]
  );

  const draw = useCallback(
    (
      e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
      e.preventDefault();
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const pos = getPosition(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasContent(true);
    },
    [isDrawing, getPosition]
  );

  const stopDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      setIsDrawing(false);
    },
    []
  );

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasContent(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");

    setSignatureData({
      signatureDataUrl: dataUrl,
      signedAt: new Date().toISOString(),
      agreedToTerms,
      agreedToPrivacy,
      agreedToMarketing: false,
    });

    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] mb-5 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2c43]">חתימה דיגיטלית</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          חתום/י על הטופס ואשר/י את תנאי הפוליסה
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-l from-[#5784be] to-[#bca562] mx-auto mt-4 rounded-full" />
      </div>

      <div className="space-y-6">
        {/* Signature Canvas */}
        <SectionCard
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          }
          title="חתימה"
        >
          <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50/50">
            <canvas
              ref={canvasRef}
              className="w-full touch-none cursor-crosshair"
              style={{ height: "180px" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasContent && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <p className="text-gray-400 text-sm">חתום/י כאן</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">
              {hasContent ? "ניתן לנקות ולחתום מחדש" : "השתמש/י בעכבר או במגע לחתימה"}
            </p>
            <button
              type="button"
              onClick={clearCanvas}
              className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              נקה חתימה
            </button>
          </div>
        </SectionCard>

        {/* Agreements */}
        <SectionCard
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="אישורים והסכמות"
        >
          <div className="space-y-3">
            <CheckboxItem
              checked={agreedToTerms}
              onChange={setAgreedToTerms}
              required
            >
              אני מאשר/ת שכל הפרטים שמסרתי הם נכונים ומלאים
            </CheckboxItem>

            <CheckboxItem
              checked={agreedToPrivacy}
              onChange={setAgreedToPrivacy}
              required
            >
              קראתי והבנתי את תנאי הפוליסה ומדיניות הפרטיות
            </CheckboxItem>
          </div>

          <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-[#f6f3ea]">
            <svg className="w-4 h-4 text-[#bca562] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-500">
              יש לסמן את כל השדות ולחתום על מנת להמשיך
            </p>
          </div>
        </SectionCard>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 py-4 rounded-xl font-medium text-base transition-all duration-200 flex items-center justify-center gap-2
              ${
                canSubmit
                  ? "bg-gradient-to-l from-[#1a2c43] to-[#253f60] text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            חתום ושלח
          </button>
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-[#1a2c43] font-medium text-base
              hover:border-[#bca562] hover:bg-[#f6f3ea] active:scale-[0.98] transition-all duration-200"
          >
            הקודם
          </button>
        </div>
      </div>
    </div>
  );
}
