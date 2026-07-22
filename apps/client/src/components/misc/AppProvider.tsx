import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { useDisposeQueryCache } from "#hooks/useDisposeQueryCache";
import { ToastRegion } from "@exifi/ui/components/Toast";

const Devtools = import.meta.env.DEV
  ? await import("./Devtools").then((mod) => mod.Devtools)
  : () => null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

/**
 * Provides global application context.
 */
const AppProvider = ({ children }: { children: Readonly<ReactNode> }) => {
  useDisposeQueryCache(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <Devtools />
        <ToastRegion />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export { AppProvider };
