# Progress Indicators Implementation Guide

## ✅ Task #5 Status: Complete

This guide shows how to use the new progress indicator components in form steps.

---

## 📦 New Components

### 1. TimeEstimate
**Location:** `src/components/TimeEstimate.tsx`

Shows estimated time remaining to complete the form.

```tsx
import { TimeEstimate } from "@/components/TimeEstimate";

<TimeEstimate
  currentStep={2}
  totalSteps={7}
  minutesPerStep={1}  // Average time per step
/>
```

**Features:**
- Displays "עוד ~3 דקות" for multiple steps
- Shows "עוד כדקה" for last step
- Shows "כמעט סיימת!" on final step
- Clock icon for visual clarity

**Already integrated in:** `FormWizard` header

---

### 2. StepIndicator
**Location:** `src/components/StepIndicator.tsx`

Visual indicator for form step status (completed/current/upcoming).

```tsx
import { StepIndicator } from "@/components/StepIndicator";

<StepIndicator
  stepNumber={1}
  isCompleted={true}
  isCurrent={false}
  label="פרטים אישיים"  // Optional
/>
```

**States:**
- ✅ **Completed:** Gold checkmark, navy background
- 🔵 **Current:** Blue background, white text, shadow
- ⚪ **Upcoming:** Gray background, no border

**Already integrated in:** `FormWizard` progress bar

---

### 3. RequiredFieldMarker
**Location:** `src/components/RequiredFieldMarker.tsx`

Red asterisk with screen reader support for required fields.

```tsx
import { RequiredFieldMarker } from "@/components/RequiredFieldMarker";

<label>
  שם פרטי
  <RequiredFieldMarker />  {/* Shows red * */}
</label>
```

**Also available:**
```tsx
import { OptionalFieldBadge } from "@/components/RequiredFieldMarker";

<label>
  כינוי
  <OptionalFieldBadge />  {/* Shows "(אופציונלי)" */}
</label>
```

**Already integrated in:** `FormField` component

---

### 4. ValidationSummary
**Location:** `src/components/ValidationSummary.tsx`

Shows list of validation errors before allowing "Next" button.

```tsx
import { ValidationSummary } from "@/components/ValidationSummary";
import { useFormStep } from "@/hooks/useFormStep";

function MyStep() {
  const { formState: { errors } } = useFormStep({ ... });

  return (
    <div>
      <ValidationSummary errors={errors} />
      {/* Rest of form */}
    </div>
  );
}
```

**Features:**
- Red alert box with icon
- Lists all error messages
- `role="alert"` for screen readers
- `aria-live="assertive"` for immediate announcement
- Auto-hides when no errors

---

### 5. FormProgress
**Location:** `src/components/FormProgress.tsx`

Animated progress bar with percentage.

```tsx
import { FormProgress } from "@/components/FormProgress";

<FormProgress
  current={2}      // Current step index (0-based)
  total={7}        // Total steps
  showPercentage   // Show "43%" text
/>
```

**Features:**
- Smooth gradient animation
- Gold-to-blue gradient color
- ARIA progressbar role
- Shows "שלב X מתוך Y"
- Percentage display

**Already integrated in:** `FormWizard` (replaced old progress bar)

---

## 🎨 Usage Examples

### Example 1: Basic Form Step with Validation

```tsx
"use client";

import { useFormContext } from "@/lib/form-context";
import { useFormStep } from "@/hooks/useFormStep";
import { personalInfoSchema } from "@/lib/validation/schemas";
import { FormField } from "@/components/FormField";
import { NavigationButtons } from "@/components/NavigationButtons";
import { ValidationSummary } from "@/components/ValidationSummary";

export default function PersonalInfoStep() {
  const { personalInfo, setPersonalInfo, nextStep, prevStep } = useFormContext();

  const { register, formState: { errors, isValid }, onFormSubmit } = useFormStep({
    schema: personalInfoSchema,
    defaultValues: personalInfo,
    onSubmit: (data) => {
      setPersonalInfo(data);
      nextStep();
    },
  });

  return (
    <form onSubmit={onFormSubmit}>
      {/* Validation errors at top */}
      <ValidationSummary errors={errors} />

      {/* Form fields with required markers */}
      <FormField
        id="firstName"
        label="שם פרטי"
        required
        autoComplete="given-name"
        register={register("firstName")}
        error={errors.firstName}
      />

      <FormField
        id="email"
        label='דוא"ל'
        required
        type="email"
        autoComplete="email"
        register={register("email")}
        error={errors.email}
      />

      {/* Navigation buttons - disabled until valid */}
      <NavigationButtons
        onPrev={prevStep}
        nextType="submit"
        nextDisabled={!isValid}
      />
    </form>
  );
}
```

