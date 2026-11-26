import type { ComponentPropsWithRef } from "react";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useListFormatter } from "react-aria/useListFormatter";
import * as z from "zod";

import { m } from "#paraglide/messages";
import { useDropzoneStore } from "#stores/dropzoneStore";
import { getFileFromResponse } from "#utils/getFileFromResponse";
import { Button, type ButtonProps } from "@exifi/ui/components/Button";
import { ProgressCircle } from "@exifi/ui/components/ProgressCircle";
import { TextField, type TextFieldProps } from "@exifi/ui/components/TextField";
import { toastQueue } from "@exifi/ui/components/Toast";
import { composeTailwindRenderProps } from "@exifi/ui/utils/composeTailwindRenderProps";

type FileUrlInputProps = {
  textFieldProps?: TextFieldProps;
  buttonProps?: ButtonProps;
  onSuccess?: (file: File) => void;
} & ComponentPropsWithRef<"form">;

const FileUrlInput = ({
  textFieldProps,
  buttonProps,
  onSuccess,
  ...props
}: FileUrlInputProps) => {
  const listFormatter = useListFormatter({
    style: "short",
    type: "conjunction",
  });
  const addAcceptedFiles = useDropzoneStore((state) => state.addAcceptedFiles);
  const mutation = useMutation({
    mutationFn: async (input: string) => {
      const response = await fetch(input);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await getFileFromResponse(response);
    },
    mutationKey: ["FileUrlInput"],
    onSuccess: (data) => {
      addAcceptedFiles([data]);
      onSuccess?.(data);
    },
    onError: (error, variables) => {
      toastQueue.add(
        {
          title: m.files_url_input_error_title(),
          description: m.files_url_input_error_description({
            url: variables,
            message: error.message,
          }),
          toastProps: { color: "red" },
        },
        { timeout: 5_000 /* 5 seconds */ },
      );
    },
  });
  const form = useForm({
    defaultValues: { fileUrl: "" },
    validators: {
      onChange: z.strictObject({
        fileUrl: z.httpUrl({ error: () => m.files_url_input_invalid_url() }),
      }),
    },
    // Using mutateAsync so form.isSubmitting is true while fetching
    onSubmit: ({ value }) => mutation.mutateAsync(value.fileUrl),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      {...props}
    >
      <div className="flex">
        <form.Field name="fileUrl">
          {(field) => (
            <TextField
              isRequired
              type="url"
              aria-label={m.files_url_input_label()}
              {...textFieldProps}
              className={composeTailwindRenderProps(
                textFieldProps?.className,
                "flex-1",
              )}
              inputProps={{
                ...textFieldProps?.inputProps,
                className: composeTailwindRenderProps(
                  textFieldProps?.inputProps?.className,
                  "rounded-r-none border-r-0",
                ),
              }}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              isInvalid={!field.state.meta.isValid}
              errorMessage={
                field.state.meta.errors.length > 0
                  ? listFormatter.format(
                      field.state.meta.errors
                        .filter((issue) => issue !== undefined)
                        .map((issue) => issue.message),
                    )
                  : undefined
              }
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              type="submit"
              variant="surface"
              isDisabled={isSubmitting}
              {...buttonProps}
              className={composeTailwindRenderProps(
                buttonProps?.className,
                "rounded-l-none",
              )}
            >
              {isSubmitting && (
                <ProgressCircle isIndeterminate className="absolute" />
              )}
              <span
                className="data-[pending=true]:invisible"
                data-pending={isSubmitting}
              >
                {m.files_url_input_upload()}
              </span>
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
};

export { FileUrlInput, type FileUrlInputProps };
