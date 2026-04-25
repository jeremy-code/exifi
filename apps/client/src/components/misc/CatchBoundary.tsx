import { type MouseEvent } from "react";

import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
} from "@tanstack/react-router";
import { ChevronLeft, TriangleAlert } from "lucide-react";

import { Button } from "@exifi/ui/components/Button";
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
          <div className="grid size-13 place-content-center rounded-lg border bg-muted">
            <TriangleAlert className="size-8" />
          </div>
          <Heading as="h1" size="2xl">
            An error occurred!
          </Heading>
          <p>An unexpected error occurred while the application was running.</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted">
            <ErrorComponent error={error} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="surface" onClick={() => reset()}>
            Try Again
          </Button>
          {isRoot ?
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
          : <Button
              variant="ghost"
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              <ChevronLeft size={16} />
              Go Back
            </Button>
          }
        </CardFooter>
      </Card>
    </div>
  );
};

export { CatchBoundary };
