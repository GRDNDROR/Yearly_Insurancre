"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: "app" | "form" | "step";
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch React errors and prevent app crashes.
 *
 * Usage:
 * - App level: Wraps entire application
 * - Form level: Wraps FormWizard
 * - Step level: Wraps individual form steps
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service (Sentry will be added in Sprint 1)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // TODO: Send to Sentry when monitoring is set up (Task #9)
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI based on level
      return (
        <div className="min-h-screen flex items-center justify-center bg-guardian-cream p-4" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-xl border-2 border-red-200 shadow-lg p-6 sm:p-8">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Error Title */}
            <h2 className="text-xl font-bold text-guardian-primary text-center mb-2">
              אופס! משהו השתבש
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
              {this.props.level === "app" && "אירעה שגיאה בטעינת האפליקציה. אנא נסה לרענן את הדף."}
              {this.props.level === "form" && "אירעה שגיאה בטעינת הטופס. אנא נסה שנית."}
              {this.props.level === "step" && "אירעה שגיאה בטעינת השלב הזה. אנא נסה שנית."}
              {!this.props.level && "אירעה שגיאה בלתי צפויה. אנא נסה שנית."}
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 p-3 bg-red-50 rounded-lg text-xs">
                <summary className="cursor-pointer font-medium text-red-700 mb-2">
                  פרטי שגיאה (למפתחים)
                </summary>
                <pre className="text-left text-red-600 overflow-x-auto whitespace-pre-wrap break-words" dir="ltr">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-l from-guardian-primary to-guardian-primary-light
                  text-white font-semibold hover:shadow-lg transition-all duration-200"
              >
                נסה שנית
              </button>

              {this.props.level === "app" && (
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full py-3 px-4 rounded-xl border-2 border-guardian-gold text-guardian-primary
                    font-semibold hover:bg-guardian-cream transition-all duration-200"
                >
                  חזור לדף הבית
                </button>
              )}

              {(this.props.level === "form" || this.props.level === "step") && (
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600
                    font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  רענן את הדף
                </button>
              )}
            </div>

            {/* Support Link */}
            <p className="text-xs text-gray-400 text-center mt-4">
              אם הבעיה חוזרת, אנא צור קשר עם התמיכה
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper for functional components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  level?: "app" | "form" | "step"
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary level={level}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
