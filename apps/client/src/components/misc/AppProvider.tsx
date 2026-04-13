"use client";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { useDisposeQueryCache } from "#hooks/useDisposeQueryCache";
import { Toaster } from "@exiftools/ui/components/Toaster";
import { TooltipProvider } from "@exiftools/ui/components/Tooltip";

const Devtools =
  import.meta.env.DEV ?
    await import("./Devtools").then((mod) => mod.Devtools)
  : () => null;

const queryClient = new QueryClient();

/**
 * Provides global application context.
 */
const AppProvider = ({ children }: { children: Readonly<ReactNode> }) => {
  useDisposeQueryCache(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Defaults to 700 */}
        <TooltipProvider delayDuration={0}>
          {children}
          <Devtools />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export { AppProvider };
