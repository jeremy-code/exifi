import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { paraglideMiddleware } from "./paraglide/server";

// Server entrypoint is never used in production, only used when prerendering
// locale variants
const serverEntry = createServerEntry({
  fetch(request) {
    // TanStack Router handles URL rewriting via deLocalizeUrl/localizeUrl, so
    // the original Request is provided to the server entrypoint
    return paraglideMiddleware(request, () => handler.fetch(request));
  },
});

export default serverEntry;
