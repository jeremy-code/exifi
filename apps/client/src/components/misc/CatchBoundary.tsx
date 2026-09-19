import {
  ErrorComponent,
  type ErrorComponentProps,
  rootRouteId,
  useMatch,
} from "@tanstack/react-router";
import { ChevronLeft, TriangleAlert } from "lucide-react";

import { Link as RouterLink } from "#/components/common/Link";
import { m } from "#paraglide/messages";
import { Button, buttonVariants } from "@exifi/ui/components/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@exifi/ui/components/Card";
import { Heading } from "@exifi/ui/components/Heading";

const CatchBoundary = ({ error, reset }: ErrorComponentProps) => {
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  return (
    <div className="container my-auto">
      <Card>
        <CardHeader>
          <div className="grid size-13 place-content-center rounded-lg border bg-bg-muted">
            <TriangleAlert className="size-8" />
          </div>
          <Heading level={1} size="2xl">
            {m["catchBoundary.title"]()}
          </Heading>
          <p>{m["catchBoundary.title"]()}</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-bg-muted">
            <ErrorComponent error={error} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="surface" onPress={() => reset()}>
            {m["common.retry"]()}
          </Button>
          {isRoot ? (
            <RouterLink
              to="/"
              className={(renderProps) =>
                buttonVariants({ variant: "ghost", ...renderProps })
              }
            >
              {m["navigation.home"]()}
            </RouterLink>
          ) : (
            <Button variant="ghost" onPress={() => window.history.back()}>
              <ChevronLeft size={16} />
              {m["common.goBack"]()}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export { CatchBoundary };
