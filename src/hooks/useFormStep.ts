import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/**
 * Custom hook for form step validation using react-hook-form + Zod
 *
 * Usage:
 * ```tsx
 * const { register, handleSubmit, errors } = useFormStep({
 *   schema: personalInfoSchema,
 *   defaultValues: personalInfo,
 *   onSubmit: (data) => {
 *     setPersonalInfo(data);
 *     nextStep();
 *   }
 * });
 * ```
 */

interface UseFormStepOptions<T extends z.ZodType<any, any>> {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => void;
}

export function useFormStep<T extends z.ZodType<any, any>>({
  schema,
  defaultValues,
  onSubmit,
}: UseFormStepOptions<T>): UseFormReturn<z.infer<T>> & {
  onFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
} {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
    reValidateMode: "onChange",
  });

  const onFormSubmit = form.handleSubmit(onSubmit);

  return {
    ...form,
    onFormSubmit,
  };
}
