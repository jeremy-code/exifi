import { useEffect, useRef } from "react";

import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { useShallow } from "zustand/react/shallow";

import { FileTabs } from "#components/tabs/FileTabs";
import { useFileTabsStore } from "#stores/fileTabsStore";
import { getFileFromResponse } from "#utils/getFileFromResponse";

const appLayoutSearchSchema = z.object({
  url: z.url().optional().catch(undefined),
});

const AppLayoutComponent = () => {
  const isTabUpdatedRef = useRef(false);
  const { url } = Route.useSearch();
  const navigate = useNavigate();
  const { activeTabId, updateTab } = useFileTabsStore(
    useShallow((state) => ({
      activeTabId: state.activeTabId,
      updateTab: state.updateTab,
    })),
  );

  useEffect(() => {
    if (url !== undefined && isTabUpdatedRef.current === false) {
      const abortController = new AbortController();

      void fetch(url, { signal: abortController.signal })
        .then((response) => getFileFromResponse(response))
        .then((file) => updateTab({ id: activeTabId, file }))
        .then(() =>
          // This way, opening a new tab when URL is set doesn't immediately get
          // overwritten
          navigate({
            to: ".",
            search: ({ url, ...prev }) => prev,
          }),
        );

      return () => abortController.abort();
    }
  }, [activeTabId, navigate, updateTab, url]);

  return (
    <FileTabs>
      <Outlet />
    </FileTabs>
  );
};

const Route = createFileRoute("/_app")({
  validateSearch: appLayoutSearchSchema,
  component: AppLayoutComponent,
  ssr: false,
});

export { Route };
