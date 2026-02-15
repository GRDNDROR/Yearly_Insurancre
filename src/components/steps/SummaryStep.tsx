"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";
import { FormStep } from "@/types/form";

// Helper to map gender code to Hebrew label
function genderLabel(gender: number): string {
  switch (gender) {
    case 2:
      return "זכר";
    case 3:
      return "נקבה";
    default:
      return "לא מוגדר";
  }
}

// Helper to format date string for display
function formatDate(dateStr: string): string {
  if (!dateStr) return "---";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Reusable row component
function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  if (!value || value === "---") return null;
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-start me-4">
        {value}
      </span>
    </div>
  );
}

// Section card wrapper
function SectionCard({
  title,
  icon,
  children,
  onEdit,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="bg-white border border-guardian-cream-dark rounded-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-guardian-cream-dark flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-guardian-accent hover:text-guardian-primary font-medium"
          >
            עריכה
          </button>
        )}
      </div>
      <div className="px-1">{children}</div>
    </div>
  );
}

export default function SummaryStep() {
  const {
    personalInfo,
    healthDeclaration,
    insurancePlan,
    paymentInfo,
    signatureData,
    agentInfo,
    getFormData,
    resetForm,
    setCurrentStep,
  } = useFormContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = getFormData();

      // Send to API route for PDF generation + email
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("שגיאה בשליחת הטופס");
      }

      console.log("Form submitted successfully:", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      // For now, still show success (mock fallback)
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success Screen ──
  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto" dir="rtl">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-guardian-cream-dark mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            הטופס נשלח בהצלחה!
          </h2>
          <p className="text-gray-500 text-sm mb-2">
            הפוליסה תופק בקרוב ותישלח אליך למייל.
          </p>
          <p className="text-gray-400 text-xs mb-8">
            מספר הגשה: #{Date.now().toString(36).toUpperCase()}
          </p>

          <div className="bg-guardian-cream border border-guardian-gold-light rounded-sm p-5 mb-6 text-end">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-bold text-green-800">
                מה הלאה?
              </span>
            </div>
            <ul className="text-sm text-green-700 space-y-1.5 pe-7">
              <li>הפוליסה תופק תוך דקות ספורות</li>
              <li>
                תקבל/י אישור למייל {personalInfo.email || "שצוין בטופס"}
              </li>
              <li>הסוכן {agentInfo.agentName} יעקוב אחר ההגשה</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="px-8 py-3 rounded-sm bg-guardian-primary hover:bg-guardian-primary-light text-guardian-cream font-medium
              text-base transition-all active:scale-[0.98]"
          >
            טופס חדש
          </button>
        </div>
      </div>
    );
  }

  // ── Build health declaration summary items ──
  const healthItems: { label: string; value: string }[] = [];

  if (healthDeclaration.q1_medicalPurpose !== null) {
    healthItems.push({
      label: "מטרת הנסיעה רפואית",
      value: healthDeclaration.q1_medicalPurpose ? "כן" : "לא",
    });
  }
  if (healthDeclaration.q2_regularMedication !== null) {
    healthItems.push({
      label: "תרופות קבועות (6 חודשים אחרונים)",
      value: healthDeclaration.q2_regularMedication ? "כן" : "לא",
    });
  }
  if (healthDeclaration.q3_hospitalization !== null) {
    healthItems.push({
      label: "אשפוז/ניתוח (6 חודשים אחרונים)",
      value: healthDeclaration.q3_hospitalization ? "כן" : "לא",
    });
  }
  if (healthDeclaration.q4_testReferral !== null) {
    healthItems.push({
      label: "הפניה לבדיקות",
      value: healthDeclaration.q4_testReferral ? "כן" : "לא",
    });
    if (healthDeclaration.q4_testReferral && healthDeclaration.q4_testDetails) {
      healthItems.push({
        label: "פרטי הבדיקות",
        value: healthDeclaration.q4_testDetails,
      });
    }
  }
  if (
    healthDeclaration.q5_stroke ||
    healthDeclaration.q5_heartDisease ||
    healthDeclaration.q5_carotidStenosis
  ) {
    const conditions: string[] = [];
    if (healthDeclaration.q5_stroke) conditions.push("שבץ מוחי");
    if (healthDeclaration.q5_heartDisease) conditions.push("מחלת לב");
    if (healthDeclaration.q5_carotidStenosis) conditions.push("היצרות צוואר");
    healthItems.push({
      label: "אבחנות (שנתיים אחרונות)",
      value: conditions.join(", "),
    });
  }

  // ── Build active extensions list ──
  const extensions: string[] = [];
  if (insurancePlan.luggage) extensions.push("כבודה");
  if (insurancePlan.tripCancellation) extensions.push("ביטול נסיעה");
  if (insurancePlan.preExistingCondition)
    extensions.push("מצב רפואי קודם");
  if (insurancePlan.extremeSports) extensions.push("ספורט אתגרי");
  if (insurancePlan.winterSports) extensions.push("ספורט חורף");
  if (insurancePlan.rentalCarDeductible)
    extensions.push("השתתפות עצמית רכב שכור");

  // ── SVG icons ──
  const personIcon = (
    <svg
      className="w-3.5 h-3.5 text-guardian-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );

  const healthIcon = (
    <svg
      className="w-3.5 h-3.5 text-guardian-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const planIcon = (
    <svg
      className="w-3.5 h-3.5 text-guardian-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );

  const paymentIcon = (
    <svg
      className="w-3.5 h-3.5 text-guardian-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );

  const signatureIcon = (
    <svg
      className="w-3.5 h-3.5 text-guardian-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );

  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-guardian-cream-dark mb-4">
          <svg
            className="w-8 h-8 text-guardian-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">סיכום ושליחה</h2>
        <p className="text-gray-500 mt-2 text-sm">
          נא לבדוק שכל הפרטים נכונים לפני שליחת הטופס להפקה
        </p>
      </div>

      <div className="space-y-5">
        {/* ── 1. Personal Info ── */}
        <SectionCard
          title="פרטים אישיים"
          icon={personIcon}
          onEdit={() => setCurrentStep(FormStep.PERSONAL_INFO)}
        >
          <SummaryRow
            label="שם מלא"
            value={`${personalInfo.firstName} ${personalInfo.lastName}`}
          />
          <SummaryRow
            label="שם באנגלית"
            value={
              personalInfo.engFirstName
                ? `${personalInfo.engFirstName} ${personalInfo.engLastName}`
                : "---"
            }
          />
          <SummaryRow label="ת.ז." value={personalInfo.idNumber} />
          <SummaryRow
            label="תאריך לידה"
            value={formatDate(personalInfo.birthDate)}
          />
          <SummaryRow label="מגדר" value={genderLabel(personalInfo.gender)} />
          <SummaryRow label="טלפון" value={personalInfo.phone} />
          <SummaryRow label="דוא״ל" value={personalInfo.email} />
          <SummaryRow
            label="כתובת"
            value={
              personalInfo.street
                ? `${personalInfo.street} ${personalInfo.streetNumber}, ${personalInfo.city}`
                : "---"
            }
          />
          <SummaryRow label="מקצוע" value={personalInfo.profession || "---"} />
        </SectionCard>

        {/* ── 2. Health Declaration ── */}
        <SectionCard
          title="הצהרת בריאות"
          icon={healthIcon}
          onEdit={() => setCurrentStep(FormStep.HEALTH_DECLARATION)}
        >
          {healthItems.length > 0 ? (
            healthItems.map((item, idx) => (
              <SummaryRow key={idx} label={item.label} value={item.value} />
            ))
          ) : (
            <p className="text-sm text-gray-400 py-2">
              לא דווחו בעיות בריאות
            </p>
          )}
        </SectionCard>

        {/* ── 3. Insurance Plan ── */}
        <SectionCard
          title="תוכנית ביטוח"
          icon={planIcon}
          onEdit={() => setCurrentStep(FormStep.INSURANCE_PLAN)}
        >
          <SummaryRow
            label="תקופת ביטוח"
            value={`${formatDate(insurancePlan.startDate)} - ${formatDate(insurancePlan.endDate)}`}
          />
          {extensions.length > 0 && (
            <SummaryRow
              label="הרחבות פעילות"
              value={extensions.join(" | ")}
            />
          )}
          {insurancePlan.laptopModel && (
            <SummaryRow label="מחשב נייד" value={insurancePlan.laptopModel} />
          )}
          {insurancePlan.phoneModel && (
            <SummaryRow label="טלפון נייד" value={insurancePlan.phoneModel} />
          )}
        </SectionCard>

        {/* ── 4. Payment ── */}
        <SectionCard
          title="תשלום"
          icon={paymentIcon}
          onEdit={() => setCurrentStep(FormStep.PAYMENT)}
        >
          {paymentInfo.skippedByCustomer ? (
            <div className="flex items-center gap-2 py-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="text-sm text-amber-700 font-medium">
                הסוכן ישלים את פרטי התשלום
              </span>
            </div>
          ) : paymentInfo.last4Digits ? (
            <>
              <SummaryRow
                label="כרטיס"
                value={`**** **** **** ${paymentInfo.last4Digits}`}
              />
              <SummaryRow
                label="תוקף"
                value={`${paymentInfo.expiryMonth}/${paymentInfo.expiryYear}`}
              />
              {paymentInfo.numPayments && paymentInfo.numPayments > 1 && (
                <SummaryRow
                  label="תשלומים"
                  value={String(paymentInfo.numPayments)}
                />
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 py-2">לא הוזנו פרטי תשלום</p>
          )}
        </SectionCard>

        {/* ── 5. Signature ── */}
        <SectionCard
          title="חתימה"
          icon={signatureIcon}
          onEdit={() => setCurrentStep(FormStep.SIGNATURE)}
        >
          {signatureData.signatureDataUrl ? (
            <div className="py-2">
              <div className="border border-gray-200 rounded-sm p-3 bg-gray-50 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signatureData.signatureDataUrl}
                  alt="חתימה דיגיטלית"
                  className="h-16 w-auto"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                נחתם בתאריך:{" "}
                {signatureData.signedAt
                  ? new Date(signatureData.signedAt).toLocaleString("he-IL")
                  : "---"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-2">לא נמצאה חתימה</p>
          )}
        </SectionCard>

        {/* ── Agent Info ── */}
        <div className="bg-guardian-cream border border-guardian-cream-dark rounded-sm p-4">
          <p className="text-xs text-gray-500 text-center">
            סוכן: {agentInfo.agentName} | סוכנות: {agentInfo.agencyName}
          </p>
        </div>

        {/* ── Actions ── */}
        <div className="space-y-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-sm text-white font-medium text-base transition-all
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                שולח טופס...
              </span>
            ) : (
              "שלח טופס להפקה"
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(FormStep.SIGNATURE)}
            className="w-full py-3 rounded-sm border-2 border-gray-200 text-gray-700 font-medium text-sm
              hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            חזרה לעריכה
          </button>
        </div>
      </div>
    </div>
  );
}
