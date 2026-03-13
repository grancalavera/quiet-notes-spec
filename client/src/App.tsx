import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { NotebookPage } from "./pages/NotebookPage";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/notebook"
            element={
              <ProtectedRoute>
                <NotebookPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/notebook" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
