import { ReactNode, useEffect, useState } from "react";
import "./App.css";
import ConfigList from "./ConfigList";
import ConfigListItem from "./ConfigListItem";
import ConfigPanel from "./ConfigPanel";

import { readHyprbindConf, writeHyprbindConf } from "./tauriApi";
import { DISPATCHER_OPTIONS } from "./dispatchers";
import { DropdownMenu, Button, Separator, Box } from "@radix-ui/themes";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Layout State ---
type KeyDef = { label: string; class?: string; code?: string };
type LayoutData = {
  keyboard: KeyDef[][];
  nav: KeyDef[][];
  numpad: KeyDef[][];
};

function useLayout(layoutName: string): LayoutData | null {
  const [layout, setLayout] = useState<LayoutData | null>(null);
  useEffect(() => {
    fetch(`/layouts/${layoutName}.json`)
      .then((res) => res.json())
      .then(setLayout)
      .catch(() => setLayout(null));
  }, [layoutName]);
  return layout;
}

// --- Key Components ---
function Key({
  label,
  onClick,
  className = "",
  active = false,
}: {
  label: string;
  code?: string;
  onClick: (label: string) => void;
  className?: string;
  active?: boolean;
}) {
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
  // All keys are 1x1
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

function Keyboard({
  onKeyPress,
  layout,
  pressedKeys,
}: {
  onKeyPress: (label: string) => void;
  layout: LayoutData;
  pressedKeys: Set<string>;
}) {
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
              className={key.class || undefined}
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
              className={key.class || undefined}
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
                  className={key.class || undefined}
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
                  className={key.class || undefined}
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
              className={KEYBOARD_LAYOUT[2][KEYBOARD_LAYOUT[2].length - 1].class || undefined}
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
              className={key.class || undefined}
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
              className={key.class || undefined}
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
                <div key={"blank-nav-" + i + j} className={key.class || "key-blank"}></div>
              ) : (
                <Key
                  key={key.label + "nav" + i + j}
                  label={key.label}
                  code={key.code}
                  className={key.class || undefined}
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
              className={key.class || undefined}
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
              className={key.class || undefined}
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
                  className={key.class || undefined}
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
                  className={key.class || undefined}
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
                  className={key.class || undefined}
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
                  className={key.class || undefined}
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
}

// Using default path by omitting explicit path argument
function parseHyprBinds(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.match(/^bind\s*=/) || line.match(/^#\s*/))
    .map((line) => {
      if (line.startsWith("##")) {
        const label = line.replace(/^##\s*/, "");
        return { type: "itemLabel", label, raw: line };
      }
      if (line.startsWith("#")) {
        const comment = line.replace(/^#\s*/, "");
        return { type: "comment", comment, raw: line };
      }
      // Remove 'bind =' and split by comma
      const parts = line
        .replace(/^bind\s*=\s*/, "")
        .split(",")
        .map((s) => s.trim());
      // mod(s) can be space separated
      const mod = parts[0] ? parts[0].split(/\s+/).filter(Boolean) : [];
      const key = parts[1] || "";
      const dispatcher = parts[2] || "";
      // Parameter: everything after the third comma, joined and trimmed, or None
      let parameter = null;
      if (parts.length > 3) {
        parameter = parts.slice(3).join(", ").replace(/#.*/, "").trim();
        if (parameter === "") parameter = null;
      }
      return { type: "bind", mod, key, dispatcher, parameter, raw: line };
    });
}

// Compute key code from label for detection (module-level)
function getKeyCodeForLabel(label: string) {
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

// Format labels (mods and keys) for UI display
function formatLabel(s: string) {
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

// Sortable item wrapper component for dnd-kit
function SortableItem({ id, children, isDraggingAny }: { id: string; isDraggingAny: boolean; children: (props: { attributes: any; listeners: any }) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    // animate only while any item is being dragged
    transition: isDraggingAny ? transition : 'none',
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  // Global dragging state for controlling transitions
  const [isDraggingAny, setIsDraggingAny] = useState(false);
  const layout = useLayout("en-qwerty");
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [binds, setBinds] = useState<any[] | null>(null);
  const [bindsError, setBindsError] = useState<string | null>(null);
  const [showAllDispatchers, setShowAllDispatchers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [undoStack, setUndoStack] = useState<(any[] | null)[]>([]);
  const [redoStack, setRedoStack] = useState<(any[] | null)[]>([]);
  const usedDispatchers = binds
    ? Array.from(new Set(binds.filter((e: any) => e.type === "bind").map((b: any) => b.dispatcher)))
    : [];
  const filteredOptions = (
    showAllDispatchers
      ? DISPATCHER_OPTIONS
      : DISPATCHER_OPTIONS.filter((opt) => usedDispatchers.includes(opt.id))
  ).filter((opt) => opt.id.toLowerCase().includes(searchTerm.toLowerCase()));

  // dnd-kit sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Print all relevant info for debugging
      const info = {
        key: e.key,
        code: e.code,
        location: e.location,
        keyCode: e.keyCode,
        which: e.which,
        charCode: e.charCode,
        meta: e.getModifierState("Meta"),
        ctrl: e.getModifierState("Control"),
        alt: e.getModifierState("Alt"),
        shift: e.getModifierState("Shift"),
        repeat: e.repeat,
        timeStamp: e.timeStamp,
      };
      // Print Super_L and Super_R explicitly
      if (e.code === "MetaLeft" || e.code === "OSLeft") {
        console.log("Super_L (MetaLeft/OSLeft) pressed:", info);
      } else if (e.code === "MetaRight" || e.code === "OSRight") {
        console.log("Super_R (MetaRight/OSRight) pressed:", info);
      }
      if (e.code === "AltRight") {
        console.log("AltRight pressed. Window size:", window.innerWidth, "x", window.innerHeight);
      }
      // Always print key debug info
      console.log("Key pressed:", info);
      const code = e.code;
      if (code) {
        setPressedKeys((prev) => {
          if (prev.has(code)) return prev;
          const next = new Set(prev);
          next.add(code);
          return next;
        });
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      const code = e.code;
      if (code) {
        setPressedKeys((prev) => {
          if (!prev.has(code)) return prev;
          const next = new Set(prev);
          next.delete(code);
          return next;
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await readHyprbindConf();
        console.log("hyprbinds.conf content:", raw);
        // Parse raw content to include comments and binds
        const entriesRaw = parseHyprBinds(raw);
        // Handle category headers (#), item labels (##), and bind entries
        let pendingLabel = "";
        const processed = entriesRaw.reduce((acc: any[], e) => {
          if (e.type === "itemLabel") {
            // Store item label for next bind
            pendingLabel = e.label ?? "";
          } else if (e.type === "bind") {
            // Append bind with any pending item label
            acc.push({
              ...e,
              mod: e.mod!.map(formatLabel),
              key: formatLabel(e.key!),
              label: pendingLabel,
            });
            pendingLabel = "";
          } else {
            // Category header: reset pending label
            acc.push(e);
            pendingLabel = "";
          }
          return acc;
        }, []);
        setBinds(processed);
      } catch (e) {
        setBindsError("Could not load hyprbinds.conf");
        console.error("Could not load hyprbinds.conf", e);
      }
    })();
  }, []);

  const onKeyPress = (key: string) => {
    console.log("Key pressed:", key);
  };

  // Save current configuration (headers, item labels, and binds) to hyprbinds.conf
  const saveConfig = async () => {
    try {
      // Serialize and send to backend
      const lines: string[] = [];
      binds?.forEach(e => {
        if (e.type === "comment") {
          // headers with empty line above
          lines.push("");
          lines.push("# " + e.comment);
        } else if (e.type === "bind") {
          if (e.label) lines.push("## " + e.label);
          let line = `bind = ${e.mod.join(" ")}, ${e.key}, ${e.dispatcher}`;
          if (e.parameter) line += `, ${e.parameter}`;
          lines.push(line);
        }
      });
      const content = lines.join("\n");
      await writeHyprbindConf(content);
      console.log("Config saved");
    } catch (err) {
      console.error("Failed to save config via backend", err);
    }
  };

  // Function to update binds state with history tracking
  function applyBindsUpdate(fn: (prev: any[] | null) => any[] | null) {
    setBinds(prev => {
      setUndoStack(us => [...us, prev]);
      setRedoStack([]);
      return fn(prev);
    });
  }

  // Add global undo/redo key handler
  useEffect(() => {
    function handleUndoRedo(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          setRedoStack(rs => {
            if (rs.length === 0) return rs;
            setUndoStack(us => [...us, binds]);
            const last = rs[rs.length - 1];
            setBinds(last);
            return rs.slice(0, -1);
          });
        } else {
          // Undo
          setUndoStack(us => {
            if (us.length === 0) return us;
            setRedoStack(rs => [...rs, binds]);
            const last = us[us.length - 1];
            setBinds(last);
            return us.slice(0, -1);
          });
        }
      }
    }
    window.addEventListener("keydown", handleUndoRedo);
    return () => window.removeEventListener("keydown", handleUndoRedo);
  }, [undoStack, redoStack, binds]);

  // Reset dragging state when drag starts
  const handleDragStart = (event: DragStartEvent) => {
    setIsDraggingAny(true);
  };

  // dnd-kit drag-end handler to reorder binds
  const handleDragEnd = (event: DragEndEvent) => {
    // Stop animating transitions
    setIsDraggingAny(false);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);
      applyBindsUpdate(prev => prev ? arrayMove(prev, oldIndex, newIndex) : prev);
    }
  };

  // Also clear on cancel
  const handleDragCancel = () => {
    setIsDraggingAny(false);
  };

  if (!layout) return null;
  // Map modifier names to actual key codes for active highlighting
  const MOD_KEY_CODE_MAP: Record<string, string[]> = {
    super: ["MetaLeft", "MetaRight", "OSLeft", "OSRight"],
    ctrl: ["ControlLeft", "ControlRight"],
    alt: ["AltLeft", "AltRight"],
    shift: ["ShiftLeft", "ShiftRight"],
  };

  // Compute last bind index to hide separators correctly
  const bindIndices =
    binds?.map((e, i) => (e.type === "bind" ? i : -1)).filter((i) => i !== -1) || [];
  const lastBindIndex = bindIndices[bindIndices.length - 1] ?? -1;

  return (
    <main className="container">
      <header className="app-toolbar">
        <Button variant="ghost" onClick={saveConfig}>
          Save
        </Button>
      </header>
      <div className="editor-container">
        <Keyboard onKeyPress={onKeyPress} layout={layout} pressedKeys={pressedKeys} />
      </div>
      <ConfigPanel>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={binds?.map((_, i) => i.toString()) ?? []} strategy={verticalListSortingStrategy}>
            <ConfigList>
              {binds === null && !bindsError && <ConfigListItem>Loading…</ConfigListItem>}
              {bindsError && <ConfigListItem>{bindsError}</ConfigListItem>}
              {binds && binds.filter((e) => e.type === "bind").length === 0 && (
                <ConfigListItem>No binds found.</ConfigListItem>
              )}
              {binds && binds.map((e: any, i: number) => (
                <SortableItem key={i} id={i.toString()} isDraggingAny={isDraggingAny}>
                  {({ attributes, listeners }) => (
                    <div style={{ width: '100%', display: 'flex', justifyContent: e.type === 'comment' ? 'flex-start' : 'center', alignItems: e.type === 'comment' ? 'center' : 'flex-start' }}>
                      <div {...attributes} {...listeners} className="drag-handle" style={{ cursor: 'grab', padding: '0 0.5em', userSelect: 'none', alignSelf: e.type === 'comment' ? 'auto' : 'center' }}>☰</div>
                      {e.type === 'comment' ? (
                        <input
                          key={i}
                          type="text"
                          className="category-header"
                          value={e.comment}
                          onChange={(ev) => {
                            const newVal = ev.target.value;
                            applyBindsUpdate(prev =>
                              prev
                                ? prev.map((entry, j) =>
                                    j === i ? { ...entry, comment: newVal, raw: "# " + newVal } : entry
                                  )
                                : prev
                            );
                          }}
                        />
                      ) : (
                        <div className="item-wrapper">
                          <input
                            type="text"
                            className="item-header"
                            placeholder="Item Label"
                            value={e.label}
                            onChange={(ev) => {
                              const newVal = ev.target.value;
                              applyBindsUpdate(prev =>
                                prev
                                  ? prev.map((entry, j) =>
                                      j === i ? { ...entry, label: newVal } : entry
                                    )
                                  : prev
                              );
                            }}
                          />
                          <div className="faded-line-horizontal" />
                          <ConfigListItem isLast={i === lastBindIndex}>
                            <div className="mod-keys">
                              {e.mod!.map((m: any) => {
                                const codes = MOD_KEY_CODE_MAP[m.toLowerCase()] || [];
                                const isActive = codes.some((c) => pressedKeys.has(c));
                                return (
                                  <span key={m} className={`key key-1x1${isActive ? ' key--active' : ''}`}>{m}</span>
                                );
                              })}
                            </div>
                            <div className="main-key">
                              <span className={`key key-1x1${pressedKeys.has(getKeyCodeForLabel(e.key)) ? ' key--active' : ''}`}>{e.key}</span>
                            </div>
                            <div className="dispatcher-cell">
                              <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                  <Button
                                    variant="ghost"
                                    className="dispatcher-trigger"
                                    style={{ margin: "auto 0" }}
                                  >
                                    {e.dispatcher}
                                    <DropdownMenu.TriggerIcon />
                                  </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content
                                  data-radix-popper-content-wrapper
                                  className="dispatcher-dropdown-wrapper"
                                >
                                  {/* Search area */}
                                  <div className="dispatcher-search">
                                    <input
                                      type="search"
                                      placeholder="Search dispatchers..."
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      onKeyDown={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                  <Separator orientation="horizontal" />
                                  {/* List area */}
                                  <div className={`dispatcher-list ${showAllDispatchers ? "columns-2" : ""}`}>
                                    {filteredOptions.map((opt) => (
                                      <DropdownMenu.Item
                                        key={opt.id}
                                        onSelect={() => {
                                          applyBindsUpdate(prev =>
                                            prev
                                              ? prev.map((entry, j) =>
                                                  j === i ? { ...entry, dispatcher: opt.id } : entry
                                                )
                                              : prev
                                          );
                                        }}
                                      >
                                        {opt.id}
                                      </DropdownMenu.Item>
                                    ))}
                                  </div>
                                  {/* Footer area */}
                                  <div className="dispatcher-footer">
                                    <Box
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        gap: "0.5rem",
                                      }}
                                    >
                                      <Separator orientation="horizontal" size="4" />
                                      <DropdownMenu.Item
                                        onSelect={(event) => {
                                          event.preventDefault();
                                          setShowAllDispatchers((prev) => !prev);
                                        }}
                                      >
                                        {showAllDispatchers ? "Show Favorites" : "Show all"}
                                      </DropdownMenu.Item>
                                    </Box>
                                  </div>
                                </DropdownMenu.Content>
                              </DropdownMenu.Root>
                            </div>
                            {/* parameter input only for dispatchers with allowedParams */}
                            {(DISPATCHER_OPTIONS.find((opt) => opt.id === e.dispatcher)?.allowedParams.length ?? 0) > 0 && (
                              <div className="param-cell">
                                <input
                                  type="text"
                                  value={e.parameter ?? ''}
                                  placeholder="Parameter"
                                  className="parameter-input"
                                  onChange={(ev) => {
                                    const newParam = ev.target.value;
                                    applyBindsUpdate(prev =>
                                      prev
                                        ? prev.map((entry, j) =>
                                            j === i ? { ...entry, parameter: newParam } : entry
                                          )
                                        : prev
                                    );
                                  }}
                                />
                              </div>
                            )}
                          </ConfigListItem>
                        </div>
                      )}
                    </div>
                  )}
                </SortableItem>
              ))}
            </ConfigList>
          </SortableContext>
        </DndContext>
      </ConfigPanel>
    </main>
  );
}
