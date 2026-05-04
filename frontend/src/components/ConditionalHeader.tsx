"use client";

import { useAuth } from "@/context/AuthContext";
import Header from "./Header";

/**
 * Wrapper that only renders the guest Header (Home/About/Features nav)
 * when the user is NOT authenticated.
 * Dashboard pages render their own role-specific AppBar,
 * so the guest nav must be hidden once logged in.
 */
export default function ConditionalHeader() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return <Header />;
}
