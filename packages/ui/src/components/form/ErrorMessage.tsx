import {
  Text,
  type TextProps as ErrorMessageProps,
} from "react-aria-components/Text";
import { cn } from "tailwind-variants";

const ErrorMessage = ({ className, ...props }: ErrorMessageProps) => {
  return (
    <Text
      slot="errorMessage"
      className={cn("text-sm text-red-600", className)}
      {...props}
    />
  );
};

export { ErrorMessage, type ErrorMessageProps };
