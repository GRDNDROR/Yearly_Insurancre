/**
 * FormProgress - Visual progress indicator for multi-step forms
 *
 * Shows percentage completion with smooth animation
 */

interface FormProgressProps {
  current: number;
  total: number;
  showPercentage?: boolean;
}

export function FormProgress({
  current,
  total,
  showPercentage = true,
}: FormProgressProps) {
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="w-full h-2 bg-guardian-cream-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-guardian-accent to-guardian-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`התקדמות הטופס: ${percentage}%`}
        />
      </div>

      {/* Percentage text (optional) */}
      {showPercentage && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            שלב {current + 1} מתוך {total}
          </span>
          <span className="text-xs font-semibold text-guardian-accent">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}
