import base from "@exiftools/eslint-config";
/** @import { Linter } from "eslint" */

/**
 * @satisfies {Linter.Config[]}
 */
export default [{ ignores: ["apps/*", "packages/*"], ...base }];
