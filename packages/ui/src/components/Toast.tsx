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
      document.startViewTransition(() => {
        flushSync(fn);
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

const ToastRegion = ({ className, ...props }: ToastRegionProps) => {
  return (
    <AriaToastRegion
      queue={toastQueue}
      className={composeRenderProps(className, (className, renderProps) =>
        toastRegionVariants({ ...renderProps, className }),
      )}
      {...props}
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
      true: "bg-white/15",
    },
    isPressed: {
      true: "bg-white/20",
    },
    isFocusVisible: {
      true: "outline-2 outline-offset-2 outline-current outline-solid forced-colors:outline-[Highlight]",
    },
  },
});

const CloseToastButton = ({ className, ...props }: ButtonProps) => {
  return (
    <Button
      slot="close"
      aria-label="Close"
      className={composeRenderProps(className, (className, renderProps) =>
        closeToastButtonVariants({ className, ...renderProps }),
      )}
      {...props}
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
    color: {
      default: "bg-bg-muted text-fg",
      accent: "bg-accent text-accent-fg",
      destructive: "bg-destructive text-destructive-fg",
    },
  },
  defaultVariants: {
    color: "default",
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

const ToastRoot = ({ className, color, ...props }: ToastProps) => {
  return (
    <AriaToast
      {...props}
      style={composeRenderProps(props.style, (style) => ({
        viewTransitionName: props.toast.key,
        ...style,
      }))}
      className={composeRenderProps(className, (className, renderProps) =>
        toastRootVariants({ className, color, ...renderProps }),
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
