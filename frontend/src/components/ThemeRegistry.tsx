"use client"; // Ensures this component is only rendered on the client

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1", // Indigo 500
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ec4899", // Pink 500
      light: "#f472b6",
      dark: "#db2777",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc", // Slate 50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#64748b", // Slate 500
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), 'Inter', sans-serif",
    h1: { fontWeight: 700, fontSize: "3rem" },
    h2: { fontWeight: 700, fontSize: "2.25rem" },
    h3: { fontWeight: 600, fontSize: "1.875rem" },
    h4: { fontWeight: 600, fontSize: "1.5rem" },
    h5: { fontWeight: 600, fontSize: "1.25rem" },
    h6: { fontWeight: 600, fontSize: "1.125rem" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(to right, #6366f1, #8b5cf6)", // Indigo to Violet
          "&:hover": {
            background: "linear-gradient(to right, #4f46e5, #7c3aed)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
          border: "1px solid #e2e8f0",
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  // This ensures that MUI ThemeProvider only renders after the client mounts
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR/client mismatch

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
