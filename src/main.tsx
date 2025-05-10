import React from "react";
import ReactDOM from "react-dom/client";
import "@radix-ui/themes/styles.css";
import App from "./App";
import { Theme } from "@radix-ui/themes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <App />
    </Theme>
  </React.StrictMode>,
);
