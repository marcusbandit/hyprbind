import React from "react";
import "./Keyboard.css";
import Key from "./Key";
import { LayoutData } from "../../hooks/useLayout";

interface KeyboardProps {
  onKeyPress: (label: string) => void;
  layout: LayoutData;
  pressedKeys: Set<string>;
}

/**
 * Renders the full keyboard (main keys, navigation cluster, and numpad).
 */
const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, layout, pressedKeys }) => {
  const KEYBOARD_LAYOUT = layout.keyboard;
  const NAV_LAYOUT = layout.nav;
  const NUMPAD_LAYOUT = layout.numpad;

  return (
    <div className="keyboard-container">
      <div className="main-keyboard-container">
        {/* F-keys row */}
        <div className="key-group-row">
          {KEYBOARD_LAYOUT[0].map((key, j) => (
            <Key
              key={key.label + "f" + j}
              label={key.label}
              code={key.code}
              className={key.class || ""}
              onClick={onKeyPress}
              active={typeof key.code === "string" && pressedKeys.has(key.code)}
            />
          ))}
        </div>
        {/* Number row */}
        <div className="key-group-row">
          {KEYBOARD_LAYOUT[1].map((key, j) => (
            <Key
              key={key.label + "n" + j}
              label={key.label}
              code={key.code}
              className={key.class || ""}
              onClick={onKeyPress}
              active={typeof key.code === "string" && pressedKeys.has(key.code)}
            />
          ))}
        </div>
        {/* QWERTY and Home row grouped together, Enter separated */}
        <div className="key-group-wrap" style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="key-group-row">
              {/* Tab row, without Enter */}
              {KEYBOARD_LAYOUT[2].slice(0, -1).map((key, j) => (
                <Key
                  key={key.label + "tab" + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || ""}
                  onClick={onKeyPress}
                  active={typeof key.code === "string" && pressedKeys.has(key.code)}
                />
              ))}
            </div>
            <div className="key-group-row">
              {/* Home row */}
              {KEYBOARD_LAYOUT[3].map((key, j) => (
                <Key
                  key={key.label + "home" + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || ""}
                  onClick={onKeyPress}
                  active={typeof key.code === "string" && pressedKeys.has(key.code)}
                />
              ))}
            </div>
          </div>
          {/* Enter key to the right of the wrap */}
          <div className="key-group-col" style={{ justifyContent: "flex-end" }}>
            <Key
              key={KEYBOARD_LAYOUT[2][KEYBOARD_LAYOUT[2].length - 1].label + "enter"}
              label={KEYBOARD_LAYOUT[2][KEYBOARD_LAYOUT[2].length - 1].label}
              code={KEYBOARD_LAYOUT[2][KEYBOARD_LAYOUT[2].length - 1].code}
              className={KEYBOARD_LAYOUT[2][KEYBOARD_LAYOUT[2].length - 1].class || ""}
              onClick={onKeyPress}
              active={
                typeof KEYBOARD_LAYOUT[2][KEYBOARD_LAYOUT[2].length - 1].code === "string" &&
                pressedKeys.has(KEYBOARD_LAYOUT[2][KEYBOARD_LAYOUT[2].length - 1].code!)
              }
            />
          </div>
        </div>
        {/* Bottom row */}
        <div className="key-group-row">
          {KEYBOARD_LAYOUT[4].map((key, j) => (
            <Key
              key={key.label + "b" + j}
              label={key.label}
              code={key.code}
              className={key.class || ""}
              onClick={onKeyPress}
              active={typeof key.code === "string" && pressedKeys.has(key.code)}
            />
          ))}
        </div>
        {/* Mod row */}
        <div className="key-group-row">
          {KEYBOARD_LAYOUT[5].map((key, j) => (
            <Key
              key={key.label + "m" + j}
              label={key.label}
              code={key.code}
              className={key.class || ""}
              onClick={onKeyPress}
              active={typeof key.code === "string" && pressedKeys.has(key.code)}
            />
          ))}
        </div>
      </div>
      <div className="nav-section-container">
        {NAV_LAYOUT.map((row, i) => (
          <div className="key-group-row" key={i}>
            {row.map((key, j) =>
              key.label === "" ? (
                <div key={"blank-nav-" + i + j} className={key.class || "key-blank"} />
              ) : (
                <Key
                  key={key.label + "nav" + i + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || ""}
                  onClick={onKeyPress}
                  active={typeof key.code === "string" && pressedKeys.has(key.code)}
                />
              )
            )}
          </div>
        ))}
      </div>
      <div className="numpad-keyboard-container">
        {/* Render the empty row on top */}
        <div className="key-group-row">
          {NUMPAD_LAYOUT[0].map((key, j) => (
            <Key
              key={key.label + "nempty" + j}
              label={key.label}
              code={key.code}
              className={key.class || ""}
              onClick={onKeyPress}
              active={typeof key.code === "string" && pressedKeys.has(key.code)}
            />
          ))}
        </div>
        {/* Render the NumLock row */}
        <div className="key-group-row">
          {NUMPAD_LAYOUT[1].map((key, j) => (
            <Key
              key={key.label + "nnumlock" + j}
              label={key.label}
              code={key.code}
              className={key.class || ""}
              onClick={onKeyPress}
              active={typeof key.code === "string" && pressedKeys.has(key.code)}
            />
          ))}
        </div>
        {/* Numpad wrap for 7/8/9 and 4/5/6 with + key 2 tall */}
        <div className="key-group-wrap" style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="key-group-row">
              {NUMPAD_LAYOUT[2].map((key, j) => (
                <Key
                  key={key.label + "n7" + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || ""}
                  onClick={onKeyPress}
                  active={typeof key.code === "string" && pressedKeys.has(key.code)}
                />
              ))}
            </div>
            <div className="key-group-row">
              {NUMPAD_LAYOUT[3].map((key, j) => (
                <Key
                  key={key.label + "n4" + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || ""}
                  onClick={onKeyPress}
                  active={typeof key.code === "string" && pressedKeys.has(key.code)}
                />
              ))}
            </div>
          </div>
          <div className="key-group-col" style={{ justifyContent: "flex-end" }}>
            <Key
              key={"+numpad"}
              label="+"
              code="NumpadAdd"
              className="key-1x2"
              onClick={onKeyPress}
              active={pressedKeys.has("NumpadAdd")}
            />
          </div>
        </div>
        {/* Numpad wrap for 1/2/3 and 0/. with Enter key 2 tall */}
        <div className="key-group-wrap" style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="key-group-row">
              {NUMPAD_LAYOUT[4].map((key, j) => (
                <Key
                  key={key.label + "n1" + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || ""}
                  onClick={onKeyPress}
                  active={typeof key.code === "string" && pressedKeys.has(key.code)}
                />
              ))}
            </div>
            <div className="key-group-row">
              {NUMPAD_LAYOUT[5].map((key, j) => (
                <Key
                  key={key.label + "n0" + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || ""}
                  onClick={onKeyPress}
                  active={typeof key.code === "string" && pressedKeys.has(key.code)}
                />
              ))}
            </div>
          </div>
          <div className="key-group-col" style={{ justifyContent: "flex-end" }}>
            <Key
              key={"numpad-enter"}
              label="Numpad Enter"
              code="NumpadEnter"
              className="key-1x2"
              onClick={onKeyPress}
              active={pressedKeys.has("NumpadEnter")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keyboard; 