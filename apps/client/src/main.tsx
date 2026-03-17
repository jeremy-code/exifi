import "@exiftools/ui/globals.css";
import "@fontsource-variable/lexend/index.css";

import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router";

import { AppProvider } from "#components/misc/AppProvider";
import { routes } from "#routes";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>,
);
