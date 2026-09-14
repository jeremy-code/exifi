import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const composeTailwindRenderProps = <T>(
  classNameOrClassNameFn: string | ((renderProps: T) => string) | undefined,
  tw: ClassNameValue,
): string | ((v: T) => string) => {
  return composeRenderProps(classNameOrClassNameFn, (className) =>
    twMerge(tw, className),
  );
};

export { composeTailwindRenderProps };
