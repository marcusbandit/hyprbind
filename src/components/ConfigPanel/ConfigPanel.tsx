import React from "react";
import "./ConfigPanel.css";

export default function ConfigPanel({ children }: { children: React.ReactNode }) {
  return (
      <div className="config-bar">
        {children}
      </div>
  );
} 