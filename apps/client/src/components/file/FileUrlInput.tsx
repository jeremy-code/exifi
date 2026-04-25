import type { ComponentPropsWithRef } from "react";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

import { useDropzoneStore } from "#hooks/useDropzoneStore";
import { getFileFromResponse } from "#utils/getFileFromResponse";
import { Button, type ButtonProps } from "@exifi/ui/components/Button";
import { Input, type InputProps } from "@exifi/ui/components/Input";
import { Spinner } from "@exifi/ui/components/Spinner";
import { toast } from "@exifi/ui/hooks/useToast";

type FileUrlInputProps = {
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
  onSuccess?: (file: File) => void;
} & ComponentPropsWithRef<"form">;

const FileUrlInput = ({
  inputProps,
  buttonProps,
  onSuccess,
  ...props
}: FileUrlInputProps) => {
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
      toast({
        title: "Fetching from URL failed",
        description: `Fetching ${variables} failed with error ${error.message}.`,
        variant: "destructive",
      });
    },
  });
  const form = useForm({
    defaultValues: { fileUrl: "" },
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
        <form.Field
          name="fileUrl"
          validators={{
            onChange: ({ value }) =>
              !URL.canParse(value) ? "Please enter a URL." : undefined,
          }}
          children={(field) => (
            <Input
              required
              type="url"
              className="rounded-r-none border-r-0"
              {...inputProps}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <Button
              type="submit"
              variant="surface"
              className="rounded-l-none"
              disabled={isSubmitting}
              {...buttonProps}
            >
              {isSubmitting && <Spinner className="absolute" />}
              <span
                className="data-[pending=true]:invisible"
                data-pending={isSubmitting}
              >
                Upload
              </span>
            </Button>
          )}
        />
      </div>
    </form>
  );
};

export { FileUrlInput, type FileUrlInputProps };
