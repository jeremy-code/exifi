import type { ComponentPropsWithRef } from "react";

import { basename } from "@std/path/basename";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useDropzoneState } from "#hooks/useDropzoneState";
import { Button, type ButtonProps } from "@exiftools/ui/components/Button";
import { Input, type InputProps } from "@exiftools/ui/components/Input";
import { Spinner } from "@exiftools/ui/components/Spinner";
import { toast } from "@exiftools/ui/hooks/useToast";

type FieldValues = {
  exifUrl: string;
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

  const addAcceptedFiles = useDropzoneState((state) => state.addAcceptedFiles);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const urlObject = new URL(data.exifUrl);
    const response = await fetch(urlObject);
    if (!response.ok) {
      toast({
        title: "Fetching from URL failed",
        description: `Fetching ${data.exifUrl} failed with error ${response.status}.`,
        variant: "destructive",
      });
      return;
    }
    const file = new File(
      [await response.blob()],
      basename(urlObject.pathname),
    );
    addAcceptedFiles([file]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...props}>
      <div className="flex">
        <Input
          type="url"
          className="rounded-r-none border-r-0"
          {...inputProps}
          {...register("exifUrl", {
            required: true,
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
