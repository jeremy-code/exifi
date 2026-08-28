import {
  ErrorComponent,
  type ErrorComponentProps,
  Link as RouterLink,
  rootRouteId,
  useMatch,
} from "@tanstack/react-router";
import { ChevronLeft, TriangleAlert } from "lucide-react";

import { Button, buttonVariants } from "@exifi/ui/components/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@exifi/ui/components/Card";
import { Heading } from "@exifi/ui/components/Heading";
import { Link } from "@exifi/ui/components/Link";

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
            An error occurred!
          </Heading>
          <p>An unexpected error occurred while the application was running.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-bg-muted">
            <ErrorComponent error={error} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="surface" onPress={() => reset()}>
            Try Again
          </Button>
          {isRoot ? (
            <Link
              href=""
              render={(props, renderProps) => {
                if (!("href" in props)) {
                  throw new Error("Not an anchor element!");
                }
                return (
                  <RouterLink
                    {...props}
                    to="/"
                    className={buttonVariants({
                      variant: "ghost",
                      ...renderProps,
                    })}
                  />
                );
              }}
            >
              Home
            </Link>
          ) : (
            <Button variant="ghost" onPress={() => window.history.back()}>
              <ChevronLeft size={16} />
              Go Back
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export { CatchBoundary };
