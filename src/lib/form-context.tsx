"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  FormStep,
  PersonalInfo,
  HealthDeclaration,
  InsurancePlan,
  PaymentInfo,
  SignatureData,
  AgentInfo,
  TravelInsuranceForm,
} from "@/types/form";

// Default values
const defaultPersonalInfo: PersonalInfo = {
  idNumber: "",
  idType: 1,
  firstName: "",
  lastName: "",
  engFirstName: "",
  engLastName: "",
  birthDate: "",
  gender: 1,
  phone: "",
  email: "",
  street: "",
  streetNumber: "",
  city: "",
  zipCode: "",
  profession: "",
};

const defaultHealthDeclaration: HealthDeclaration = {
  q1_medicalPurpose: null,
  q2_regularMedication: null,
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
  q3_hospitalization: null,
  q3_1_performedOver3Months: null,
  q4_testReferral: null,
  q4_testDetails: "",
  q5_stroke: false,
  q5_heartDisease: false,
  q5_carotidStenosis: false,
  medicalDocumentUrl: "",
};

const defaultInsurancePlan: InsurancePlan = {
  startDate: "",
  endDate: "",
  baseMedical: true,
  searchAndRescue: true,
  thirdPartyLiability: true,
  luggage: true,
  tripCancellation: true,
  preExistingCondition: true,
  extremeSports: true,
  winterSports: true,
  laptopModel: "",
  phoneModel: "",
  rentalCarDeductible: false,
};

const defaultPaymentInfo: PaymentInfo = {
  token: "",
  last4Digits: "",
  expiryMonth: "",
  expiryYear: "",
};

const defaultSignatureData: SignatureData = {
  signatureDataUrl: "",
  signedAt: "",
  agreedToTerms: false,
  agreedToPrivacy: false,
  agreedToMarketing: false,
};

const defaultAgentInfo: AgentInfo = {
  agentName: "דרור אדרי",
  agentNumber: "",
  agencyName: "גארדיאן סוכנות לביטוח",
};

// Context type
interface FormContextType {
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => void;
  healthDeclaration: HealthDeclaration;
  setHealthDeclaration: (decl: HealthDeclaration) => void;
  insurancePlan: InsurancePlan;
  setInsurancePlan: (plan: InsurancePlan) => void;
  paymentInfo: PaymentInfo;
  setPaymentInfo: (info: PaymentInfo) => void;
  signatureData: SignatureData;
  setSignatureData: (sig: SignatureData) => void;
  agentInfo: AgentInfo;
  setAgentInfo: (info: AgentInfo) => void;
  isResidentOfIsrael: boolean;
  setIsResidentOfIsrael: (val: boolean) => void;
  isCurrentlyInIsrael: boolean;
  setIsCurrentlyInIsrael: (val: boolean) => void;
  crmCustomerId: string;
  setCrmCustomerId: (id: string) => void;
  isOtpVerified: boolean;
  setIsOtpVerified: (val: boolean) => void;
  isDataFromCrm: boolean;
  setIsDataFromCrm: (val: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  getFormData: () => TravelInsuranceForm;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.IDENTIFICATION);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [healthDeclaration, setHealthDeclaration] = useState<HealthDeclaration>(defaultHealthDeclaration);
  const [insurancePlan, setInsurancePlan] = useState<InsurancePlan>(defaultInsurancePlan);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(defaultPaymentInfo);
  const [signatureData, setSignatureData] = useState<SignatureData>(defaultSignatureData);
  const [agentInfo, setAgentInfo] = useState<AgentInfo>(defaultAgentInfo);
  const [isResidentOfIsrael, setIsResidentOfIsrael] = useState(true);
  const [isCurrentlyInIsrael, setIsCurrentlyInIsrael] = useState(true);
  const [crmCustomerId, setCrmCustomerId] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isDataFromCrm, setIsDataFromCrm] = useState(false);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, FormStep.SUMMARY));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, FormStep.IDENTIFICATION));
  };

  const getFormData = (): TravelInsuranceForm => ({
    personalInfo,
    healthDeclaration,
    insurancePlan,
    paymentInfo,
    signature: signatureData,
    agentInfo,
    isResidentOfIsrael,
    isCurrentlyInIsrael,
    crmCustomerId,
    submittedAt: new Date().toISOString(),
  });

  const resetForm = () => {
    setCurrentStep(FormStep.IDENTIFICATION);
    setPersonalInfo(defaultPersonalInfo);
    setHealthDeclaration(defaultHealthDeclaration);
    setInsurancePlan(defaultInsurancePlan);
    setPaymentInfo(defaultPaymentInfo);
    setSignatureData(defaultSignatureData);
    setIsOtpVerified(false);
    setIsDataFromCrm(false);
    setCrmCustomerId("");
  };

  return (
    <FormContext.Provider
      value={{
        currentStep, setCurrentStep,
        personalInfo, setPersonalInfo,
        healthDeclaration, setHealthDeclaration,
        insurancePlan, setInsurancePlan,
        paymentInfo, setPaymentInfo,
        signatureData, setSignatureData,
        agentInfo, setAgentInfo,
        isResidentOfIsrael, setIsResidentOfIsrael,
        isCurrentlyInIsrael, setIsCurrentlyInIsrael,
        crmCustomerId, setCrmCustomerId,
        isOtpVerified, setIsOtpVerified,
        isDataFromCrm, setIsDataFromCrm,
        nextStep, prevStep,
        getFormData, resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
