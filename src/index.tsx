import { StrictMode } from "react";
import { render } from "react-dom";
import { SnackbarProvider } from "./components";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

import "tailwindcss/tailwind.css";

render(
  <StrictMode>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
