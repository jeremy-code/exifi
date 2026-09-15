import { defineConfig } from "oxfmt";

const oxfmtConfig = defineConfig({
  printWidth: 80,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: "all",
  sortImports: {
    groups: [
      ["react", "builtin"],
      "external",
      ["internal", "subpath"],
      ["parent", "sibling", "index"],
      "unknown",
    ],
    customGroups: [
      {
        groupName: "react",
        elementNamePattern: ["react", "react-dom", "react-dom/*"],
      },
    ],
    internalPattern: ["@exifi/"],
    ignoreCase: false,
    newlinesBetween: true,
    order: "asc",
  },
  sortPackageJson: true,
  sortTailwindcss: {
    stylesheet: "./packages/ui/src/globals.css",
    functions: ["cx", "cn", "cnMerge", "tv", "twMerge"],
  },
  ignorePatterns: ["{apps,packages}/*/src/generated/"],
});

export default oxfmtConfig;
