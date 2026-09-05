import type { UseThemeProps } from "next-themes";
import { describe, expect, vi, test, beforeEach } from "vitest";
import { render } from "vitest-browser-react";

import { ThemeToggle } from "./ThemeToggle";

let mockResolvedTheme = "light";
const mockSetTheme = vi.fn<UseThemeProps["setTheme"]>();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders light mode state correctly", async () => {
    mockResolvedTheme = "light";

    const screen = await render(<ThemeToggle data-testid="theme-toggle" />);

    expect(screen.getByLabelText("Switch to dark theme")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).not.toHaveAttribute(
      "data-selected",
      "true",
    );
  });

  test("renders dark mode state correctly", async () => {
    mockResolvedTheme = "dark";

    const screen = await render(<ThemeToggle data-testid="theme-toggle" />);

    expect(screen.getByLabelText("Switch to light theme")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });
});
