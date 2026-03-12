import {
  TanStackDevtools,
  type TanStackDevtoolsReactInit,
  type TanStackDevtoolsReactPlugin,
} from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

const devtoolsPlugins = [
  {
    name: "TanStack Query",
    // https://github.com/TanStack/devtools/blob/main/packages/devtools-utils/src/react/plugin.tsx
    render: (_el, theme) => <ReactQueryDevtoolsPanel theme={theme} />,
  },
] satisfies TanStackDevtoolsReactPlugin[];

const Devtools = (props: TanStackDevtoolsReactInit) => {
  return <TanStackDevtools plugins={devtoolsPlugins} {...props} />;
};

export { Devtools };
