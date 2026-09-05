import { useHydrated } from "@tanstack/react-router";
import { Moon, RefreshCw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { cn } from "tailwind-variants";

import {
  SwitchTrack,
  SwitchHandle,
  type SwitchProps,
  SwitchRoot,
} from "@exifi/ui/components/Switch";

type ThemeToggleProps = SwitchProps;

const ThemeToggle = ({
  children,
  switchTrackProps,
  ...props
}: ThemeToggleProps) => {
  // Prevent hydration error and layout shift as theme must be resolved from
  // `localStorage`
  const isHydrated = useHydrated();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [ThemeIcon, themeIconLabel] = isHydrated
    ? isDark
      ? [Moon, "Switch to light theme"]
      : [Sun, "Switch to dark theme"]
    : [RefreshCw, "Loading"];

  return (
    <SwitchRoot
      // Light mode or not mounted = unchecked, Dark mode = checked
      isSelected={isHydrated && isDark}
      onChange={(isSelected) => {
        if (isHydrated) {
          setTheme(isSelected ? "dark" : "light");
        }
      }}
      isDisabled={!isHydrated}
      aria-label={themeIconLabel}
      {...props}
    >
      {composeRenderProps(children, (children, renderProps) => (
        <>
          <SwitchTrack
            renderProps={renderProps}
            {...switchTrackProps}
            className={cn(
              switchTrackProps?.className,
              "group-selected/switch:group-pressed/switchring-neutral group-selected/switch:bg-bg-muted group-selected/switch:ring-border group-selected/switch:group-hover/switch:ring-fg-subtle",
            )}
          >
            <SwitchHandle className="bg-bg text-gray-600 dark:text-gray-50">
              <ThemeIcon
                className={cn("size-4", { "animate-spin": !isHydrated })}
                aria-hidden
              />
            </SwitchHandle>
          </SwitchTrack>
          {children}
        </>
      ))}
    </SwitchRoot>
  );
};

export { ThemeToggle, type ThemeToggleProps };
