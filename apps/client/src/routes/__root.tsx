/// <reference types="vite/client" />
import "@exiftools/ui/globals.css";
import "../leaflet.css";

import type { ReactNode } from "react";

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { Footer } from "#components/layout/Footer";
import { Navbar } from "#components/layout/Navbar";
import { AppProvider } from "#components/misc/AppProvider";

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
};

const RootComponent = () => {
  return (
    <RootDocument>
      <AppProvider>
        <Navbar />
        {/* `mt-15.25` accounts for <Navbar> height */}
        <main className="container mt-15.25 py-8">
          <Outlet />
        </main>
        <Footer />
      </AppProvider>
    </RootDocument>
  );
};

const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
  }),
  component: RootComponent,
});

export { Route };
