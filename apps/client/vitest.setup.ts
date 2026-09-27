import { locators } from "vitest/browser";

locators.extend({
  getByTerm(term) {
    return `dt:has-text("${term}") + dd`;
  },
});
