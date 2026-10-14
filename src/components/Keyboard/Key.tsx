import { ReactNode } from "react";

type KeyProps = {
  label: string;
  code?: string;
  onClick: (label: string) => void;
  className?: string;
  active?: boolean;
};

/**
 * Renders an individual key button with proper label and active state.
 */
export default function Key({
  label,
  onClick,
  className = "",
  active = false,
}: KeyProps) {
  // Numpad keys
  const isNumpad = label.startsWith("Numpad ");
  let displayLabel: ReactNode = label;

  if (isNumpad) {
    const numpadValue = label.replace("Numpad ", "");
    displayLabel = numpadValue;
  } else if (label.startsWith("Left ")) {
    displayLabel = label.replace("Left ", "");
  } else if (label.startsWith("Right ")) {
    displayLabel = label.replace("Right ", "");
  } else if (label === "Backspace") {
    displayLabel = "Bksp";
  } else if (label === "CapsLock") {
    displayLabel = "Caps";
  } else if (label === "NumLock") {
    displayLabel = (
      <>
        Num
        <br />
        Lock
      </>
    );
  } else if (label === "PrtScn") {
    displayLabel = (
      <>
        Prt
        <br />
        Scn
      </>
    );
  } else if (label === "ScrlLock") {
    displayLabel = (
      <>
        Scrl
        <br />
        Lock
      </>
    );
  }

  const aspect = "key-1x1";

  return (
    <button
      className={`key ${aspect} ${className} ${active ? "key--active" : ""}`.trim()}
      onClick={() => onClick(label)}
    >
      {displayLabel}
    </button>
  );
} 