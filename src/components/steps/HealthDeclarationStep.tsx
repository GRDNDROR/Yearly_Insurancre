"use client";

import { useState, useRef } from "react";
import { useFormContext } from "@/lib/form-context";
import { HealthDeclaration } from "@/types/form";

// ── Helpers ──────────────────────────────────────────────────────────

function hasAnyQ2_1(hd: HealthDeclaration): boolean {
  return (
    hd.q2_1_painClinic ||
    hd.q2_1_bloodTransfusion ||
    hd.q2_1_dialysis ||
    hd.q2_1_oncology ||
    hd.q2_1_biological ||
    hd.q2_1_kidneyDisease ||
    hd.q2_1_nervousSystem ||
    hd.q2_1_crohn ||
    hd.q2_1_copd ||
    hd.q2_1_cysticFibrosis ||
    hd.q2_1_als ||
    hd.q2_1_liverDisease ||
    hd.q2_1_heartFailure ||
    hd.q2_1_stroke
  );
}

function hasAnyQ5(hd: HealthDeclaration): boolean {
  return hd.q5_stroke || hd.q5_heartDisease || hd.q5_carotidStenosis;
}

// ── Sub-components ───────────────────────────────────────────────────

function YesNoToggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean | null;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-200
          ${
            value === true
              ? "bg-guardian-primary text-white shadow-md scale-[1.02]"
              : "bg-white text-gray-600 border border-gray-200 hover:border-guardian-gold hover:bg-guardian-cream"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.97]"}
        `}
      >
        <span className="inline-flex items-center gap-1.5">
          {value === true && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          כן
        </span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-200
          ${
            value === false
              ? "bg-guardian-primary text-white shadow-md scale-[1.02]"
              : "bg-white text-gray-600 border border-gray-200 hover:border-guardian-gold hover:bg-guardian-cream"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.97]"}
        `}
      >
        <span className="inline-flex items-center gap-1.5">
          {value === false && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          לא
        </span>
      </button>
    </div>
  );
}

function QuestionCard({
  number,
  icon,
  children,
}: {
  number: number | string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Accent top bar */}
      <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] text-white text-sm font-bold flex-shrink-0 shadow-sm">
              {number}
            </span>
            {icon && <div className="mt-1">{icon}</div>}
          </div>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

function NoteBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f6f3ea] rounded-lg px-4 py-3 mt-3 border border-[#ede8db]">
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 text-[#bca562] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 text-xs leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-3 flex items-start gap-2">
      <svg
        className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <p className="text-amber-800 text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function RejectionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-4 mt-3 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-4 h-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-red-800 text-sm font-medium leading-relaxed">{children}</p>
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-200
        ${checked ? "bg-[#f6f3ea]" : "hover:bg-gray-50"}`}
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
          ${
            checked
              ? "bg-guardian-primary border-guardian-primary scale-110"
              : "bg-white border-gray-300"
          }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${checked ? "text-guardian-primary font-medium" : "text-gray-700"}`}>
        {label}
      </span>
    </label>
  );
}

