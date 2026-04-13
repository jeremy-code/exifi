import { Outlet, createFileRoute } from "@tanstack/react-router";

import { DropzoneStoreProvider } from "#hooks/useDropzoneStore";

const AppLayoutComponent = () => {
  return (
    <DropzoneStoreProvider>
      <Outlet />
    </DropzoneStoreProvider>
  );
};

const Route = createFileRoute("/_app")({
  component: AppLayoutComponent,
  ssr: false,
});

export { Route };
