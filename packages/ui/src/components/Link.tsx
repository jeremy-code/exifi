import { ExternalLink } from "lucide-react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components/Link";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { focusRing } from "../utils/focusRing";

const linkVariants = tv({
  extend: focusRing,
  base: [
    "inline-flex items-center gap-1 decoration-from-font underline-offset-1 transition-colors transition-discrete [-webkit-tap-highlight-color:transparent]",
    "disabled:cursor-default disabled:no-underline forced-colors:disabled:text-[GrayText]",
  ],
  variants: {
    underline: {
      true: "underline decoration-current/50 hover:decoration-current/80",
      false: "no-underline",
      hover:
        "decoration-transparent hover:underline hover:decoration-current/80",
    },
    color: {
      blue: "text-blue-600 dark:text-blue-500",
      link: [
        "text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400",
        /**
         * Unfortunately, there is currently a bug in Firefox where there is a
         * flicker when transitioning text colors on visited links.
         *
         * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=868975}
         */
        "visited:text-purple-600 visited:hover:text-purple-700 dark:visited:text-purple-500 dark:visited:hover:text-purple-400",
      ],
      default: "text-fg-bold",
    },
  },
  defaultVariants: {
    underline: "hover",
    color: "default",
  },
});

type LinkProps = {
  /**
   * Opens link in new tab and adds an {@link ExternalLink} icon.
   */
  isExternal?: boolean;
} & AriaLinkProps &
  VariantProps<typeof linkVariants>;

const Link = ({
  isExternal,
  className,
  underline,
  color,
  ...props
}: LinkProps) => {
  return (
    <AriaLink
      // target="_blank" implies rel="noopener": https://caniuse.com/mdn-html_elements_a_implicit_noopener
      {...(isExternal && { target: "_blank" })}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        linkVariants({ ...renderProps, className, underline, color }),
      )}
    >
      {composeRenderProps(props.children, (children) =>
        isExternal ? (
          <>
            {children}
            <ExternalLink className="size-[1em] flex-none" />
          </>
        ) : (
          children
        ),
      )}
    </AriaLink>
  );
};

export { Link, type LinkProps, linkVariants };
