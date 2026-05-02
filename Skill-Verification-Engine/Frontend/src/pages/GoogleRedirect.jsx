import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAuth } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

export default function GoogleRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Fix 2: empty dependency array — run once on mount only.
  // login and navigate are intentionally excluded: they are stable refs
  // (login is now memoized with useCallback) but including them previously
  // caused an infinite loop when login was not yet memoized.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const id    = params.get("id");     // MongoDB _id from backend
    const name  = params.get("name");
    const email = params.get("email");

    if (token) {
      const user = {
        _id:   id    || undefined,
        name:  decodeURIComponent(name  || "User"),
        email: decodeURIComponent(email || ""),
      };
      saveAuth(token, user);  // persist to localStorage
      login(user);            // sync AuthContext React state
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []); // ← intentionally empty: this must fire exactly once on mount

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Logging you in...</p>
      </div>
    </div>
  );
}