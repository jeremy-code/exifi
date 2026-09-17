// oxlint-disable-next-line import/no-unassigned-import -- Allow side effect imports only in server entrypoint
import "zod/compile";
import { rateLimiter } from "hono-rate-limiter";
import { every } from "hono/combine";
import { cors } from "hono/cors";
import { createFactory } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { timeout } from "hono/timeout";

import type { AppEnv } from "./interfaces/api";
import { appRoutes } from "./routes/appRoutes";

const factory = createFactory<AppEnv>({
  initApp: (app) => {
    app.use(
      "*",
      every(
        cors({
          origin: "*",
          allowMethods: ["GET", "POST", "OPTIONS"],
          allowHeaders: ["Content-Type"],
          maxAge: 86_400, // 24 hours
        }),
        secureHeaders(),
        logger(),
        rateLimiter({
          windowMs: 10 * 60 * 1000, // 10 minutes
          limit: 5,
          keyGenerator: (context) =>
            // https://answers.netlify.com/t/is-the-client-ip-header-going-to-be-supported-long-term/11203/2
            context.req.header("X-NF-Client-Connection-IP") ??
            context.req.header("X-Forwarded-For") ??
            crypto.randomUUID(),
          statusCode: 429 /* Too Many Requests */,
          message: { error: "Too many requests" },
        }),
        timeout(
          5_000, // 5 seconds
          new HTTPException(504 /* Gateway Timeout */, {
            res: new Response(JSON.stringify({ error: "Gateway timeout" }), {
              headers: { "Content-Type": "application/json" },
            }),
          }),
        ),
      ),
    );
    app.route("/", appRoutes);
  },
  defaultAppOptions: { strict: true },
});

const app = factory.createApp();

export default app;
