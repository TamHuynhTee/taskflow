import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Gallery from "./dev/Gallery.tsx";

// Open http://localhost:5173/#gallery to see all the ready-made UI.
// Gallery uses BoardSidebar (which has NavLinks) so it needs a Router — MemoryRouter doesn't touch the real URL.
const root =
  location.hash === "#gallery" ? (
    <MemoryRouter>
      <Gallery />
    </MemoryRouter>
  ) : (
    <App />
  );

createRoot(document.getElementById("root")!).render(
  <StrictMode>{root}</StrictMode>,
);
