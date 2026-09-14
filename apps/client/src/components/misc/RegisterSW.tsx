import { useEffect } from "react";

import type { Serwist } from "@serwist/window";
import { getSerwist } from "virtual:serwist";

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
                title: "Ready to work offline",
                description:
                  "exifi has been cached and can now be used without an internet connection.",
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
