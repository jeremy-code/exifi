import type { NotFoundRouteProps } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { Link } from "#/components/common/Link";
import { m } from "#paraglide/messages";
import { Button, buttonVariants } from "@exifi/ui/components/Button";
import { Heading } from "@exifi/ui/components/Heading";

const NotFound = (props: NotFoundRouteProps) => {
  console.warn(
    `Route ${props.routeId} was ${props.isNotFound ? "not found" : "found"} with data ${JSON.stringify(props.data)}`,
  );

  return (
    <main className="container flex flex-col justify-center gap-8 py-4">
      <img
        alt="Illustration of a flying saucer beaming up a cyclopean alien while another alien watches from the ground."
        className="mx-auto aspect-[auto_17/20] max-w-[min(100%,36svh)]"
        src="/static/not-found.webp"
      />
      <div className="flex flex-col items-start justify-center gap-2 sm:items-center">
        <Heading level={1} size="4xl">
          {m["notFound.title"]()}
        </Heading>
        <p className="text-muted-foreground mb-4">
          {m["notFound.description"]()}
        </p>
        <div role="group" className="flex gap-2">
          <Link
            underline={false}
            className={(renderProps) =>
              buttonVariants({
                ...renderProps,
                color: "accent",
                className: "cursor-default",
              })
            }
            to="/"
          >
            {m["navigation.home"]()}
          </Link>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ChevronLeft className="size-4" />
            {m["common.goBack"]()}
          </Button>
        </div>
      </div>
    </main>
  );
};
export { NotFound };
