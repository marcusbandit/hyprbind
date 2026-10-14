/**
 * Compute a JavaScript KeyboardEvent code string from a display label.
 */
export function getKeyCodeForLabel(label: string): string {
  if (/^[a-z]$/i.test(label)) return `Key${label.toUpperCase()}`;
  if (/^[0-9]$/.test(label)) return `Digit${label}`;
  if (/^F[0-9]+$/.test(label)) return label;
  const SPECIAL: Record<string, string> = {
    Enter: "Enter",
    Tab: "Tab",
    Escape: "Escape",
    " ": "Space",
  };
  return SPECIAL[label] || label;
}

/**
 * Format raw modifier and key labels to user-friendly display strings.
 */
export function formatLabel(s: string): string {
  const lower = s.toLowerCase();
  switch (lower) {
    case "super":
      return "Super";
    case "control":
    case "ctrl":
      return "Ctrl";
    case "shift":
      return "Shift";
    case "alt":
      return "Alt";
    case "return":
      return "Enter";
    case "space":
      return "Space";
    case "mouse_up":
      return "Scroll Up";
    case "mouse_down":
      return "Scroll Down";
    default:
      return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
} 