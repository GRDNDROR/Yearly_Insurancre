# Form Validation Implementation Guide

## ✅ Task #2 Status: Infrastructure Complete

הוספנו:
- ✅ `react-hook-form` + `@hookform/resolvers` + `zod`
- ✅ Zod schemas לכל 6 שלבי הטופס (`src/lib/validation/schemas.ts`)
- ✅ Custom hook `useFormStep` לניהול validation (`src/hooks/useFormStep.ts`)
- ✅ `FormField` component עם תמיכה בשגיאות (`src/components/FormField.tsx`)

## 📝 איך להטמיע ב-Step קיים

### Before (PersonalInfoStep ישן)

```tsx
const { personalInfo, setPersonalInfo, nextStep } = useFormContext();

const update = (partial: Partial<PersonalInfo>) => {
  setPersonalInfo({ ...personalInfo, ...partial });
};

return (
  <div>
    <FormInput
      id="firstName"
      label="שם פרטי"
      value={personalInfo.firstName}
      onChange={(val) => update({ firstName: val })}
    />
    <button onClick={nextStep}>הבא</button>
  </div>
);
```

### After (עם Validation)

```tsx
import { useFormStep } from "@/hooks/useFormStep";
import { personalInfoSchema } from "@/lib/validation/schemas";
import { FormField } from "@/components/FormField";

export default function PersonalInfoStep() {
  const { personalInfo, setPersonalInfo, nextStep } = useFormContext();

  const { register, formState: { errors }, onFormSubmit } = useFormStep({
    schema: personalInfoSchema,
    defaultValues: personalInfo,
    onSubmit: (validatedData) => {
      setPersonalInfo(validatedData);
      nextStep();
    },
  });

  return (
    <form onSubmit={onFormSubmit}>
      <FormField
        id="firstName"
        label="שם פרטי"
        required
        register={register("firstName")}
        error={errors.firstName}
      />
      <button type="submit">הבא</button>
    </form>
  );
}
```

## 🎯 המרה של כל ה-Steps

### Steps שצריך להמיר:
1. ✅ IdentificationStep → `identificationSchema`
2. ⏳ PersonalInfoStep → `personalInfoSchema`
3. ⏳ HealthDeclarationStep → `healthDeclarationSchema`
4. ⏳ InsurancePlanStep → `insurancePlanSchema`
5. ⏳ PaymentStep → `paymentSchema`
6. ⏳ SignatureStep → `signatureSchema`

### Checklist לכל Step:
- [ ] Import `useFormStep` + schema מתאים
- [ ] Replace state management עם `useFormStep`
- [ ] Replace `FormInput` עם `FormField`
- [ ] Add `required` prop לשדות חובה
- [ ] Wrap content ב-`<form onSubmit={onFormSubmit}>`
- [ ] Change button `onClick` ל-`type="submit"`
- [ ] Test validation במילוי לא תקין

## 🔧 Custom Validation Rules

אם צריך ולידציה מותאמת אישית, הוסף ל-`schemas.ts`:

```tsx
export const customSchema = z.object({
  field: z.string().refine(
    (val) => /* custom logic */,
    { message: "הודעת שגיאה בעברית" }
  ),
});
```

## ⚠️ נקודות חשובות

1. **Hebrew Error Messages**: כל הודעות השגיאה בעברית
2. **RTL Support**: `FormField` תומך ב-RTL מלא
3. **Accessibility**: שגיאות מוכרזות עם `role="alert"` ו-`aria-invalid`
4. **Validation Mode**: `onBlur` - מציג שגיאות רק אחרי blur (UX טוב יותר)
5. **Required Fields**: סומן ב-`*` אדום

## 🚀 Next Steps (Squad B)

- [ ] המיר את PersonalInfoStep (דוגמה מלאה)
- [ ] המיר את שאר ה-Steps
- [ ] בדוק שכל ה-validations עובדים
- [ ] הוסף tests ל-validation logic
