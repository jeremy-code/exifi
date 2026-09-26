import { flushSync } from "react-dom";

import { X } from "lucide-react";
import {
  UNSTABLE_ToastRegion as AriaToastRegion,
  type ToastRegionProps as AriaToastRegionProps,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastContent as ToastContent,
  type ToastProps as AriaToastProps,
  Button,
  type ButtonProps,
  Text,
} from "react-aria-components/Toast";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv, type VariantProps } from "tailwind-variants";

import { focusRing } from "../utils/focusRing";

type ToastInfo = {
  title: string;
  description?: string;
  toastProps?: Omit<ToastProps, "toast">;
};

const toastQueue = new ToastQueue<ToastInfo>({
  wrapUpdate(fn) {
    if ("startViewTransition" in document) {
      const viewTransition = document.startViewTransition(() => {
        flushSync(fn);
      });
      viewTransition.ready.catch((error) => {
        // Handle AbortError exception
        // https://github.com/jeremy-code/exifi/actions/runs/34803984796/job/103852091433
        if (error instanceof DOMException && error.name === "AbortError") {
        } else {
          throw error;
        }
      });
    } else {
      fn();
    }
  },
});

const toastRegionVariants = tv({
  extend: focusRing,
  base: [
    "fixed inset-x-4 bottom-4 z-2000 flex flex-col-reverse gap-2 rounded-lg sm:justify-self-end",
  ],
});

type ToastRegionProps = Omit<
  AriaToastRegionProps<ToastInfo>,
  "queue" | "children"
>;

const ToastRegion = (props: ToastRegionProps) => {
  return (
    <AriaToastRegion
      queue={toastQueue}

      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        toastRegionVariants({ ...renderProps, className }),
      )}
    >
      {({ toast }) => <Toast toast={toast} {...toast.content.toastProps} />}
    </AriaToastRegion>
  );
};

const closeToastButtonVariants = tv({
  base: [
    "flex size-8 flex-none appearance-none items-center justify-center rounded-sm bg-transparent outline-none [-webkit-tap-highlight-color:transparent]",
  ],
  variants: {
    isHovered: {
      true: "bg-white/20",
    },
    isPressed: {
      true: "bg-white/30",
    },
    isFocusVisible: {
      true: "outline-2 outline-offset-2 outline-current [--tw-outline-style:solid] forced-colors:outline-[Highlight]",
    },
  },
});

const CloseToastButton = (props: ButtonProps) => {
  return (
    <Button
      slot="close"
      aria-label="Close"
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        closeToastButtonVariants({ className, ...renderProps }),
      )}
    >
      <X aria-disabled className="size-4" />
    </Button>
  );
};

const toastRootVariants = tv({
  extend: focusRing,
  base: [
    "flex items-center gap-4 rounded-lg px-4 py-3 sm:w-100",
    "[view-transition-class:toast]",
    "forced-colors:outline",
  ],
  variants: {
    variant: {
      solid: "bg-(--color-600) text-(--color-50)",
      subtle: [
        "bg-(--color-100) text-(--color-800)",
        "dark:bg-(--color-900) dark:text-(--color-50)",
      ],
      surface: [
        "border",
        "border-(--color-300) bg-(--color-100) text-(--color-800)",
        "dark:border-(--color-700) dark:bg-(--color-900) dark:text-(--color-50)",
      ],
    },
    color: {
      gray: "[--color-50:var(--color-gray-50)] [--color-100:var(--color-gray-100)] [--color-300:var(--color-gray-300)] [--color-600:var(--color-gray-600)] [--color-700:var(--color-gray-700)] [--color-800:var(--color-gray-800)] [--color-900:var(--color-gray-900)]",
      accent:
        "[--color-50:var(--color-accent-50)] [--color-100:var(--color-accent-100)] [--color-300:var(--color-accent-300)] [--color-600:var(--color-accent-600)] [--color-700:var(--color-accent-700)] [--color-800:var(--color-accent-800)] [--color-900:var(--color-accent-900)]",
      red: "[--color-50:var(--color-red-50)] [--color-100:var(--color-red-100)] [--color-300:var(--color-red-300)] [--color-600:var(--color-red-600)] [--color-700:var(--color-red-700)] [--color-800:var(--color-red-800)] [--color-900:var(--color-red-900)]",
    },
  },
  defaultVariants: {
    variant: "solid",
    color: "gray",
  },
});

type ToastProps = AriaToastProps<ToastInfo> &
  VariantProps<typeof toastRootVariants>;

const Toast = ({ toast, ...props }: ToastProps) => {
  return (
    <ToastRoot toast={toast} {...props}>
      <ToastContent className="flex min-w-0 flex-1 flex-col">
        <Text slot="title" className="text-sm font-semibold">
          {toast.content.title}
        </Text>
        {toast.content.description && (
          <Text slot="description" className="text-xs">
            {toast.content.description}
          </Text>
        )}
      </ToastContent>
      <CloseToastButton />
    </ToastRoot>
  );
};

const ToastRoot = ({ color, variant, ...props }: ToastProps) => {
  return (
    <AriaToast
      {...props}
      style={composeRenderProps(props.style, (style) => ({
        viewTransitionName: props.toast.key,
        ...style,
      }))}
      className={composeRenderProps(props.className, (className, renderProps) =>
        toastRootVariants({ className, color, variant, ...renderProps }),
      )}
    />
  );
};

export {
  type ToastInfo,
  toastQueue,
  ToastRegion,
  type ToastRegionProps,
  toastRegionVariants,
  Toast,
  type ToastProps,
  ToastRoot,
};
