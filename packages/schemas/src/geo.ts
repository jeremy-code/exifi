import * as z from "zod";

const latitudeSchema = z
  .number()
  .min(-90, "Latitude must be at least -90 degrees.")
  .max(90, "Latitude must be less than or equal to 90 degrees.");

const longitudeSchema = z
  .number()
  .min(-180, "Longitude must be at least 180 degrees.")
  .max(180, "Longitude must be less than or equal to 180 degrees.");

export { longitudeSchema, latitudeSchema };
