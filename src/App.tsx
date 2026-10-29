import { useState } from "react";
import { RouterProvider } from "react-router";
import { createAppRouter } from "./app/router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  // Tạo router 1 lần cho mỗi App (lazy init) thay vì ở cấp module → mỗi test render App
  // có router riêng đọc đúng URL hiện tại.
  const [router] = useState(createAppRouter);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
