import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";

import { Button } from "@exiftools/ui/components/Button";

const HomeComponent = () => {
  return (
    <>
      <div className="grid max-h-dvh min-h-60 place-content-center gap-8">
        <h1 className="mt-[1rem] text-[2rem] font-bold">
          View and edit Exif data locally
        </h1>
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <Button color="accent" asChild>
            <RouterLink to="/viewer">View</RouterLink>
          </Button>
          <Button variant="ghost" asChild>
            <RouterLink to="/editor">Edit</RouterLink>
          </Button>
        </div>
      </div>
    </>
  );
};

const Route = createFileRoute("/(static)/")({
  component: HomeComponent,
});

export { Route };
