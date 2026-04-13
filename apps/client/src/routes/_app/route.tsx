import { Outlet, createFileRoute } from "@tanstack/react-router";

const AppLayoutComponent = () => {
  return <Outlet />;
};

const Route = createFileRoute("/_app")({
  component: AppLayoutComponent,
  ssr: false,
});

export { Route };
