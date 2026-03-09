import { type RouteObject } from "react-router";

import { Layout } from "#pages/Layout";
import { EditorPage } from "#pages/editor/EditorPage";
import { HomePage } from "#pages/home/HomePage";
import { ViewerPage } from "#pages/viewer/ViewerPage";

const routes = [
  {
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "viewer", Component: ViewerPage },
      { path: "editor", Component: EditorPage },
    ],
  },
] satisfies RouteObject[];

export { routes };
