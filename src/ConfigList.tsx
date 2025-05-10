import React from "react";
import { ScrollArea } from "@radix-ui/themes";
// Removed ScrollArea import as it's no longer used
import "./ConfigList.css";

export default function ConfigList({ children }: { children: React.ReactNode }) {
  return <ScrollArea className="config-list" style={{ width: '100%' }}>{children}</ScrollArea>;
} 