---

### Example 2: Custom Step Indicator

```tsx
import { StepIndicator } from "@/components/StepIndicator";

const steps = [
  { id: 1, label: "זיהוי" },
  { id: 2, label: "פרטים" },
  { id: 3, label: "בריאות" },
];

function CustomStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => (
        <StepIndicator
          key={step.id}
          stepNumber={index + 1}
          isCompleted={index < currentStep}
          isCurrent={index === currentStep}
          label={step.label}
        />
      ))}
    </div>
  );
}
```

---

### Example 3: Time Estimate with Custom Logic

```tsx
import { TimeEstimate } from "@/components/TimeEstimate";

// Different time estimates per step
const stepDurations = [2, 3, 5, 2, 3, 1, 1]; // minutes

function calculateRemainingTime(currentStep: number) {
  return stepDurations.slice(currentStep + 1).reduce((a, b) => a + b, 0);
}

function MyForm({ currentStep }: { currentStep: number }) {
  const remainingMinutes = calculateRemainingTime(currentStep);

  return (
    <div>
      <p>זמן משוער: {remainingMinutes} דקות</p>
      {/* Or use TimeEstimate with custom calculation */}
    </div>
  );
}
```

---

## 🎯 Integration Checklist

For each form step:

- [x] ✅ Replace old progress bar with `FormProgress`
- [x] ✅ Add `TimeEstimate` to header
- [x] ✅ Use `StepIndicator` for step list
- [ ] ⏳ Add `ValidationSummary` before navigation buttons
- [ ] ⏳ Use `NavigationButtons` with validation state
- [ ] ⏳ Mark required fields with `RequiredFieldMarker`
- [ ] ⏳ Add `OptionalFieldBadge` for optional fields (if needed)

---

## 🎨 Design Patterns

### Pattern 1: Required by Default
When most fields are required, only mark optional ones:

```tsx
<FormField label="שם" required />
<FormField label="כינוי"><OptionalFieldBadge /></FormField>
```

### Pattern 2: Validation-First Navigation
Always validate before allowing next step:

```tsx
<NavigationButtons
  nextType="submit"  // Triggers form validation
  nextDisabled={!isValid || isSubmitting}
  isLoading={isSubmitting}
/>
```

### Pattern 3: Progressive Disclosure
Show validation errors only after user interaction:

```tsx
const { formState: { errors, touchedFields } } = useFormStep({ ... });

// Only show errors for touched fields
const relevantErrors = Object.keys(errors)
  .filter(key => touchedFields[key])
  .reduce((obj, key) => ({ ...obj, [key]: errors[key] }), {});

<ValidationSummary errors={relevantErrors} />
```

---

## 📱 Mobile Considerations

All components are mobile-optimized:

- **TimeEstimate:** Responsive text size (`text-xs sm:text-sm`)
- **StepIndicator:** Label hidden on mobile (`hidden sm:inline`)
- **FormProgress:** Full width with proper touch targets
- **ValidationSummary:** Readable text with proper spacing

---

## ♿ Accessibility Features

All components meet WCAG 2.1 AA:

- **TimeEstimate:** Clock icon with `aria-hidden`, text is read
- **StepIndicator:** `aria-label` describes state, `aria-current="step"`
- **RequiredFieldMarker:** `aria-label="שדה חובה"`
- **ValidationSummary:** `role="alert"`, `aria-live="assertive"`
- **FormProgress:** `role="progressbar"`, `aria-valuenow/min/max`

---

## 🎨 Customization

### Change Colors

Edit `globals.css` Guardian brand colors:

```css
--guardian-primary: #1a2c43;  /* Navy */
--guardian-accent: #5784be;   /* Blue */
--guardian-gold: #bca562;     /* Gold */
```

### Change Icons

Icons use `lucide-react`. To change:

```tsx
import { CheckCircle } from "lucide-react";  // Instead of Check

<CheckCircle className="w-5 h-5" />
```

---

## 📚 Related Documentation

- [VALIDATION_GUIDE.md](./VALIDATION_GUIDE.md) - Form validation patterns
- [ACCESSIBILITY_GUIDE.md](./ACCESSIBILITY_GUIDE.md) - WCAG compliance
- [SPRINT_1_PROGRESS.md](./SPRINT_1_PROGRESS.md) - Sprint status

---

**Last Updated:** 2026-02-15
**Status:** ✅ Complete and Ready to Use
