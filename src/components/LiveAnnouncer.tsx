"use client";

import { createContext, useContext, useState, ReactNode } from "react";

/**
 * LiveAnnouncer - ARIA live region for screen reader announcements
 *
 * WCAG 2.1 Success Criterion 4.1.3 (Status Messages) - Level AA
 * Announces dynamic content changes to screen readers without moving focus.
 *
 * Usage:
 * ```tsx
 * const { announce } = useLiveAnnouncer();
 * announce("הטופס נשלח בהצלחה", "polite");
 * ```
 */

interface LiveAnnouncerContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const LiveAnnouncerContext = createContext<LiveAnnouncerContextType | null>(null);

export function LiveAnnouncerProvider({ children }: { children: ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      setAssertiveMessage(message);
      // Clear after announcement
      setTimeout(() => setAssertiveMessage(""), 100);
    } else {
      setPoliteMessage(message);
      setTimeout(() => setPoliteMessage(""), 100);
    }
  };

  return (
    <LiveAnnouncerContext.Provider value={{ announce }}>
      {children}

      {/* Screen reader only live regions */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>

      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </LiveAnnouncerContext.Provider>
  );
}

export function useLiveAnnouncer() {
  const context = useContext(LiveAnnouncerContext);
  if (!context) {
    throw new Error("useLiveAnnouncer must be used within LiveAnnouncerProvider");
  }
  return context;
}
