import {
  FieldError as AriaFieldError,
  type FieldErrorProps,
  type FieldErrorRenderProps,
} from "react-aria-components/FieldError";

import { useLocalizedUiStringFormatter } from "../../hooks/useLocalizedStringFormatter";
import { composeTailwindRenderProps } from "../../utils/composeTailwindRenderProps";

type FieldErrorMessage =
  | string
  | ((validation: FieldErrorRenderProps) => string);

const FieldError = ({ className, children, ...props }: FieldErrorProps) => {
  const stringFormatter = useLocalizedUiStringFormatter();

  return (
    <AriaFieldError
      {...props}
      className={composeTailwindRenderProps(
        className,
        "text-sm text-red-600 forced-colors:text-[Mark]",
      )}
    >
      {/* Native validation messages (e.g. "Please fill out this field.") come from the browser locale */}
      {children ??
        (({ validationErrors, validationDetails }) => {
          if (validationDetails.customError) {
            return validationErrors.join(" ");
          }
          if (validationDetails.valueMissing) {
            return stringFormatter.format("field.valueMissing");
          }
          if (validationErrors.length > 0) {
            return stringFormatter.format("field.invalid");
          }
          return null;
        })}
    </AriaFieldError>
  );
};

export { FieldError, type FieldErrorProps, type FieldErrorMessage };
