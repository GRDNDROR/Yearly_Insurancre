/**
 * RequiredFieldMarker - Visual indicator for required form fields
 *
 * Displays asterisk with screen reader text
 */

interface RequiredFieldMarkerProps {
  label?: string;
}

export function RequiredFieldMarker({ label = "שדה חובה" }: RequiredFieldMarkerProps) {
  return (
    <abbr
      title={label}
      className="text-red-500 no-underline ms-1 font-bold"
      aria-label={label}
    >
      *
    </abbr>
  );
}

/**
 * OptionalFieldBadge - Badge to indicate optional fields
 *
 * Useful when most fields are required
 */

export function OptionalFieldBadge() {
  return (
    <span className="text-xs text-gray-400 font-normal ms-2">
      (אופציונלי)
    </span>
  );
}
