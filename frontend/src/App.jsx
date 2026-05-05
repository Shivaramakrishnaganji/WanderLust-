import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { api } from "./api/client";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorLayout from "./layouts/ErrorLayout";
import ListingsIndex from "./pages/ListingsIndex";
import ListingShow from "./pages/ListingShow";
import ListingNew from "./pages/ListingNew";
import ListingEdit from "./pages/ListingEdit";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ErrorPage from "./pages/ErrorPage";
import NotFound from "./pages/NotFound";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .me()
      .then((data) => {
        if (!active) return;
        setCurrentUser(data.user || null);
      })
      .catch(() => {
        if (!active) return;
        setCurrentUser(null);
      })
      .finally(() => {
        if (!active) return;
        setAuthLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!flash) return undefined;

    const timeout = setTimeout(() => {
      setFlash(null);
    }, 3500);

    return () => clearTimeout(timeout);
  }, [flash]);

  async function handleLogin(payload) {
    try {
      const result = await api.login(payload);
      setCurrentUser(result.user || null);
      setFlash({ type: "success", message: result.message || "Welcome back to Wanderlust !" });
      return result;
    } catch (err) {
      setFlash({ type: "error", message: err.message });
      throw err;
    }
  }

  async function handleSignup(payload) {
    try {
      const result = await api.signup(payload);
      setCurrentUser(result.user || null);
      setFlash({ type: "success", message: result.message || "Welcome to Wanderlust" });
      return result;
    } catch (err) {
      setFlash({ type: "error", message: err.message });
      throw err;
    }
  }

  async function handleLogout() {
    try {
      const result = await api.logout();
      setCurrentUser(null);
      setFlash({ type: "success", message: result.message || "you are logged out!" });
      return result;
    } catch (err) {
      setFlash({ type: "error", message: err.message });
      throw err;
    }
  }

  const layoutProps = useMemo(
    () => ({ currentUser, onLogout: handleLogout, flash }),
    [currentUser, flash]
  );

  if (authLoading) {
    return (
      <MainLayout {...layoutProps}>
        <p className="mt-3">Loading...</p>
      </MainLayout>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/listings" replace />} />

      <Route
        path="/listings"
        element={
          <MainLayout {...layoutProps}>
            <ListingsIndex setFlash={setFlash} />
          </MainLayout>
        }
      />

      <Route
        path="/listings/:id"
        element={
          <MainLayout {...layoutProps}>
            <ListingShow currentUser={currentUser} setFlash={setFlash} />
          </MainLayout>
        }
      />

      <Route
        path="/listings/new"
        element={
          <MainLayout {...layoutProps}>
            <ListingNew currentUser={currentUser} setFlash={setFlash} />
          </MainLayout>
        }
      />

      <Route
        path="/listings/:id/edit"
        element={
          <MainLayout {...layoutProps}>
            <ListingEdit currentUser={currentUser} setFlash={setFlash} />
          </MainLayout>
        }
      />

      <Route
        path="/login"
        element={
          <AuthLayout {...layoutProps}>
            <Login onLogin={handleLogin} />
          </AuthLayout>
        }
      />

      <Route
        path="/signup"
        element={
          <AuthLayout {...layoutProps}>
            <Signup onSignup={handleSignup} />
          </AuthLayout>
        }
      />

      <Route
        path="/error"
        element={
          <ErrorLayout {...layoutProps}>
            <ErrorPage />
          </ErrorLayout>
        }
      />

      <Route
        path="*"
        element={
          <ErrorLayout {...layoutProps}>
            <NotFound />
          </ErrorLayout>
        }
      />
    </Routes>
  );
}
