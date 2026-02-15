"use client";

import { useFormContext } from "@/lib/form-context";
import { PersonalInfo } from "@/types/form";

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] flex items-center justify-center shadow-sm">
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
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
  readOnly,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  type?: string;
  dir?: "ltr" | "rtl";
  readOnly?: boolean;
  inputMode?: "numeric" | "tel" | "email";
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        dir={dir}
        inputMode={inputMode}
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 transition-all duration-200
          ${dir === "ltr" ? "text-start" : "text-end"}
          ${
            readOnly
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] hover:border-gray-300"
          }`}
      />
    </div>
  );
}

export default function PersonalInfoStep() {
  const {
    personalInfo,
    setPersonalInfo,
    isResidentOfIsrael,
    setIsResidentOfIsrael,
    isCurrentlyInIsrael,
    setIsCurrentlyInIsrael,
    isDataFromCrm,
    nextStep,
    prevStep,
  } = useFormContext();

  const update = (partial: Partial<PersonalInfo>) => {
    setPersonalInfo({ ...personalInfo, ...partial });
  };

  return (
    <div className="w-full max-w-2xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] mb-5 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a2c43]">פרטים אישיים</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          אנא בדוק ועדכן את הפרטים האישיים
        </p>
        <div className="w-16 h-0.5 bg-gradient-to-l from-[#5784be] to-[#bca562] mx-auto mt-4 rounded-full" />
      </div>

      {/* CRM info banner */}
      {isDataFromCrm && (
        <div className="bg-[#f6f3ea] border border-[#ede8db] rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ede8db] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[#5784be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[#1a2c43] text-sm">
            הפרטים נשלפו ממערכת הניהול. אנא בדוק שהם נכונים.
          </span>
        </div>
      )}

      <div className="space-y-5">
        {/* ── Hebrew Name ── */}
        <SectionCard
          title="שם בעברית"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              label="שם פרטי"
              value={personalInfo.firstName}
              onChange={(val) => update({ firstName: val })}
              placeholder="שם פרטי"
            />
            <FormInput
              id="lastName"
              label="שם משפחה"
              value={personalInfo.lastName}
              onChange={(val) => update({ lastName: val })}
              placeholder="שם משפחה"
            />
          </div>
        </SectionCard>

        {/* ── English Name ── */}
        <SectionCard
          title="שם באנגלית"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="engFirstName"
              label="שם פרטי באנגלית"
              value={personalInfo.engFirstName}
              onChange={(val) => update({ engFirstName: val })}
              placeholder="First Name"
              dir="ltr"
            />
            <FormInput
              id="engLastName"
              label="שם משפחה באנגלית"
              value={personalInfo.engLastName}
              onChange={(val) => update({ engLastName: val })}
              placeholder="Last Name"
              dir="ltr"
            />
          </div>
        </SectionCard>

        {/* ── Birth Date & Gender ── */}
        <SectionCard
          title="תאריך לידה ומין"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-600 mb-1.5">
                תאריך לידה
              </label>
              <input
                id="birthDate"
                type="date"
                value={personalInfo.birthDate}
                onChange={(e) => update({ birthDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] hover:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">מין</label>
              <div className="flex gap-2">
                <label className="flex-1">
                  <input type="radio" name="gender" value={2} checked={personalInfo.gender === 2}
                    onChange={() => update({ gender: 2 })} className="sr-only" />
                  <div className={`py-3 rounded-full text-sm font-semibold text-center transition-all duration-200 cursor-pointer
                    ${personalInfo.gender === 2
                      ? "bg-guardian-primary text-white shadow-md scale-[1.02]"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#bca562] hover:bg-[#f6f3ea]"
                    }`}>
                    זכר
                  </div>
                </label>
                <label className="flex-1">
                  <input type="radio" name="gender" value={3} checked={personalInfo.gender === 3}
                    onChange={() => update({ gender: 3 })} className="sr-only" />
                  <div className={`py-3 rounded-full text-sm font-semibold text-center transition-all duration-200 cursor-pointer
                    ${personalInfo.gender === 3
                      ? "bg-guardian-primary text-white shadow-md scale-[1.02]"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#bca562] hover:bg-[#f6f3ea]"
                    }`}>
                    נקבה
                  </div>
                </label>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Contact Details ── */}
        <SectionCard
          title="פרטי קשר"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="phone"
              label="טלפון"
              value={personalInfo.phone}
              readOnly
              type="tel"
            />
            <FormInput
              id="email"
              label='דוא"ל'
              value={personalInfo.email}
              onChange={(val) => update({ email: val })}
              placeholder="email@example.com"
              type="email"
              dir="ltr"
            />
          </div>
        </SectionCard>

        {/* ── Address ── */}
        <SectionCard
          title="כתובת"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              id="street"
              label="רחוב"
              value={personalInfo.street}
              onChange={(val) => update({ street: val })}
              placeholder="שם הרחוב"
            />
            <FormInput
              id="streetNumber"
              label="מספר"
              value={personalInfo.streetNumber}
              onChange={(val) => update({ streetNumber: val })}
              placeholder="מספר בית"
            />
            <FormInput
              id="city"
              label="עיר"
              value={personalInfo.city}
              onChange={(val) => update({ city: val })}
              placeholder="שם העיר"
            />
            <FormInput
              id="zipCode"
              label="מיקוד"
              value={personalInfo.zipCode}
              onChange={(val) => update({ zipCode: val })}
              placeholder="מיקוד"
              inputMode="numeric"
            />
          </div>
        </SectionCard>

        {/* ── Profession ── */}
        <SectionCard
          title="מקצוע / עיסוק"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>}
        >
          <FormInput
            id="profession"
            label="תאר את עיסוקך"
            value={personalInfo.profession}
            onChange={(val) => update({ profession: val })}
            placeholder="תאר את עיסוקך"
          />
        </SectionCard>

        {/* ── Declarations ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="h-1 bg-gradient-to-l from-[#5784be] to-[#bca562]" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a2c43] to-[#253f60] flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#1a2c43]">הצהרות</h3>
            </div>

            <div className="space-y-2">
              <label
                onClick={() => setIsResidentOfIsrael(!isResidentOfIsrael)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all duration-200
                  ${isResidentOfIsrael ? "bg-[#f6f3ea]" : "hover:bg-gray-50"}`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                  ${isResidentOfIsrael
                    ? "bg-guardian-primary border-guardian-primary scale-110"
                    : "bg-white border-gray-300"
                  }`}>
                  {isResidentOfIsrael && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm leading-relaxed ${isResidentOfIsrael ? "text-[#1a2c43] font-medium" : "text-gray-700"}`}>
                  הנני מצהיר כי המועמדים לביטוח הם תושבי ישראל
                </span>
              </label>

              <label
                onClick={() => setIsCurrentlyInIsrael(!isCurrentlyInIsrael)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all duration-200
                  ${isCurrentlyInIsrael ? "bg-[#f6f3ea]" : "hover:bg-gray-50"}`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
                  ${isCurrentlyInIsrael
                    ? "bg-guardian-primary border-guardian-primary scale-110"
                    : "bg-white border-gray-300"
                  }`}>
                  {isCurrentlyInIsrael && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm leading-relaxed ${isCurrentlyInIsrael ? "text-[#1a2c43] font-medium" : "text-gray-700"}`}>
                  בעת רכישת הביטוח, המועמדים לביטוח נמצאים בישראל
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Navigation Buttons ── */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={nextStep}
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
