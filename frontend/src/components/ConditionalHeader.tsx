"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

/**
 * Wrapper that hides the guest Header on dashboard routes,
 * which render their own role-specific AppBar.
 * On all other pages (landing, public routes, etc.) the guest Header is shown.
 */
export default function ConditionalHeader() {
  const pathname = usePathname();

  // Dashboard routes that render their own AppBar — hide the guest header there
  const isDashboardRoute =
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/sme") ||
    pathname?.startsWith("/companies") ||
    pathname?.startsWith("/admin");

  if (isDashboardRoute) {
    return null;
  }

  return <Header />;
}
