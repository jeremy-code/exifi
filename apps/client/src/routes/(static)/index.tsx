import type { ReactNode } from "react";

import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { ClipboardCheck, Lock, Wrench } from "lucide-react";
import { Slot } from "radix-ui";

import { Button } from "@exifi/ui/components/Button";
import { Card } from "@exifi/ui/components/Card";
import { Heading } from "@exifi/ui/components/Heading";
import { Link } from "@exifi/ui/components/Link";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="p-6">
      <dt className="text-lg font-semibold">
        <div className="mb-4 grid size-10 place-content-center rounded-md bg-accent text-white">
          <Slot.Root className="size-4">{icon}</Slot.Root>
        </div>
        {title}
      </dt>
      <dd className="mt-4 text-muted-foreground">{description}</dd>
    </Card>
  );
};

const FEATURES = [
  {
    icon: <Lock />,
    title: "Private",
    description:
      "Images never leave your browser and are never uploaded to someone's server",
  },
  {
    icon: <ClipboardCheck />,
    title: "Standardized",
    description: (
      <>
        {"Uses the WebAssembly library "}
        <Link
          href="https://www.npmjs.com/package/libexif-wasm"
          color="link"
          underline="hover"
        >
          libexif-wasm
        </Link>
        {" based on the "}
        <Link href="https://libexif.github.io/" color="link" underline="hover">
          libexif
        </Link>
        {" C library, which supports all of Exif standard 2.1 and most of 2.2."}
      </>
    ),
  },
  {
    icon: <Wrench />,
    title: "Convenient",
    description: "Read and write Exif data directly in the browser.",
  },
] satisfies FeatureCardProps[];

const HomeComponent = () => {
  return (
    <div className="container py-8">
      <div className="grid max-h-dvh min-h-80 place-content-center gap-8">
        <Heading as="h1" size="4xl">
          View and edit Exif data locally
        </Heading>
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <Button color="accent" asChild>
            <RouterLink to="/viewer">View</RouterLink>
          </Button>
          <Button variant="ghost" asChild>
            <RouterLink to="/editor">Edit</RouterLink>
          </Button>
        </div>
      </div>
      <div className="pt-16">
        <div className="text-center">
          <Heading as="h2" size="3xl">
            Features
          </Heading>
        </div>
        <div className="mt-12">
          <dl className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((informationItem) => (
              <FeatureCard key={informationItem.title} {...informationItem} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

const Route = createFileRoute("/(static)/")({
  component: HomeComponent,
});

export { Route };
