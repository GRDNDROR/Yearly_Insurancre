"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";
import { InsurancePlan } from "@/types/form";

function addDays(dateStr: string, days: number): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// ── Sub-components ───────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] flex items-center justify-center shadow-sm flex-shrink-0">
            {icon}
          </div>
          <h3 className="text-base font-bold text-[#1a2c43] flex-1">{title}</h3>
          {badge}
        </div>
        {children}
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 flex-shrink-0
        ${checked ? "bg-[#1a2c43]" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200
          ${checked ? "-translate-x-[1.375rem]" : "-translate-x-1"}`}
      />
    </button>
  );
}

function BaseCoverageItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm text-gray-800 font-medium">{label}</span>
    </div>
  );
}

function ExtensionItem({
  label,
  checked,
  onChange,
  note,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  note?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-3.5 px-3 rounded-xl transition-all duration-200
      ${checked ? "bg-[#f6f3ea]" : "hover:bg-gray-50"}`}>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${checked ? "text-[#1a2c43] font-medium" : "text-gray-700"}`}>{label}</span>
        {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function InsurancePlanStep() {
  const { insurancePlan, setInsurancePlan, nextStep, prevStep } =
    useFormContext();

  const [dateError, setDateError] = useState("");

  const update = (partial: Partial<InsurancePlan>) => {
    setInsurancePlan({ ...insurancePlan, ...partial });
    setDateError("");
  };

  const handleStartDateChange = (value: string) => {
    update({
      startDate: value,
      endDate: addDays(value, 365),
    });
  };

  const handleNext = () => {
    if (!insurancePlan.startDate || !insurancePlan.endDate) {
      setDateError("יש להזין תאריך התחלה ותאריך סיום לפני שניתן להמשיך");
      return;
    }
    const start = new Date(insurancePlan.startDate);
    const end = new Date(insurancePlan.endDate);
    if (end <= start) {
      setDateError("תאריך הסיום חייב להיות אחרי תאריך ההתחלה");
      return;
    }
    setDateError("");
    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] mb-5 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2c43]">תוכנית ביטוח</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          הראל First Class - בחר את הכיסויים המתאימים לך
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-l from-[#5784be] to-[#bca562] mx-auto mt-4 rounded-full" />
      </div>

      <div className="space-y-5">
        {/* ── Policy Period ── */}
        <SectionCard
          title="תקופת הפוליסה"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
          badge={<span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-1 rounded-full">שדה חובה *</span>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1.5">
                תאריך התחלה
              </label>
              <input
                id="startDate"
                type="date"
                value={insurancePlan.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be]
                  ${dateError && !insurancePlan.startDate ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white hover:border-gray-300"}`}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1.5">
                תאריך סיום
              </label>
              <input
                id="endDate"
                type="date"
                value={insurancePlan.endDate}
                onChange={(e) => update({ endDate: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be]
                  ${dateError && !insurancePlan.endDate ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white hover:border-gray-300"}`}
              />
            </div>
          </div>
          {dateError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-red-700 text-sm">{dateError}</span>
            </div>
          )}
        </SectionCard>

        {/* ── Base Coverage ── */}
        <SectionCard
          title="כיסוי בסיסי"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>}
          badge={<span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">כלול בפוליסה</span>}
        >
          <div className="bg-green-50/50 rounded-xl px-4 py-1">
            <BaseCoverageItem label="ביטוח רפואי בסיסי" />
            <BaseCoverageItem label="חיפוש, איתור וחילוץ" />
            <BaseCoverageItem label="חבות כלפי צד ג'" />
          </div>
        </SectionCard>

        {/* ── Free Extensions ── */}
        <SectionCard
          title="הרחבות ללא עלות"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>}
          badge={<span className="text-xs text-[#5784be] font-semibold bg-[#f6f3ea] px-2 py-1 rounded-full">חינם</span>}
        >
          <div className="space-y-1">
            <ExtensionItem
              label="כבודה - אובדן או גניבה"
              checked={insurancePlan.luggage}
              onChange={(v) => update({ luggage: v })}
            />
            <ExtensionItem
              label="ביטול וקיצור נסיעה"
              checked={insurancePlan.tripCancellation}
              onChange={(v) => update({ tripCancellation: v })}
            />
            <ExtensionItem
              label="החמרה למצב רפואי קודם"
              checked={insurancePlan.preExistingCondition}
              onChange={(v) => update({ preExistingCondition: v })}
            />
            <ExtensionItem
              label="ספורט אתגרי חובבני"
              checked={insurancePlan.extremeSports}
              onChange={(v) => update({ extremeSports: v })}
            />
            <ExtensionItem
              label="ספורט חורף"
              checked={insurancePlan.winterSports}
              onChange={(v) => update({ winterSports: v })}
            />
          </div>
        </SectionCard>

        {/* ── Device Details ── */}
        <SectionCard
          title="פרטי מכשירים"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>}
        >
          <div className="bg-[#f6f3ea] rounded-xl px-4 py-3 mb-4 border border-[#ede8db]">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#bca562] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-xs leading-relaxed">
                הכיסוי לטלפון/מחשב הינו בתנאי שהמבוטח מסר את פרטי המכשיר
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="laptopModel" className="block text-sm font-medium text-gray-600 mb-1.5">
                דגם מחשב נייד
              </label>
              <input
                id="laptopModel"
                type="text"
                value={insurancePlan.laptopModel}
                onChange={(e) => update({ laptopModel: e.target.value })}
                placeholder='לדוגמה: MacBook Pro 14"'
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-end transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] hover:border-gray-300"
              />
            </div>
            <div>
              <label htmlFor="phoneModel" className="block text-sm font-medium text-gray-600 mb-1.5">
                דגם טלפון נייד
              </label>
              <input
                id="phoneModel"
                type="text"
                value={insurancePlan.phoneModel}
                onChange={(e) => update({ phoneModel: e.target.value })}
                placeholder="לדוגמה: iPhone 15 Pro"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-end transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] hover:border-gray-300"
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Paid Extensions ── */}
        <SectionCard
          title="הרחבות בתשלום"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
          badge={<span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded-full">בתשלום</span>}
        >
          <ExtensionItem
            label="ביטול השתתפות עצמית לרכב שכור"
            checked={insurancePlan.rentalCarDeductible}
            onChange={(v) => update({ rentalCarDeductible: v })}
            note="לנהג מגיל 24 ועד גיל 75"
          />
        </SectionCard>

        {/* ── Travel Duration Info ── */}
        <div className="bg-[#f6f3ea] rounded-xl border border-[#ede8db] p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ede8db] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#5784be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#1a2c43]">מגבלות משך נסיעה</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-700">גיל 19-70</span>
              <span className="text-sm font-bold text-[#5784be]">עד 60 ימים רצופים</span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-gray-700">גיל 71-75</span>
              <span className="text-sm font-bold text-[#5784be]">עד 45 ימים רצופים</span>
            </div>
          </div>
        </div>

        {/* ── Navigation Buttons ── */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-4 rounded-xl text-white font-semibold text-base transition-all duration-200
              bg-gradient-to-l from-[#1a2c43] to-[#253f60] hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
          >
            הבא
          </button>
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-base
              hover:border-[#bca562] hover:bg-[#f6f3ea] active:scale-[0.98] transition-all duration-200"
          >
            הקודם
          </button>
        </div>
      </div>
    </div>
  );
}
