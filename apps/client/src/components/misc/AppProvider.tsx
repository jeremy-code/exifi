"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "@exiftools/ui/components/Tooltip";

/**
 * Provides global application context.
 */
const AppProvider = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};

export { AppProvider };
