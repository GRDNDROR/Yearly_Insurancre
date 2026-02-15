// Form step enum
export enum FormStep {
  IDENTIFICATION = 0,
  PERSONAL_INFO = 1,
  HEALTH_DECLARATION = 2,
  INSURANCE_PLAN = 3,
  PAYMENT = 4,
  SIGNATURE = 5,
  SUMMARY = 6,
}

// Personal info from Sureance CRM
export interface PersonalInfo {
  idNumber: string;
  idType: number; // 1=ת.ז., 2=דרכון, 3=רישיון נהיגה, 4=אחר, 5=ח.פ., 6=מ.צ.
  firstName: string;
  lastName: string;
  engFirstName: string;
  engLastName: string;
  birthDate: string;
  gender: number; // 1=לא מוגדר, 2=זכר, 3=נקבה
  phone: string;
  email: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  profession: string;
}

// Health declaration - matches Harel form questions
export interface HealthDeclaration {
  // Q1: Is travel purpose medical?
  q1_medicalPurpose: boolean | null;
  // Q2: Regular medications in last 6 months?
  q2_regularMedication: boolean | null;
  // Q2.1: Specific treatments (only if q2 = true)
  q2_1_painClinic: boolean;
  q2_1_bloodTransfusion: boolean;
  q2_1_dialysis: boolean;
  q2_1_oncology: boolean;
  q2_1_biological: boolean;
  // Q2.1 medical conditions
  q2_1_kidneyDisease: boolean;
  q2_1_nervousSystem: boolean;
  q2_1_crohn: boolean;
  q2_1_copd: boolean;
  q2_1_cysticFibrosis: boolean;
  q2_1_als: boolean;
  q2_1_liverDisease: boolean;
  q2_1_heartFailure: boolean;
  q2_1_stroke: boolean;
  // Q3: Hospitalization/surgery in last 6 months?
  q3_hospitalization: boolean | null;
  // Q3.1: Was it performed and 3+ months ago?
  q3_1_performedOver3Months: boolean | null;
  // Q4: Referral to tests in last 6 months?
  q4_testReferral: boolean | null;
  // Q4.1: Tests completed with normal results?
  q4_1_testsCompleted?: boolean | null;
  q4_testDetails: string;
  // Q5: Diagnosed in last 2 years?
  q5_stroke: boolean;
  q5_heartDisease: boolean;
  q5_carotidStenosis: boolean;
  // Q5.1: Was last event in the last 12 months?
  q5_1_lastEventRecent?: boolean | null;
  // Q6: Pregnant? (women only)
  q6_pregnant?: boolean | null;
  // Medical document attachment
  medicalDocumentUrl: string;
}

// Insurance plan selection
export interface InsurancePlan {
  // Policy dates
  startDate: string;
  endDate: string;
  // Base coverage (included)
  baseMedical: boolean;
  searchAndRescue: boolean;
  thirdPartyLiability: boolean;
  // Free extensions
  luggage: boolean;
  tripCancellation: boolean;
  preExistingCondition: boolean;
  extremeSports: boolean;
  winterSports: boolean;
  // Device details
  laptopModel: string;
  phoneModel: string;
  // Paid extensions
  rentalCarDeductible: boolean;
}

// Payment info
export interface PaymentInfo {
  token: string;
  last4Digits: string;
  expiryMonth: string;
  expiryYear: string;
  // Full card details (only when customer self-fills, sent to Harel via PDF only)
  cardNumber?: string;
  cvv?: string;
  numPayments?: number;
  cardHolderName?: string;
  cardHolderId?: string;
  // Flag when customer chooses agent-fills-later mode
  skippedByCustomer?: boolean;
}

// Signature
export interface SignatureData {
  signatureDataUrl: string; // base64 data URL from canvas
  signedAt: string; // ISO timestamp
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  agreedToMarketing: boolean;
}

// Agent info (auto-filled)
export interface AgentInfo {
  agentName: string;
  agentNumber: string;
  agencyName: string;
}

// Complete form data
export interface TravelInsuranceForm {
  personalInfo: PersonalInfo;
  healthDeclaration: HealthDeclaration;
  insurancePlan: InsurancePlan;
  paymentInfo: PaymentInfo;
  signature: SignatureData;
  agentInfo: AgentInfo;
  // Metadata
  isResidentOfIsrael: boolean;
  isCurrentlyInIsrael: boolean;
  crmCustomerId: string; // Sureance UUID
  submittedAt: string;
}

// Sureance API types
export interface SureanceCustomer {
  id: string;
  idNumber: string;
  idType: number;
  firstName: string;
  lastName: string;
  engFirstName: string;
  engLastName: string;
  phoneNumber1: string;
  phoneNumber2: string;
  email: string;
  email2: string;
  gender: number;
  birthDate: string;
  maritalStatus: number;
  profession: string;
  street: string;
  streetNumber: string;
  city: string;
  zipCode: string;
  backgroundDiseases: string;
}

export interface SureanceSearchRequest {
  startRow: number;
  endRow: number;
  filtersOperator: 'and' | 'or';
  filters: {
    field: string;
    value: string;
    operator: string;
  }[];
  sorts: {
    field: string;
    dir: 'asc' | 'desc';
  }[];
}

export interface SureanceSearchResponse {
  data: SureanceCustomer[];
  totalRows: number;
}