function FileUploadPlaceholder({
  fileUrl,
  onFileChange,
}: {
  fileUrl: string;
  onFileChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file.name);
    }
  };

  return (
    <div className="mt-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        onChange={handleFileSelect}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl px-4 py-5 text-center transition-all duration-200
          ${
            fileUrl
              ? "border-green-300 bg-green-50"
              : "border-gray-300 bg-gray-50 hover:border-[#bca562] hover:bg-[#f6f3ea] hover:shadow-sm"
          }`}
      >
        {fileUrl ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-700 text-sm font-medium">{fileUrl}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange("");
              }}
              className="text-gray-400 hover:text-red-500 me-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#ede8db] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#bca562]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <span className="text-gray-600 text-sm font-medium">צרף מסמך רפואי</span>
            <span className="text-gray-400 text-xs">PDF, JPG, PNG, DOC</span>
          </div>
        )}
      </button>
    </div>
  );
}

function ConditionalSection({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        show ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
      }`}
    >
      {children}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function HealthDeclarationStep() {
  const { healthDeclaration, setHealthDeclaration, nextStep, prevStep } =
    useFormContext();

  const [validationError, setValidationError] = useState("");

  const update = (partial: Partial<HealthDeclaration>) => {
    setHealthDeclaration({ ...healthDeclaration, ...partial });
    setValidationError("");
  };

  const handleQ2Change = (val: boolean) => {
    if (!val) {
      update({
        q2_regularMedication: val,
        q2_1_painClinic: false,
        q2_1_bloodTransfusion: false,
        q2_1_dialysis: false,
        q2_1_oncology: false,
        q2_1_biological: false,
        q2_1_kidneyDisease: false,
        q2_1_nervousSystem: false,
        q2_1_crohn: false,
        q2_1_copd: false,
        q2_1_cysticFibrosis: false,
        q2_1_als: false,
        q2_1_liverDisease: false,
        q2_1_heartFailure: false,
        q2_1_stroke: false,
      });
    } else {
      update({ q2_regularMedication: val });
    }
  };

  const handleQ3Change = (val: boolean) => {
    if (!val) {
      update({ q3_hospitalization: val, q3_1_performedOver3Months: null });
    } else {
      update({ q3_hospitalization: val });
    }
  };

  // ── Derived state for warnings ──

  const needsMedicalDocForQ2_1 = healthDeclaration.q2_regularMedication === true && hasAnyQ2_1(healthDeclaration);
  const needsPreExistingForQ2_1 =
    healthDeclaration.q2_regularMedication === true &&
    healthDeclaration.q2_1_painClinic === false &&
    healthDeclaration.q2_1_bloodTransfusion === false &&
    healthDeclaration.q2_1_dialysis === false &&
    healthDeclaration.q2_1_oncology === false &&
    healthDeclaration.q2_1_biological === false &&
    healthDeclaration.q2_1_kidneyDisease === false &&
    healthDeclaration.q2_1_nervousSystem === false &&
    healthDeclaration.q2_1_crohn === false &&
    healthDeclaration.q2_1_copd === false &&
    healthDeclaration.q2_1_cysticFibrosis === false &&
    healthDeclaration.q2_1_als === false &&
    healthDeclaration.q2_1_liverDisease === false &&
    healthDeclaration.q2_1_heartFailure === false &&
    healthDeclaration.q2_1_stroke === false;

  const needsMedicalDocForQ3_1 =
    healthDeclaration.q3_hospitalization === true &&
    healthDeclaration.q3_1_performedOver3Months === false;

  const needsPreExistingForQ3_1 =
    healthDeclaration.q3_hospitalization === true &&
    healthDeclaration.q3_1_performedOver3Months === true;

  const needsMedicalDocForQ4 = healthDeclaration.q4_testReferral === true;

  const needsMedicalDocForQ5 = hasAnyQ5(healthDeclaration);

  const requiresMedicalDoc =
    needsMedicalDocForQ2_1 || needsMedicalDocForQ3_1 || needsMedicalDocForQ4 || needsMedicalDocForQ5;

  const isRejected = healthDeclaration.q1_medicalPurpose === true;

  // ── Validation ──

  const canProceed = (): boolean => {
    if (isRejected) return false;

    if (healthDeclaration.q1_medicalPurpose === null) {
      setValidationError("יש לענות על שאלה 1");
      return false;
    }
    if (healthDeclaration.q2_regularMedication === null) {
      setValidationError("יש לענות על שאלה 2");
      return false;
    }
    if (healthDeclaration.q3_hospitalization === null) {
      setValidationError("יש לענות על שאלה 3");
      return false;
    }
    if (
      healthDeclaration.q3_hospitalization === true &&
      healthDeclaration.q3_1_performedOver3Months === null
    ) {
      setValidationError("יש לענות על שאלה 3.1");
      return false;
    }
    if (healthDeclaration.q4_testReferral === null) {
      setValidationError("יש לענות על שאלה 4");
      return false;
    }

    if (requiresMedicalDoc && !healthDeclaration.medicalDocumentUrl) {
      setValidationError("יש לצרף מסמך רפואי");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (canProceed()) {
      nextStep();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] mb-5 shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2c43]">הצהרת בריאות</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          יש לענות על כל השאלות בכנות ובמלואן
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-l from-[#5784be] to-[#bca562] mx-auto mt-4 rounded-full" />
      </div>

      <div className="space-y-5">
        {/* ─── Question 1 ─── */}
        <QuestionCard number={1}>
          <p className="text-base font-semibold text-[#1a2c43] leading-relaxed">
            האם אחת ממטרות הנסיעה היא קבלת ייעוץ, אבחון או טיפול רפואי?
          </p>
          <NoteBox>
            אין צורך לסמן &quot;כן&quot; עבור טיפולי שיניים, השתלת שיער, טיפולים
            קוסמטיים (אלא אם כן מבוצעים בהרדמה כללית).
          </NoteBox>
          <YesNoToggle
            value={healthDeclaration.q1_medicalPurpose}
            onChange={(val) => update({ q1_medicalPurpose: val })}
          />
          <ConditionalSection show={isRejected}>
            <RejectionBox>
              לא ניתן להמשיך בתהליך. ביטוח נסיעות לחו&quot;ל אינו מכסה נסיעות
              שמטרתן קבלת טיפול רפואי.
            </RejectionBox>
          </ConditionalSection>
        </QuestionCard>

        {/* ─── Question 2 ─── */}
        <QuestionCard number={2}>
          <p className="text-base font-semibold text-[#1a2c43] leading-relaxed">
            האם לקחת בחצי השנה האחרונה תרופות באופן קבוע או עברת טיפול אחר?
          </p>
          <NoteBox>
            אין צורך לסמן &quot;כן&quot; עבור: טיפול הורמונלי חלופי, ויטמינים,
            תרופות לאלרגיה, גלולות למניעת הריון, כולסטרול, בלוטת התריס, ADHD,
            לחץ דם, שינה, צרבת, ערמונית, מיגרנות.
          </NoteBox>
          <YesNoToggle
            value={healthDeclaration.q2_regularMedication}
            onChange={handleQ2Change}
            disabled={isRejected}
          />

          {/* ─── Question 2.1 ─── */}
          <ConditionalSection show={healthDeclaration.q2_regularMedication === true}>
            <div className="bg-[#f6f3ea] rounded-xl p-4 border border-[#ede8db]">
              <p className="text-sm font-semibold text-[#1a2c43] mb-3">
                2.1 האם הינך נמצא בטיפול או הומלץ לך על:
              </p>

              {/* Treatments */}
              <p className="text-xs text-[#bca562] font-bold mb-1 mt-2 uppercase tracking-wide">טיפולים</p>
              <div className="space-y-0.5">
                <CheckboxItem
                  label="מרפאת כאב"
                  checked={healthDeclaration.q2_1_painClinic}
                  onChange={(v) => update({ q2_1_painClinic: v })}
                />
                <CheckboxItem
                  label="עירוי דם"
                  checked={healthDeclaration.q2_1_bloodTransfusion}
                  onChange={(v) => update({ q2_1_bloodTransfusion: v })}
                />
                <CheckboxItem
                  label="דיאליזה"
                  checked={healthDeclaration.q2_1_dialysis}
                  onChange={(v) => update({ q2_1_dialysis: v })}
                />
                <CheckboxItem
                  label="טיפול אונקולוגי"
                  checked={healthDeclaration.q2_1_oncology}
                  onChange={(v) => update({ q2_1_oncology: v })}
                />
                <CheckboxItem
                  label="טיפול ביולוגי / נוגד דחייה"
                  checked={healthDeclaration.q2_1_biological}
                  onChange={(v) => update({ q2_1_biological: v })}
                />
              </div>

              {/* Medical conditions */}
              <p className="text-xs text-[#bca562] font-bold mb-1 mt-4 uppercase tracking-wide">מצבים רפואיים</p>
              <div className="space-y-0.5">
                <CheckboxItem
                  label="מחלת כליות כרונית"
                  checked={healthDeclaration.q2_1_kidneyDisease}
                  onChange={(v) => update({ q2_1_kidneyDisease: v })}
                />
                <CheckboxItem
                  label="מחלת מערכת עצבים"
                  checked={healthDeclaration.q2_1_nervousSystem}
                  onChange={(v) => update({ q2_1_nervousSystem: v })}
                />
                <CheckboxItem
                  label="מחלת קרוהן"
                  checked={healthDeclaration.q2_1_crohn}
                  onChange={(v) => update({ q2_1_crohn: v })}
                />
                <CheckboxItem
                  label="COPD - מחלת ריאות חסימתית כרונית"
                  checked={healthDeclaration.q2_1_copd}
                  onChange={(v) => update({ q2_1_copd: v })}
                />
                <CheckboxItem
                  label="סיסטיק פיברוזיס"
                  checked={healthDeclaration.q2_1_cysticFibrosis}
                  onChange={(v) => update({ q2_1_cysticFibrosis: v })}
                />
                <CheckboxItem
                  label="ALS"
                  checked={healthDeclaration.q2_1_als}
                  onChange={(v) => update({ q2_1_als: v })}
                />
                <CheckboxItem
                  label="מחלת כבד כרונית"
                  checked={healthDeclaration.q2_1_liverDisease}
                  onChange={(v) => update({ q2_1_liverDisease: v })}
                />
                <CheckboxItem
                  label="אי ספיקת לב"
                  checked={healthDeclaration.q2_1_heartFailure}
                  onChange={(v) => update({ q2_1_heartFailure: v })}
                />
                <CheckboxItem
                  label="אירוע מוחי"
                  checked={healthDeclaration.q2_1_stroke}
                  onChange={(v) => update({ q2_1_stroke: v })}
                />
              </div>

              <ConditionalSection show={needsMedicalDocForQ2_1}>
                <WarningBox>
                  נדרש לצרף מסמך רפואי עדכני המעיד על המצב הרפואי.
                </WarningBox>
              </ConditionalSection>

              <ConditionalSection show={needsPreExistingForQ2_1}>
                <WarningBox>
                  על מנת לקבל כיסוי, יש לרכוש הרחבת מצב רפואי קודם בשלב בחירת
                  תוכנית הביטוח.
                </WarningBox>
              </ConditionalSection>
            </div>
          </ConditionalSection>
        </QuestionCard>

        {/* ─── Question 3 ─── */}
        <QuestionCard number={3}>
          <p className="text-base font-semibold text-[#1a2c43] leading-relaxed">
            האם עברת בששת החודשים האחרונים אשפוז או ניתוח?
          </p>
          <NoteBox>
            כולל: מחלת נפש, ראש, לב, צנתור, כיס מרה, כליות, מערכת עיכול, ריאות,
            עמוד שדרה.
          </NoteBox>
          <YesNoToggle
            value={healthDeclaration.q3_hospitalization}
            onChange={handleQ3Change}
            disabled={isRejected}
          />

          <ConditionalSection show={healthDeclaration.q3_hospitalization === true}>
            <div className="bg-[#f6f3ea] rounded-xl p-4 border border-[#ede8db]">
              <p className="text-sm font-semibold text-[#1a2c43] mb-1">
                3.1 האם הניתוח/האשפוז כבר בוצע וחלפו מאז למעלה משלושה חודשים?
              </p>
              <YesNoToggle
                value={healthDeclaration.q3_1_performedOver3Months}
                onChange={(val) => update({ q3_1_performedOver3Months: val })}
              />

              <ConditionalSection show={needsMedicalDocForQ3_1}>
                <WarningBox>
                  נדרש לצרף מסמך רפואי עדכני המעיד על המצב הרפואי.
                </WarningBox>
              </ConditionalSection>

              <ConditionalSection show={needsPreExistingForQ3_1}>
                <WarningBox>
                  על מנת לקבל כיסוי, יש לרכוש הרחבת מצב רפואי קודם בשלב בחירת
                  תוכנית הביטוח.
                </WarningBox>
              </ConditionalSection>
            </div>
          </ConditionalSection>
        </QuestionCard>

        {/* ─── Question 4 ─── */}
        <QuestionCard number={4}>
          <p className="text-base font-semibold text-[#1a2c43] leading-relaxed">
            האם הופנית במהלך חצי השנה האחרונה לבדיקות נוספות?
          </p>
          <NoteBox>
            כגון: MRI, CT, אקו לב, דופלר, מבחן מאמץ, הולטר.
          </NoteBox>
          <YesNoToggle
            value={healthDeclaration.q4_testReferral}
            onChange={(val) => update({ q4_testReferral: val })}
            disabled={isRejected}
          />

          <ConditionalSection show={needsMedicalDocForQ4}>
            <WarningBox>
              נדרש לצרף מסמך רפואי עדכני המעיד על תוצאות הבדיקות.
            </WarningBox>
          </ConditionalSection>
        </QuestionCard>

        {/* ─── Question 5 ─── */}
        <QuestionCard number={5}>
          <p className="text-base font-semibold text-[#1a2c43] leading-relaxed">
            האם אובחנת בשנתיים האחרונות באחד מהמצבים הבאים?
          </p>
          <div className="mt-3 space-y-0.5">
            <CheckboxItem
              label="אירוע מוחי (שבץ)"
              checked={healthDeclaration.q5_stroke}
              onChange={(v) => update({ q5_stroke: v })}
            />
            <CheckboxItem
              label="מחלת לב"
              checked={healthDeclaration.q5_heartDisease}
              onChange={(v) => update({ q5_heartDisease: v })}
            />
            <CheckboxItem
              label="היצרות עורקי הצוואר"
              checked={healthDeclaration.q5_carotidStenosis}
              onChange={(v) => update({ q5_carotidStenosis: v })}
            />
          </div>

          <ConditionalSection show={needsMedicalDocForQ5}>
            <WarningBox>
              במידה ויעד הנסיעה הוא ארה&quot;ב, נדרש לצרף מסמך רפואי עדכני.
            </WarningBox>
          </ConditionalSection>
        </QuestionCard>

        {/* ─── Medical Document Upload ─── */}
        <ConditionalSection show={requiresMedicalDoc}>
          <div className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a2c43]">צירוף מסמך רפואי</h3>
                <p className="text-xs text-gray-500">
                  על סמך תשובותיך, יש לצרף מסמך רפואי עדכני לצורך חיתום.
                </p>
              </div>
            </div>
            <FileUploadPlaceholder
              fileUrl={healthDeclaration.medicalDocumentUrl}
              onFileChange={(url) => update({ medicalDocumentUrl: url })}
            />
          </div>
        </ConditionalSection>

        {/* ─── Validation Error ─── */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-red-700 text-sm font-medium">{validationError}</span>
          </div>
        )}

        {/* ─── Navigation Buttons ─── */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={handleNext}
            disabled={isRejected}
            className={`flex-1 py-4 rounded-xl text-white font-semibold text-base transition-all duration-200
              ${
                isRejected
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-l from-[#1a2c43] to-[#253f60] hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
              }`}
          >
            המשך
          </button>
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-base
              hover:border-[#bca562] hover:bg-[#f6f3ea] active:scale-[0.98] transition-all duration-200"
          >
            חזרה
          </button>
        </div>
      </div>
    </div>
  );
}
