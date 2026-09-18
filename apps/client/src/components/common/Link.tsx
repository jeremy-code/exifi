import { createLink, type LinkComponent } from "@tanstack/react-router";
import type { JSX } from "react/jsx-runtime";

import {
  Link as UiLink,
  type LinkProps as UiLinkProps,
} from "@exifi/ui/components/Link";

const Link: LinkComponent<(props: UiLinkProps) => JSX.Element> =
  createLink(UiLink);

export { Link };
