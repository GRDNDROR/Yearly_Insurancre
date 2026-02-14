"use client";

import { useState } from "react";

type FormData = {
  fullName: string;
  idNumber: string;
  birthDate: string;
  phone: string;
  email: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelPurpose: string;
  coverageType: string;
  preExistingConditions: string;
  additionalNotes: string;
};

const initialFormData: FormData = {
  fullName: "",
  idNumber: "",
  birthDate: "",
  phone: "",
  email: "",
  destination: "",
  departureDate: "",
  returnDate: "",
  travelPurpose: "עסקי",
  coverageType: "מורחב",
  preExistingConditions: "לא",
  additionalNotes: "",
};

const steps = [
  { id: "personal", title: "פרטים אישיים", icon: "👤" },
  { id: "trip", title: "פרטי הנסיעה", icon: "✈️" },
  { id: "coverage", title: "כיסוי ביטוחי", icon: "🛡️" },
  { id: "review", title: "סיכום ואישור", icon: "✅" },
];

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    // TODO: Send form data to API / email
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-700 mb-4">הטופס נשלח בהצלחה!</h2>
        <p className="text-gray-600 mb-8">
          הטופס הממולא נשלח להפקה. תקבלו אישור במייל בקרוב.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          חזרה לדף הבית
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">מילוי טופס ביטוח נסיעות</h2>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={`flex flex-col items-center flex-1 ${
                index <= currentStep ? "text-blue-700" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 ${
                  index <= currentStep
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  index < currentStep ? "bg-blue-700" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">👤 פרטים אישיים</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ישראל ישראלי"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תעודת זהות</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => updateField("idNumber", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">תאריך לידה</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="050-0000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">✈️ פרטי הנסיעה</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">יעד הנסיעה</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => updateField("destination", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="לדוגמה: לונדון, אנגליה"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך יציאה</label>
                <input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => updateField("departureDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך חזרה</label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => updateField("returnDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">מטרת הנסיעה</label>
              <select
                value={formData.travelPurpose}
                onChange={(e) => updateField("travelPurpose", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="עסקי">עסקי</option>
                <option value="כנס/ועידה">כנס / ועידה</option>
                <option value="הדרכה/קורס">הדרכה / קורס</option>
                <option value="פגישות עבודה">פגישות עבודה</option>
                <option value="אחר">אחר</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">🛡️ כיסוי ביטוחי</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סוג כיסוי</label>
              <select
                value={formData.coverageType}
                onChange={(e) => updateField("coverageType", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="בסיסי">בסיסי</option>
                <option value="מורחב">מורחב</option>
                <option value="פרימיום">פרימיום</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                מצב רפואי קיים / מחלות רקע
              </label>
              <select
                value={formData.preExistingConditions}
                onChange={(e) => updateField("preExistingConditions", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="לא">אין מחלות רקע</option>
                <option value="כן">יש מחלות רקע</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הערות נוספות (אופציונלי)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => updateField("additionalNotes", e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="פרטים נוספים שחשוב לציין..."
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">✅ סיכום הפרטים</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">שם מלא:</span>
                <span className="font-medium">{formData.fullName || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">ת.ז.:</span>
                <span className="font-medium">{formData.idNumber || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">טלפון:</span>
                <span className="font-medium">{formData.phone || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">אימייל:</span>
                <span className="font-medium">{formData.email || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">יעד:</span>
                <span className="font-medium">{formData.destination || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">תאריכים:</span>
                <span className="font-medium">
                  {formData.departureDate || "—"} → {formData.returnDate || "—"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">מטרה:</span>
                <span className="font-medium">{formData.travelPurpose}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">כיסוי:</span>
                <span className="font-medium">{formData.coverageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">מחלות רקע:</span>
                <span className="font-medium">
                  {formData.preExistingConditions === "כן" ? "כן" : "אין"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          → הקודם
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            הבא ←
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            📧 שלח טופס להפקה
          </button>
        )}
      </div>
    </div>
  );
}
