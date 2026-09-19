import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";

import { paraglideMiddleware } from "#paraglide/server";

const fetch = createStartHandler({ handler: defaultStreamHandler });

export default {
  fetch(request: Request) {
    return paraglideMiddleware(request, () => fetch(request));
  },
};
