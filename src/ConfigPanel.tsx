import React from "react";
export default function ConfigPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="config-bar">
      {children}
    </div>
  );
} 