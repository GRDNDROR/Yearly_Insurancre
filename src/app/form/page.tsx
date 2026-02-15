"use client";

import { useEffect, useRef } from "react";
import { FormProvider, useFormContext } from "@/lib/form-context";
import { FormStep } from "@/types/form";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useLiveAnnouncer } from "@/components/LiveAnnouncer";
import { TimeEstimate } from "@/components/TimeEstimate";
import { StepIndicator } from "@/components/StepIndicator";
import IdentificationStep from "@/components/steps/IdentificationStep";
import PersonalInfoStep from "@/components/steps/PersonalInfoStep";
import HealthDeclarationStep from "@/components/steps/HealthDeclarationStep";
import InsurancePlanStep from "@/components/steps/InsurancePlanStep";
import PaymentStep from "@/components/steps/PaymentStep";
import SignatureStep from "@/components/steps/SignatureStep";
import SummaryStep from "@/components/steps/SummaryStep";

const steps = [
  { id: FormStep.IDENTIFICATION, label: "זיהוי" },
  { id: FormStep.PERSONAL_INFO, label: "פרטים" },
  { id: FormStep.HEALTH_DECLARATION, label: "בריאות" },
  { id: FormStep.INSURANCE_PLAN, label: "ביטוח" },
  { id: FormStep.PAYMENT, label: "תשלום" },
  { id: FormStep.SIGNATURE, label: "חתימה" },
  { id: FormStep.SUMMARY, label: "סיכום" },
];

function FormWizard() {
  const { currentStep } = useFormContext();
  const { announce } = useLiveAnnouncer();
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const progress = ((currentStep) / (steps.length - 1)) * 100;

  // Focus management: Move focus to step container when step changes
  useEffect(() => {
    if (stepContainerRef.current) {
      stepContainerRef.current.focus();
      // Announce step change to screen readers
      const stepLabel = steps[currentStep]?.label || "";
      announce(`שלב ${currentStep + 1} מתוך ${steps.length}: ${stepLabel}`, "polite");
    }
  }, [currentStep, announce]);

  return (
    <div className="min-h-[calc(100vh-120px)]">
      {/* Top bar: title + progress */}
      <div className="bg-white border-b border-guardian-cream-dark sticky top-[49px] sm:top-[53px] z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Title + Time Estimate */}
          <div className="flex items-center justify-between mb-3 gap-3">
            <h2 className="text-sm sm:text-base font-semibold text-guardian-primary">
              טופס ביטוח נסיעות - הראל פירסט קלאס
            </h2>
            <TimeEstimate
              currentStep={currentStep}
              totalSteps={steps.length}
              minutesPerStep={1}
            />
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-guardian-cream-dark rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-guardian-gold rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step indicators - scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <StepIndicator
                  stepNumber={index + 1}
                  isCompleted={index < currentStep}
                  isCurrent={index === currentStep}
                  label={step.label}
                />
                {index < steps.length - 1 && (
                  <div
                    className={`w-6 sm:w-8 h-0.5 transition-colors duration-300 ${
                      index < currentStep ? "bg-guardian-gold" : "bg-guardian-cream-dark"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content - centered, padded, responsive */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div
          ref={stepContainerRef}
          tabIndex={-1}
          className="max-w-2xl mx-auto focus:outline-none"
          aria-live="polite"
          aria-atomic="false"
        >
          <ErrorBoundary level="step">
            {currentStep === FormStep.IDENTIFICATION && <IdentificationStep />}
            {currentStep === FormStep.PERSONAL_INFO && <PersonalInfoStep />}
            {currentStep === FormStep.HEALTH_DECLARATION && <HealthDeclarationStep />}
            {currentStep === FormStep.INSURANCE_PLAN && <InsurancePlanStep />}
            {currentStep === FormStep.PAYMENT && <PaymentStep />}
            {currentStep === FormStep.SIGNATURE && <SignatureStep />}
            {currentStep === FormStep.SUMMARY && <SummaryStep />}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default function FormPage() {
  return (
    <ErrorBoundary level="form">
      <FormProvider>
        <FormWizard />
      </FormProvider>
    </ErrorBoundary>
  );
}
