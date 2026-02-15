import { z } from "zod";

/**
 * Validation schemas for all form steps using Zod.
 * Provides type-safe validation with Hebrew error messages.
 */

// ── Helper validators ──

const israeliIdValidator = z.string().refine(
  (id) => {
    // Basic Israeli ID validation (9 digits)
    if (!/^\d{9}$/.test(id)) return false;

    // Luhn algorithm for ID validation
    const digits = id.split("").map(Number);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = digits[i] * ((i % 2) + 1);
      if (digit > 9) digit -= 9;
      sum += digit;
    }
    return sum % 10 === 0;
  },
  { message: "מספר תעודת זהות לא תקין" }
);

const phoneValidator = z
  .string()
  .regex(/^05\d{8}$/, "מספר טלפון חייב להתחיל ב-05 ולהכיל 10 סמלים");

const emailValidator = z
  .string()
  .email("כתובת דוא\"ל לא תקינה")
  .min(1, "שדה חובה");

const hebrewNameValidator = z
  .string()
  .min(2, "שם חייב להכיל לפחות 2 תווים")
  .regex(/^[\u0590-\u05FF\s'-]+$/, "יש להזין שם בעברית בלבד");

const englishNameValidator = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Please use English letters only");

const zipCodeValidator = z
  .string()
  .regex(/^\d{5,7}$/, "מיקוד חייב להכיל 5-7 ספרות");

// ── Step 1: Identification ──

export const identificationSchema = z.object({
  idNumber: israeliIdValidator,
  phone: phoneValidator,
  otpCode: z.string().regex(/^\d{4,6}$/, "קוד אימות לא תקין"),
});

export type IdentificationFormData = z.infer<typeof identificationSchema>;

// ── Step 2: Personal Info ──

export const personalInfoSchema = z.object({
  idNumber: israeliIdValidator,
  idType: z.number().min(1).max(6),
  firstName: hebrewNameValidator,
  lastName: hebrewNameValidator,
  engFirstName: englishNameValidator,
  engLastName: englishNameValidator,
  birthDate: z
    .string()
    .min(1, "שדה חובה")
    .refine(
      (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 120;
      },
      { message: "גיל חייב להיות בין 18 ל-120" }
    ),
  gender: z.number().min(2).max(3, "יש לבחור מין"),
  phone: phoneValidator,
  email: emailValidator,
  street: z.string().min(2, "שם רחוב חייב להכיל לפחות 2 תווים"),
  streetNumber: z.string().min(1, "שדה חובה"),
  city: z.string().min(2, "שם עיר חייב להכיל לפחות 2 תווים"),
  zipCode: zipCodeValidator,
  profession: z.string().min(2, "תיאור מקצוע חייב להכיל לפחות 2 תווים"),
  isResidentOfIsrael: z.boolean().refine((val) => val === true, {
    message: "יש לאשר שהמועמדים הם תושבי ישראל",
  }),
  isCurrentlyInIsrael: z.boolean().refine((val) => val === true, {
    message: "יש לאשר שהמועמדים נמצאים בישראל",
  }),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// ── Step 3: Health Declaration ──

export const healthDeclarationSchema = z
  .object({
    q1_medicalPurpose: z.boolean().nullable(),
    q2_regularMedication: z.boolean().nullable(),
    q2_1_painClinic: z.boolean(),
    q2_1_bloodTransfusion: z.boolean(),
    q2_1_dialysis: z.boolean(),
    q2_1_oncology: z.boolean(),
    q2_1_biological: z.boolean(),
    q2_1_kidneyDisease: z.boolean(),
    q2_1_nervousSystem: z.boolean(),
    q2_1_crohn: z.boolean(),
    q2_1_copd: z.boolean(),
    q2_1_cysticFibrosis: z.boolean(),
    q2_1_als: z.boolean(),
    q2_1_liverDisease: z.boolean(),
    q2_1_heartFailure: z.boolean(),
    q2_1_stroke: z.boolean(),
    q3_hospitalization: z.boolean().nullable(),
    q3_1_performedOver3Months: z.boolean().nullable(),
    q4_testReferral: z.boolean().nullable(),
    q4_testDetails: z.string(),
    q5_stroke: z.boolean(),
    q5_heartDisease: z.boolean(),
    q5_carotidStenosis: z.boolean(),
    medicalDocumentUrl: z.string(),
  })
  .refine(
    (data) => {
      // q1 must be answered
      return data.q1_medicalPurpose !== null;
    },
    { message: "יש לענות על כל השאלות", path: ["q1_medicalPurpose"] }
  )
  .refine(
    (data) => {
      // q2 must be answered
      return data.q2_regularMedication !== null;
    },
    { message: "יש לענות על כל השאלות", path: ["q2_regularMedication"] }
  )
  .refine(
    (data) => {
      // q3 must be answered
      return data.q3_hospitalization !== null;
    },
    { message: "יש לענות על כל השאלות", path: ["q3_hospitalization"] }
  )
  .refine(
    (data) => {
      // If q3 is true, q3_1 must be answered
      if (data.q3_hospitalization === true) {
        return data.q3_1_performedOver3Months !== null;
      }
      return true;
    },
    { message: "יש לענות על שאלת המשך", path: ["q3_1_performedOver3Months"] }
  )
  .refine(
    (data) => {
      // q4 must be answered
      return data.q4_testReferral !== null;
    },
    { message: "יש לענות על כל השאלות", path: ["q4_testReferral"] }
  );

export type HealthDeclarationFormData = z.infer<typeof healthDeclarationSchema>;

// ── Step 4: Insurance Plan ──

export const insurancePlanSchema = z
  .object({
    startDate: z.string().min(1, "יש לבחור תאריך התחלה"),
    endDate: z.string().min(1, "יש לבחור תאריך סיום"),
    baseMedical: z.boolean(),
    searchAndRescue: z.boolean(),
    thirdPartyLiability: z.boolean(),
    luggage: z.boolean(),
    tripCancellation: z.boolean(),
    preExistingCondition: z.boolean(),
    extremeSports: z.boolean(),
    winterSports: z.boolean(),
    laptopModel: z.string(),
    phoneModel: z.string(),
    rentalCarDeductible: z.boolean(),
  })
  .refine(
    (data) => {
      // End date must be after start date
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    { message: "תאריך סיום חייב להיות אחרי תאריך התחלה", path: ["endDate"] }
  )
  .refine(
    (data) => {
      // Start date must be in the future (or today)
      const start = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return start >= today;
    },
    { message: "תאריך התחלה לא יכול להיות בעבר", path: ["startDate"] }
  )
  .refine(
    (data) => {
      // Maximum trip duration: 365 days
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffDays = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 365;
    },
    { message: "משך הנסיעה לא יכול לעלות על 365 ימים", path: ["endDate"] }
  );

export type InsurancePlanFormData = z.infer<typeof insurancePlanSchema>;

// ── Step 5: Payment ──

export const paymentSchema = z
  .object({
    token: z.string().min(1, "שגיאה באימות כרטיס האשראי"),
    last4Digits: z.string().regex(/^\d{4}$/, "4 ספרות אחרונות לא תקינות"),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "חודש לא תקין"),
    expiryYear: z.string().regex(/^\d{2}$/, "שנה לא תקינה"),
    skippedByCustomer: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If not skipped, token must exist
      if (!data.skippedByCustomer) {
        return data.token.length > 0;
      }
      return true;
    },
    { message: "יש להזין פרטי תשלום", path: ["token"] }
  );

export type PaymentFormData = z.infer<typeof paymentSchema>;

// ── Step 6: Signature ──

export const signatureSchema = z.object({
  signatureDataUrl: z
    .string()
    .min(10, "יש לחתום על הטופס")
    .startsWith("data:image/", "חתימה לא תקינה"),
  signedAt: z.string().min(1, "שגיאה בתאריך חתימה"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "יש לאשר את התנאים וההגבלות",
  }),
  agreedToPrivacy: z.boolean().refine((val) => val === true, {
    message: "יש לאשר את מדיניות הפרטיות",
  }),
  agreedToMarketing: z.boolean().optional(),
});

export type SignatureFormData = z.infer<typeof signatureSchema>;

// ── Full Form Schema (for final submission) ──

export const fullFormSchema = z.object({
  personalInfo: personalInfoSchema,
  healthDeclaration: healthDeclarationSchema,
  insurancePlan: insurancePlanSchema,
  paymentInfo: paymentSchema,
  signature: signatureSchema,
  agentInfo: z.object({
    agentName: z.string().min(1),
    agentNumber: z.string(),
    agencyName: z.string().min(1),
  }),
  isResidentOfIsrael: z.boolean(),
  isCurrentlyInIsrael: z.boolean(),
  crmCustomerId: z.string(),
  submittedAt: z.string(),
});

export type FullFormData = z.infer<typeof fullFormSchema>;
