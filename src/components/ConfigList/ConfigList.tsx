import React, { memo, useMemo } from "react";
import {
  ScrollArea,
  DropdownMenu,
  Button,
  Separator,
  Box,
  Tooltip,
  Container,
} from "@radix-ui/themes";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../SortableItem";
import ConfigListItem from "../ConfigListItem/ConfigListItem";
import { DISPATCHER_OPTIONS } from "../../utils/dispatchers";
import { getKeyCodeForLabel, formatLabel } from "../../utils/formatKey";
import "./ConfigList.css";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

interface ConfigListProps {
  binds: any[] | null;
  error: string | null;
  isDraggingAny: boolean;
  selectedIndices: Set<number>;
  pressedKeys: Set<string>;
  searchTerm: string;
  showAllDispatchers: boolean;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setShowAllDispatchers: React.Dispatch<React.SetStateAction<boolean>>;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
  handleSelect: (index: number) => void;
  handleDelete: (index: number) => void;
  handleDuplicate: (index: number) => void;
  applyBindsUpdate: (fn: (prev: any[] | null) => any[] | null) => void;
}

function ConfigList({
  binds,
  error,
  isDraggingAny,
  selectedIndices,
  pressedKeys,
  searchTerm,
  showAllDispatchers,
  setSearchTerm,
  setShowAllDispatchers,
  onDragStart,
  onDragEnd,
  onDragCancel,
  handleSelect,
  handleDelete,
  handleDuplicate,
  applyBindsUpdate,
}: ConfigListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const usedDispatchers = useMemo(
    () =>
      binds
        ? Array.from(new Set(binds.filter((e) => e.type === "bind").map((b) => b.dispatcher)))
        : [],
    [binds]
  );
  const filteredOptions = useMemo(
    () =>
      (showAllDispatchers
        ? DISPATCHER_OPTIONS
        : DISPATCHER_OPTIONS.filter((opt) => usedDispatchers.includes(opt.id))
      ).filter((opt) => opt.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [showAllDispatchers, searchTerm, usedDispatchers]
  );

  const MOD_KEY_CODE_MAP: Record<string, string[]> = {
    super: ["MetaLeft", "MetaRight", "OSLeft", "OSRight"],
    ctrl: ["ControlLeft", "ControlRight"],
    alt: ["AltLeft", "AltRight"],
    shift: ["ShiftLeft", "ShiftRight"],
  };

  const bindIndices =
    binds?.map((e, i) => (e.type === "bind" ? i : -1)).filter((i) => i !== -1) || [];
  const lastBindIndex = bindIndices[bindIndices.length - 1] ?? -1;

  // Virtualization constants
  const ROW_HEIGHT = 200;
  const MAX_LIST_HEIGHT = 600;
  // Row renderer for react-window
  const renderRow = ({ index, style }: ListChildComponentProps) => {
    const e = binds![index];
    return (
      <div style={style} key={index}>
        <SortableItem id={index.toString()} isDraggingAny={isDraggingAny}>
          {({ attributes, listeners }) => (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: e.type === "comment" ? "flex-start" : "center",
                alignItems: e.type === "comment" ? "center" : "flex-start",
              }}
            >
              <div className="drag-wrapper">
                <div className="item-options">
                  <div
                    {...attributes}
                    {...listeners}
                    className="drag-handle"
                    style={{
                      cursor: "grab",
                      padding: "0 0.5em",
                      userSelect: "none",
                      alignSelf: e.type === "comment" ? "auto" : "center",
                    }}
                  >
                    <Tooltip content="Drag to reorder">
                      <div {...attributes} {...listeners} className="drag-handle">
                        <span className="material-icons">drag_handle</span>
                      </div>
                    </Tooltip>
                  </div>
                  <Tooltip content={selectedIndices.has(index) ? "Unselect" : "Select"}>
                    <Button variant="ghost" onClick={() => handleSelect(index)}>
                      <span className="material-icons">
                        {selectedIndices.has(index) ? "check_box" : "check_box_outline_blank"}
                      </span>
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete">
                    <Button variant="ghost" onClick={() => handleDelete(index)}>
                      <span className="material-icons">delete</span>
                    </Button>
                  </Tooltip>
                  <Tooltip content="Duplicate">
                    <Button variant="ghost" onClick={() => handleDuplicate(index)}>
                      <span className="material-icons">file_copy</span>
                    </Button>
                  </Tooltip>
                </div>
                {e.type === "comment" ? (
                  <input
                    key={index}
                    type="text"
                    className="category-header"
                    value={e.comment}
                    onChange={(ev) => {
                      const newVal = ev.target.value;
                      applyBindsUpdate((prev) =>
                        prev
                          ? prev.map((entry, j) =>
                              j === index
                                ? { ...entry, comment: newVal, raw: "# " + newVal }
                                : entry
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
                        applyBindsUpdate((prev) =>
                          prev
                            ? prev.map((entry, j) =>
                                j === index ? { ...entry, label: newVal } : entry
                              )
                            : prev
                        );
                      }}
                    />
                    <div className="faded-line-horizontal" />
                    <ConfigListItem isLast={index === lastBindIndex}>
                      <div className="mod-keys">
                        {e.mod!.map((m: any) => {
                          const codes = MOD_KEY_CODE_MAP[m.toLowerCase()] || [];
                          const isActive = codes.some((c) => pressedKeys.has(c));
                          return (
                            <span
                              key={m}
                              className={`key key-1x1${isActive ? " key--active" : ""}`}
                            >
                              {m}
                            </span>
                          );
                        })}
                      </div>
                      <div className="main-key">
                        <span
                          className={`key key-1x1${
                            pressedKeys.has(getKeyCodeForLabel(e.key)) ? " key--active" : ""
                          }`}
                        >
                          {e.key}
                        </span>
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
                            <div
                              className={`dispatcher-list ${showAllDispatchers ? "columns-2" : ""}`}
                            >
                              {filteredOptions.map((opt) => (
                                <DropdownMenu.Item
                                  key={opt.id}
                                  onSelect={() => {
                                    applyBindsUpdate((prev) =>
                                      prev
                                        ? prev.map((entry, j) =>
                                            j === index ? { ...entry, dispatcher: opt.id } : entry
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
                      {(DISPATCHER_OPTIONS.find((opt) => opt.id === e.dispatcher)?.allowedParams
                        .length ?? 0) > 0 && (
                        <div className="param-cell">
                          <input
                            type="text"
                            value={e.parameter ?? ""}
                            placeholder="Parameter"
                            className="parameter-input"
                            onChange={(ev) => {
                              const newParam = ev.target.value;
                              applyBindsUpdate((prev) =>
                                prev
                                  ? prev.map((entry, j) =>
                                      j === index ? { ...entry, parameter: newParam } : entry
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
            </div>
          )}
        </SortableItem>
      </div>
    );
  };

  return (
    <ScrollArea className="config-list" style={{ width: "100%" }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragCancel={onDragCancel}
        onDragEnd={onDragEnd}
      >
        <Container>
          <SortableContext
            items={binds?.map((_, i) => i.toString()) ?? []}
            strategy={verticalListSortingStrategy}
          >
            {binds === null && !error && <ConfigListItem>Loading…</ConfigListItem>}
            {error && <ConfigListItem>{error}</ConfigListItem>}
            {binds && binds.filter((e) => e.type === "bind").length === 0 && (
              <ConfigListItem>No binds found.</ConfigListItem>
            )}
            {binds && (
              <List
                height={Math.min((binds.length || 0) * ROW_HEIGHT)}
                width="100%"
                itemCount={binds.length}
                itemSize={ROW_HEIGHT}
              >
                {renderRow}
              </List>
            )}
          </SortableContext>
        </Container>
      </DndContext>
    </ScrollArea>
  );
}

export default memo(ConfigList);
