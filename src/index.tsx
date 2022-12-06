import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SnackbarProvider } from "./components";
import App from "./app";
import reportWebVitals from "./reportWebVitals";

import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </StrictMode>
);

reportWebVitals();
