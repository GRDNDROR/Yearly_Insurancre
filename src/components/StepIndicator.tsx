import { Check } from "lucide-react";

/**
 * StepIndicator - Visual indicator for form step completion status
 *
 * Shows completed, current, or upcoming step state
 */

interface StepIndicatorProps {
  stepNumber: number;
  isCompleted: boolean;
  isCurrent: boolean;
  label?: string;
}

export function StepIndicator({
  stepNumber,
  isCompleted,
  isCurrent,
  label,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Circle indicator */}
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
          transition-all duration-300
          ${
            isCompleted
              ? "bg-guardian-primary text-guardian-gold border-2 border-guardian-gold scale-105"
              : isCurrent
              ? "bg-guardian-accent text-white border-2 border-guardian-accent shadow-md"
              : "bg-guardian-cream-dark text-gray-400 border-2 border-transparent"
          }
        `}
        aria-label={
          isCompleted
            ? `שלב ${stepNumber} הושלם`
            : isCurrent
            ? `שלב ${stepNumber} נוכחי`
            : `שלב ${stepNumber}`
        }
        aria-current={isCurrent ? "step" : undefined}
      >
        {isCompleted ? (
          <Check className="w-5 h-5" aria-hidden="true" />
        ) : (
          stepNumber
        )}
      </div>

      {/* Label (optional) */}
      {label && (
        <span
          className={`
            text-sm font-medium transition-colors hidden sm:inline
            ${
              isCurrent
                ? "text-guardian-primary"
                : isCompleted
                ? "text-guardian-accent"
                : "text-gray-400"
            }
          `}
        >
          {label}
        </span>
      )}
    </div>
  );
}
