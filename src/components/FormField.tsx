import { UseFormRegister, FieldError } from "react-hook-form";
import { RequiredFieldMarker } from "./RequiredFieldMarker";

/**
 * Reusable form field component with validation support
 */

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  inputMode?: "numeric" | "tel" | "email";
  autoComplete?: string;
  register?: ReturnType<UseFormRegister<any>>;
  error?: FieldError;
  description?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  dir,
  placeholder,
  readOnly = false,
  required = false,
  inputMode,
  autoComplete,
  register,
  error,
  description,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1.5">
        {label}
        {required && <RequiredFieldMarker />}
      </label>

      {description && (
        <p id={`${id}-desc`} className="text-xs text-gray-500 mb-2">
          {description}
        </p>
      )}

      <input
        id={id}
        type={type}
        dir={dir}
        inputMode={inputMode}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete={autoComplete}
        {...register}
        aria-invalid={error ? "true" : "false"}
        aria-required={required ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : description ? `${id}-desc` : undefined}
        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
          ${dir === "ltr" ? "text-start" : "text-end"}
          ${
            readOnly
              ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
              : error
              ? "bg-white border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
              : "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5784be]/20 focus:border-[#5784be] hover:border-gray-300"
          }`}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
}
