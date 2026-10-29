import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Gallery from "./dev/Gallery.tsx";

// Mở http://localhost:5173/#gallery để xem toàn bộ UI có sẵn.
// Gallery dùng BoardSidebar (có NavLink) nên cần một Router — MemoryRouter không đụng tới URL thật.
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
