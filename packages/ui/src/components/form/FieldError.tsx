import {
  FieldError as AriaFieldError,
  type FieldErrorProps,
  type FieldErrorRenderProps,
} from "react-aria-components/FieldError";

import { composeTailwindRenderProps } from "../../utils/composeTailwindRenderProps";

type FieldErrorMessage =
  | string
  | ((validation: FieldErrorRenderProps) => string);

const FieldError = ({ className, ...props }: FieldErrorProps) => {
  return (
    <AriaFieldError
      {...props}
      className={composeTailwindRenderProps(
        className,
        "text-sm text-destructive forced-colors:text-[Mark]",
      )}
    />
  );
};

export { FieldError, type FieldErrorProps, type FieldErrorMessage };
