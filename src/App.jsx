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
import BackButton from "./components/BackButton";

import CreateAudit from "./pages/CreateAudit";
import SavedAuditsPage from "./pages/SavedAuditsPage";

import APRTablePage from "./pages/APRTablePage";
import AprReportsPage from "./pages/AprReportsPage";
import AprEditorPage from "./pages/AprEditorPage";
import { useEffect, useState } from "react";
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
  const [isOffline, setIsOffline] =
  useState(!navigator.onLine);

useEffect(() => {

  const goOnline = () =>
    setIsOffline(false);

  const goOffline = () =>
    setIsOffline(true);

  window.addEventListener(
    "online",
    goOnline
  );

  window.addEventListener(
    "offline",
    goOffline
  );

  return () => {

    window.removeEventListener(
      "online",
      goOnline
    );

    window.removeEventListener(
      "offline",
      goOffline
    );

  };

}, []);

  return (

    <BrowserRouter>
    {
  isOffline && (

    <div className="offline-banner">
      Hors ligne
    </div>

  )
}

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