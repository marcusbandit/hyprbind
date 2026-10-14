import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import ConfigList from "./components/ConfigList/ConfigList";
import ConfigListItem from "./components/ConfigListItem/ConfigListItem";
import ConfigPanel from "./components/ConfigPanel/ConfigPanel";

import { readHyprbindConf, writeHyprbindConf } from "./utils/tauriApi";
import { DISPATCHER_OPTIONS } from "./utils/dispatchers";
import { DropdownMenu, Button, Separator, Box, Tooltip } from "@radix-ui/themes";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { useLayout } from "./hooks/useLayout";
import Keyboard from "./components/Keyboard/Keyboard";
import SortableItem from "./components/SortableItem";
import { parseHyprBinds } from "./utils/hyprbind";
import { getKeyCodeForLabel, formatLabel } from "./utils/formatKey";

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
  const [clipboard, setClipboard] = useState<any | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const usedDispatchers = binds
    ? Array.from(new Set(binds.filter((e: any) => e.type === "bind").map((b: any) => b.dispatcher)))
    : [];
  const filteredOptions = (
    showAllDispatchers
      ? DISPATCHER_OPTIONS
      : DISPATCHER_OPTIONS.filter((opt) => usedDispatchers.includes(opt.id))
  ).filter((opt) => opt.id.toLowerCase().includes(searchTerm.toLowerCase()));

  // dnd-kit sensors for drag and drop
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Optimized key handlers: skip repeats and remove logging
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat) return;
    const code = e.code;
    if (!code) return;
    setPressedKeys((prev) => {
      if (prev.has(code)) return prev;
      const next = new Set(prev);
      next.add(code);
      return next;
    });
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const code = e.code;
    if (!code) return;
    setPressedKeys((prev) => {
      if (!prev.has(code)) return prev;
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

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
      binds?.forEach((e) => {
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
    setBinds((prev) => {
      setUndoStack((us) => [...us, prev]);
      setRedoStack([]);
      return fn(prev);
    });
  }

  // Add global undo/redo key handler
  useEffect(() => {
    function handleUndoRedo(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          setRedoStack((rs) => {
            if (rs.length === 0) return rs;
            setUndoStack((us) => [...us, binds]);
            const last = rs[rs.length - 1];
            setBinds(last);
            return rs.slice(0, -1);
          });
        } else {
          // Undo
          setUndoStack((us) => {
            if (us.length === 0) return us;
            setRedoStack((rs) => [...rs, binds]);
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
      applyBindsUpdate((prev) => (prev ? arrayMove(prev, oldIndex, newIndex) : prev));
    }
  };

  // Also clear on cancel
  const handleDragCancel = () => {
    setIsDraggingAny(false);
  };

  const handleDelete = (index: number) => applyBindsUpdate(prev => prev ? prev.filter((_, j) => j !== index) : prev);
  const handleDuplicate = (index: number) => applyBindsUpdate(prev => prev ? [...prev.slice(0, index+1), JSON.parse(JSON.stringify(prev[index])), ...prev.slice(index+1)] : prev);
  const handleSelect = (index: number) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (!layout) return null;
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
        <ConfigList
          binds={binds}
          error={bindsError}
          isDraggingAny={isDraggingAny}
          selectedIndices={selectedIndices}
          pressedKeys={pressedKeys}
          searchTerm={searchTerm}
          showAllDispatchers={showAllDispatchers}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
          handleSelect={handleSelect}
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
          applyBindsUpdate={applyBindsUpdate}
          setSearchTerm={setSearchTerm}
          setShowAllDispatchers={setShowAllDispatchers}
        />
      </ConfigPanel>
    </main>
  );
}
