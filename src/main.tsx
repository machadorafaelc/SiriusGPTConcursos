import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { PlanoProvider } from "./PlanoContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PlanoProvider children={<App />} />
  </React.StrictMode>
);
