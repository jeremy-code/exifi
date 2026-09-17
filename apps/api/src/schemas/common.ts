import * as z from "zod";

const appErrorSchema = z.object({
  error: z.string(),
});

export { appErrorSchema };
