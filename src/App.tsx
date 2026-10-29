import { useState } from "react";
import { RouterProvider } from "react-router";
import { createAppRouter } from "./app/router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  // Create the router once per App (lazy init) instead of at module level, so each test that
  // renders App gets its own router reading the current URL.
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
