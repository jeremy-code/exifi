import {
  TanStackDevtools,
  type TanStackDevtoolsReactInit,
  type TanStackDevtoolsReactPlugin,
} from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { pacerDevtoolsPlugin } from "@tanstack/react-pacer-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

const devtoolsPlugins = [
  {
    name: "TanStack Query",
    render: <ReactQueryDevtoolsPanel />,
  },
  {
    name: "TanStack Router",
    render: <TanStackRouterDevtoolsPanel />,
  },
  formDevtoolsPlugin(),
  pacerDevtoolsPlugin(),
] satisfies TanStackDevtoolsReactPlugin[];

const Devtools = ({ plugins, ...props }: TanStackDevtoolsReactInit) => {
  return (
    <TanStackDevtools
      plugins={[...devtoolsPlugins, ...(plugins ?? [])]}
      {...props}
    />
  );
};

export { Devtools };
