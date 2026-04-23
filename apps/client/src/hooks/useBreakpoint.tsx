import { useSyncExternalStore } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

type BreakpointWithUtility = Breakpoint | `max-${Breakpoint}`;

const useBreakpoint = (breakpoint: BreakpointWithUtility) => {
  const breakpointValue = window
    .getComputedStyle(document.body)
    .getPropertyValue(
      `--breakpoint-${breakpoint.startsWith("max-") ? breakpoint.slice("max-".length) : breakpoint}`,
    );
  const mediaQueryList =
    breakpoint.startsWith("max-") ?
      window.matchMedia(`(width < ${breakpointValue})`)
    : window.matchMedia(`(width >= ${breakpointValue})`);

  const matches = useSyncExternalStore(
    (onStoreChange) => {
      mediaQueryList.addEventListener("change", onStoreChange);

      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    () => mediaQueryList.matches,
  );

  return matches;
};

export { useBreakpoint };
