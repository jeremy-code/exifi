import { useHydrated } from "@tanstack/react-router";
import { Moon, RefreshCw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "tailwind-variants";

import { m } from "#paraglide/messages";
import { type SwitchProps, Switch } from "@exifi/ui/components/Switch";

type ThemeToggleProps = SwitchProps;

const ThemeToggle = ({
  switchTrackProps,
  switchHandleProps,
  ...props
}: ThemeToggleProps) => {
  // Prevent hydration error and layout shift as theme must be resolved from
  // `localStorage`
  const isHydrated = useHydrated();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [ThemeIcon, themeIconLabel] = isHydrated
    ? isDark
      ? [Moon, m["themeToggle.darkThemeLabel"]()]
      : [Sun, m["themeToggle.lightThemeLabel"]()]
    : [RefreshCw, m["common.loading"]()];

  return (
    <Switch
      // Light mode or not mounted = unchecked, Dark mode = checked
      isSelected={isDark}
      onChange={(isSelected) => {
        if (isHydrated) {
          setTheme(isSelected ? "dark" : "light");
        }
      }}
      isDisabled={!isHydrated}
      aria-label={themeIconLabel}
      switchTrackProps={{ color: "gray", ...switchTrackProps }}
      switchHandleProps={{
        children: (
          <ThemeIcon
            className={cn("size-4", { "animate-spin": !isHydrated })}
            aria-hidden
          />
        ),
        ...switchHandleProps,
        className: cn(
          "bg-bg text-gray-600 dark:text-gray-50",
          switchHandleProps?.className,
        ),
      }}
      {...props}
    />
  );
};

export { ThemeToggle, type ThemeToggleProps };
