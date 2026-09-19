import type { ComponentPropsWithRef } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { cn } from "tailwind-variants";

import { m } from "#paraglide/messages";
import { buttonVariants } from "@exifi/ui/components/Button";
import { Link } from "@exifi/ui/components/Link";
import { Github } from "@exifi/ui/components/icons/Github";

const Footer = ({ className, ...props }: ComponentPropsWithRef<"footer">) => {
  return (
    <footer className={cn("shrink border-t", className)} {...props}>
      <div className="container flex items-center justify-between gap-2 py-4">
        <span className="text-balance">
          <ParaglideMessage
            message={m["footer.content"]}
            markup={{
              link: (linkProps) => (
                <Link
                  className="inline"
                  color="blue"
                  underline="hover"
                  href="https://jeremy.ng"
                  {...linkProps}
                />
              ),
            }}
          />
        </span>
        <Link
          underline={false}
          className={(renderProps) => buttonVariants({ ...renderProps })}
          href="https://github.com/jeremy-code/exifi"
        >
          <Github aria-hidden className="size-4 fill-current stroke-0" />
          {m.spare_each_poodle_push()}
        </Link>
      </div>
    </footer>
  );
};

export { Footer };
