import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Gallery from "./dev/Gallery.tsx";

// Mở http://localhost:5173/#gallery để xem toàn bộ UI có sẵn.
const Root = location.hash === "#gallery" ? Gallery : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
