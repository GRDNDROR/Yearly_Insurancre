/**
 * NavigationButtons - Accessible form navigation buttons
 *
 * Features:
 * - Disabled states with proper ARIA attributes
 * - Keyboard navigation support
 * - Screen reader friendly labels
 * - Loading states
 */

interface NavigationButtonsProps {
  onNext?: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  isLoading?: boolean;
  showPrev?: boolean;
  showNext?: boolean;
  nextType?: "button" | "submit";
}

export function NavigationButtons({
  onNext,
  onPrev,
  nextLabel = "הבא",
  prevLabel = "הקודם",
  nextDisabled = false,
  prevDisabled = false,
  isLoading = false,
  showPrev = true,
  showNext = true,
  nextType = "button",
}: NavigationButtonsProps) {
  return (
    <div className="flex gap-3 pt-6">
      {/* Next Button */}
      {showNext && (
        <button
          type={nextType}
          onClick={nextType === "button" ? onNext : undefined}
          disabled={nextDisabled || isLoading}
          aria-disabled={nextDisabled || isLoading}
          aria-busy={isLoading}
          className="flex-1 py-4 rounded-xl text-white font-semibold text-base transition-all duration-200
            bg-gradient-to-l from-[#1a2c43] to-[#253f60]
            hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100
            focus:outline-none focus:ring-2 focus:ring-guardian-gold focus:ring-offset-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>טוען...</span>
            </span>
          ) : (
            nextLabel
          )}
        </button>
      )}

      {/* Previous Button */}
      {showPrev && (
        <button
          type="button"
          onClick={onPrev}
          disabled={prevDisabled || isLoading}
          aria-disabled={prevDisabled || isLoading}
          className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-base
            hover:border-[#bca562] hover:bg-[#f6f3ea] active:scale-[0.98] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent
            focus:outline-none focus:ring-2 focus:ring-guardian-gold focus:ring-offset-2"
        >
          {prevLabel}
        </button>
      )}
    </div>
  );
}
