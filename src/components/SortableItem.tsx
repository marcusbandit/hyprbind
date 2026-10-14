import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  isDraggingAny: boolean;
  children: (props: { attributes: any; listeners: any }) => React.ReactNode;
}

/**
 * Wrapper to make any child component sortable via dnd-kit.
 */
export default function SortableItem({ id, children, isDraggingAny }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    // animate only while any item is being dragged
    transition: isDraggingAny ? transition : 'none',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-item">
      {children({ attributes, listeners })}
    </div>
  );
} 