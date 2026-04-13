import type { ComponentPropsWithRef } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";

import { useDropzoneStore } from "#hooks/useDropzoneStore";
import { getFileFromResponse } from "#utils/getFileFromResponse";
import { Button, type ButtonProps } from "@exiftools/ui/components/Button";
import { Input, type InputProps } from "@exiftools/ui/components/Input";
import { Spinner } from "@exiftools/ui/components/Spinner";
import { toast } from "@exiftools/ui/hooks/useToast";

type FieldValues = {
  fileUrl: string;
};

type FileUrlInputProps = {
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
} & ComponentPropsWithRef<"form">;

const FileUrlInput = ({
  inputProps,
  buttonProps,
  ...props
}: FileUrlInputProps) => {
  const { register, handleSubmit, formState } = useForm<FieldValues>();

  const addAcceptedFiles = useDropzoneStore((state) => state.addAcceptedFiles);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const response = await fetch(data.fileUrl);
    if (!response.ok) {
      toast({
        title: "Fetching from URL failed",
        description: `Fetching ${data.fileUrl} failed with error code ${response.status}.`,
        variant: "destructive",
      });
      return;
    }
    const file = await getFileFromResponse(response);
    addAcceptedFiles([file]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <div className="flex">
        <Input
          type="url"
          className="rounded-r-none border-r-0"
          {...inputProps}
          {...register("fileUrl", {
            required: true,
            // May be overkill, since "type" is already set to "url"
            validate: (data) => URL.canParse(data),
          })}
        />
        <Button
          type="submit"
          variant="surface"
          className="rounded-l-none"
          disabled={formState.isSubmitting}
          {...buttonProps}
        >
          {formState.isSubmitting && <Spinner className="absolute" />}
          <span
            className="data-[pending=true]:invisible"
            data-pending={formState.isSubmitting}
          >
            Upload
          </span>
        </Button>
      </div>
    </form>
  );
};

export { FileUrlInput, type FileUrlInputProps };
