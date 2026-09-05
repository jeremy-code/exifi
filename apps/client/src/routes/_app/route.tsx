import { Outlet, createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

import { FileTabs } from "#components/tabs/FileTabs";
import { useFileTabsStore } from "#stores/fileTabsStore";
import { getFileFromResponse } from "#utils/getFileFromResponse";
import { toastQueue } from "@exifi/ui/components/Toast";
import { assertNever } from "@exifi/utils/assertNever";

const appLayoutSearchSchema = z.object({
  url: z.url().optional().catch(undefined),
});

const AppLayoutComponent = () => {
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
  loaderDeps: ({ search: { url } }) => ({ url }),
  loader: async ({ abortController, deps }) => {
    if (deps.url !== undefined) {
      try {
        const response = await fetch(deps.url, {
          signal: abortController.signal,
        });
        const file = await getFileFromResponse(response);
        useFileTabsStore.getState().updateTab({
          id: useFileTabsStore.getState().activeTabId,
          file,
        });
      } catch (error) {
        if (!(error instanceof Error)) {
          assertNever(error as never);
        }

        if (!(error instanceof DOMException && error.name === "AbortError")) {
          toastQueue.add({
            title: "Fetching from URL failed",
            description: `Fetching ${deps.url} failed with error ${error.message}.`,
            toastProps: {
              color: "destructive",
            },
          });
        }
      }
    }
  },
});

export { Route };
