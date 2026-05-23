import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==========================
// PAGES
// ==========================

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardPage from "./pages/DashboardPage";

import CreateAudit from "./pages/CreateAudit";
import SavedAuditsPage from "./pages/SavedAuditsPage";

import APRTablePage from "./pages/APRTablePage";
import AprReportsPage from "./pages/AprReportsPage";
import AprEditorPage from "./pages/AprEditorPage";

// ==========================
// AUTH GUARD
// ==========================

function PrivateRoute({ children }) {

  const token =
    localStorage.getItem("token");

  return token
    ? children
    : <Navigate to="/" />;
}

// ==========================
// APP
// ==========================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ===================== */}
        {/* AUTH */}
        {/* ===================== */}

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* ===================== */}
        {/* DASHBOARD */}
        {/* ===================== */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* AUDITS */}
        {/* ===================== */}

        <Route
          path="/create-audit"
          element={
            <PrivateRoute>
              <CreateAudit />
            </PrivateRoute>
          }
        />

        <Route
          path="/saved-audits"
          element={
            <PrivateRoute>
              <SavedAuditsPage />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* APR */}
        {/* ===================== */}

        <Route
          path="/apr"
          element={
            <PrivateRoute>
              <APRTablePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/apr-reports"
          element={
            <PrivateRoute>
              <AprReportsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/apr-editor/:id"
          element={
            <PrivateRoute>
              <AprEditorPage />
            </PrivateRoute>
          }
        />

        {/* ===================== */}
        {/* FALLBACK */}
        {/* ===================== */}

        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;