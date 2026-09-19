import { useEffect } from "react";

import type { Serwist } from "@serwist/window";
import { getSerwist } from "virtual:serwist";

import { m } from "#paraglide/messages";
import { toastQueue } from "@exifi/ui/components/Toast";

const RegisterSW = () => {
  useEffect(() => {
    const abortController = new AbortController();

    const loadSerwist = async () => {
      if ("serviceWorker" in navigator) {
        const serwist: Serwist | undefined = await getSerwist();

        if (serwist !== undefined && !abortController.signal.aborted) {
          serwist.addEventListener("installed", () => {
            toastQueue.add(
              {
                title: m["serviceWorkerInstalled.title"](),
                description: m["serviceWorkerInstalled.description"](),
              },
              { timeout: 5_000 /* 5 seconds */ },
            );
          });

          await serwist.register();
        }
      }
    };

    void loadSerwist();

    return () => {
      abortController.abort();
    };
  }, []);

  return null;
};

export { RegisterSW };
