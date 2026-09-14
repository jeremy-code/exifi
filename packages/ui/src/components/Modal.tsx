import type { ComponentPropsWithRef } from "react";

import {
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps,
  Modal as AriaModal,
} from "react-aria-components/Modal";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";

const modalOverlayVariants = tv({
  base: "absolute top-0 left-0 isolate z-1500 h-(--page-height) w-full bg-black/50 text-center backdrop-blur-lg",
  variants: {
    isEntering: {
      true: "animate-in duration-200 ease-out fade-in-0",
    },
    isExiting: {
      true: "animate-out duration-200 ease-in fade-out-0",
    },
  },
});

const ModalOverlay = (props: ModalOverlayProps) => (
  <AriaModalOverlay
    {...props}
    className={composeRenderProps(props.className, (className, renderProps) =>
      modalOverlayVariants({ className, ...renderProps }),
    )}
  />
);

const modalWrapperVariants = tv({
  base: "sticky top-0 left-0 flex h-(--visual-viewport-height) w-full items-center justify-center",
});

type ModalWrapperProps = ComponentPropsWithRef<"div">;

const ModalWrapper = ({ className, ...props }: ModalWrapperProps) => (
  <div className={modalWrapperVariants({ className })} {...props} />
);

const modalVariants = tv({
  base: [
    "max-h-[min(calc(var(--visual-viewport-height)-2rem),--spacing(320))] max-w-[min(calc(var(--visual-viewport-width)-2rem),--spacing(320))]",
    "w-full rounded-md border border-border bg-surface bg-clip-padding text-left align-middle text-fg-bold shadow-2xl backdrop-blur-sm",
    "forced-colors:bg-[Canvas]",
  ],
  variants: {
    isEntering: {
      true: "animate-in duration-200 ease-out zoom-in-105",
    },
    isExiting: {
      true: "animate-out duration-200 ease-in zoom-out-95",
    },
  },
});

type ModalProps = ModalOverlayProps & {
  modalWrapperProps?: ModalWrapperProps;
  modalProps?: Omit<ModalOverlayProps, "children">;
};

const Modal = ({
  children,
  modalWrapperProps,
  modalProps,
  ...props
}: ModalProps) => {
  return (
    <ModalOverlay {...props}>
      <ModalWrapper {...modalWrapperProps}>
        <AriaModal
          {...props}
          {...modalProps}
          className={composeRenderProps(
            modalProps?.className,
            (className, renderProps) =>
              modalVariants({ className, ...renderProps }),
          )}
        >
          {children}
        </AriaModal>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export {
  ModalOverlay,
  type ModalOverlayProps,
  modalOverlayVariants,
  ModalWrapper,
  type ModalWrapperProps,
  modalWrapperVariants,
  Modal,
  type ModalProps,
  modalVariants,
};
