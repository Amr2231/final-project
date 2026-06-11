"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// types
interface ThemeProviderProps {
  children: React.ReactNode;
}

// component
export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem
      defaultTheme="system"
      disableTransitionOnChange
      storageKey="app-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
