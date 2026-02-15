import { Clock } from "lucide-react";

/**
 * TimeEstimate - Shows estimated time to complete form
 *
 * Provides visual feedback to users about form length
 */

interface TimeEstimateProps {
  currentStep: number;
  totalSteps: number;
  minutesPerStep?: number;
}

export function TimeEstimate({
  currentStep,
  totalSteps,
  minutesPerStep = 1,
}: TimeEstimateProps) {
  const remainingSteps = totalSteps - currentStep - 1;
  const estimatedMinutes = Math.max(1, remainingSteps * minutesPerStep);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-guardian-cream border border-guardian-gold-light">
      <Clock className="w-4 h-4 text-guardian-accent" aria-hidden="true" />
      <span className="text-xs sm:text-sm text-guardian-primary font-medium">
        {currentStep === totalSteps - 1 ? (
          "כמעט סיימת!"
        ) : estimatedMinutes === 1 ? (
          "עוד כדקה"
        ) : (
          `עוד ~${estimatedMinutes} דקות`
        )}
      </span>
    </div>
  );
}
