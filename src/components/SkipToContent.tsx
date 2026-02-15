/**
 * SkipToContent - Skip navigation link for screen readers
 *
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks) - Level A
 * Allows keyboard users to skip repetitive navigation and jump directly to main content.
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-[100]
        focus:bg-guardian-primary focus:text-guardian-cream focus:px-6 focus:py-3 focus:rounded-xl
        focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-guardian-gold focus:ring-offset-2
        font-semibold text-base transition-all"
    >
      דלג לתוכן הראשי
    </a>
  );
}
