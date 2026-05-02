import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { logout } from "../utils/auth";

const API_BASE = import.meta.env.VITE_SVE_API_URL || "http://localhost:5005/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // On mount: check URL for token & skill query params (cross-app SSO from SkillNet)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlSkill = params.get("skill");

    if (urlToken) {
      localStorage.setItem("token", urlToken);

      if (urlSkill) {
        sessionStorage.setItem("sve_pending_skill", urlSkill);
      }

      params.delete("token");
      params.delete("skill");
      const cleanUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  // Restore auth state — if token exists, fetch user profile from SVE backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setInitializing(false);
      return;
    }

    // Check if we already have a stored user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && !parsed._id && parsed.id) parsed._id = parsed.id;
        if (parsed?._id) {
          setUser(parsed);
          setAuthenticated(true);
          setInitializing(false);
          return;
        }
      } catch {
        // fall through to fetch
      }
    }

    // No stored user — fetch from /api/auth/me (the auth middleware auto-creates the user)
    axios
      .get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userData = res.data;
        console.log("AuthContext: fetched user from /api/auth/me:", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setAuthenticated(true);
      })
      .catch((err) => {
        console.error("AuthContext: /api/auth/me failed:", err.message);
        // Token is present but invalid — still mark as authenticated for API calls
        // that might work with just the token
        setAuthenticated(true);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  const login = useCallback((userData) => {
    setAuthenticated(true);
    setUser(userData);
  }, []);

  const logoutUser = useCallback(() => {
    logout();
    setAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, authenticated, login, logoutUser, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
