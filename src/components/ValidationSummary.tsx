import { AlertCircle } from "lucide-react";
import { FieldErrors } from "react-hook-form";

/**
 * ValidationSummary - Shows validation errors before proceeding
 *
 * Displays list of errors when user tries to proceed with invalid form
 * WCAG 2.1 Success Criterion 3.3.1 (Error Identification) - Level A
 */

interface ValidationSummaryProps {
  errors: FieldErrors;
  title?: string;
}

export function ValidationSummary({
  errors,
  title = "יש לתקן את השגיאות הבאות:",
}: ValidationSummaryProps) {
  const errorList = Object.entries(errors);

  if (errorList.length === 0) {
    return null;
  }

  return (
    <div
      className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            {title}
          </h3>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            {errorList.map(([field, error]) => (
              <li key={field}>
                {error?.message as string}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
