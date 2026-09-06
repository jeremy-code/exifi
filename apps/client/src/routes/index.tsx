import type { ReactNode } from "react";

import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { ClipboardCheck, Lock, Wrench } from "lucide-react";

import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  AccordionItem,
} from "@exifi/ui/components/Accordion";
import { buttonVariants } from "@exifi/ui/components/Button";
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
          {icon}
        </div>
        {title}
      </dt>
      <dd className="mt-4 text-fg-muted">{description}</dd>
    </Card>
  );
};

const FEATURES = [
  {
    icon: <Lock className="size-4" />,
    title: "Private",
    description:
      "Images never leave your browser and are never uploaded to someone's server",
  },
  {
    icon: <ClipboardCheck className="size-4" />,
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
    icon: <Wrench className="size-4" />,
    title: "Convenient",
    description: "Read and write Exif data directly in the browser.",
  },
] satisfies FeatureCardProps[];

const FAQS = [
  {
    question: "What is this?",
    answer:
      "exifi is an open-source tool to view and edit Exif data in the browser. It uses the C library libexif-wasm compiled to WebAssembly.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "As of right now, only JPEG images are supported since libexif does not support TIFF images.",
  },
  {
    question:
      "Why should I use this over a specialized tool like ExifTool or Adobe Lightroom?",
    answer:
      "Realistically, if you are a photographer or someone who edits images, you probably should be using a specialized tool for the job. This is more a service for those who want to quickly add a little bit of metadata to their images quickly online without having to upload them to someone's server.",
  },
  {
    question: "What image metadata can be edited?",
    answer:
      "Only the Exif standard 2.1 and most of 2.2 are supported. Other metadata that may be stored, such as XMP, are not supported.",
  },
  {
    question: "How do I read Exif data from a link?",
    answer: (
      <span>
        {"You can open a link with a url search parameter like this: "}
        <Link
          href=""
          render={(props) => {
            if (!("href" in props)) {
              throw new Error("Not an anchor element!");
            }
            return (
              <RouterLink
                to="/viewer"
                search={{
                  url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg",
                }}
                {...props}
              >
                http://exifi.io/viewer?url=https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg
              </RouterLink>
            );
          }}
        />
        {"."}
      </span>
    ),
  },
];

const HomeComponent = () => {
  return (
    <div className="container py-8">
      <div className="grid max-h-dvh min-h-80 place-content-center gap-8">
        <Heading level={1} size="4xl">
          View and edit Exif data locally
        </Heading>
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <Link
            href=""
            render={(props, renderProps) => {
              if (!("href" in props)) {
                throw new Error("Not an anchor element!");
              }
              return (
                <RouterLink
                  {...props}
                  to="/viewer"
                  className={buttonVariants({
                    color: "accent",
                    ...renderProps,
                  })}
                />
              );
            }}
          >
            View
          </Link>
          <Link
            href=""
            render={(props, renderProps) => {
              if (!("href" in props)) {
                throw new Error("Not an anchor element!");
              }
              return (
                <RouterLink
                  {...props}
                  to="/editor"
                  className={buttonVariants({
                    variant: "ghost",
                    ...renderProps,
                  })}
                />
              );
            }}
          >
            Edit
          </Link>
        </div>
      </div>
      <div className="pt-16">
        <div className="text-center">
          <Heading level={2} size="3xl">
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
      <div className="py-16">
        <div className="text-center">
          <Heading level={2} size="3xl">
            FAQ
          </Heading>
        </div>
        <div className="mt-12">
          <Accordion variant="enclosed" allowsMultipleExpanded>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question}>
                <AccordionHeader>{faq.question}</AccordionHeader>
                <AccordionPanel className="text-fg-muted">
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

const Route = createFileRoute("/")({
  component: HomeComponent,
});

export { Route };
