import {
  Label as AriaLabel,
  type LabelProps,
} from "react-aria-components/Label";
import { tv } from "tailwind-variants";

const labelVariants = tv({
  base: [
    "mb-1 flex items-center gap-1 text-start text-sm/5 font-medium text-fg",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    "data-disabled:cursor-not-allowed data-disabled:opacity-70",
    "group-data-invalid:text-red-600",
  ],
});

const Label = ({ className, ...props }: LabelProps) => (
  <AriaLabel className={labelVariants({ className })} {...props} />
);

export { Label, type LabelProps, labelVariants };
