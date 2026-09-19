import type { ComponentPropsWithRef, ReactNode } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";

import { Link as RouterLink } from "#components/common/Link";
import { Dropzone } from "#components/file/Dropzone";
import { FileUrlInput } from "#components/file/FileUrlInput";
import { FileProvider } from "#contexts/FileContext";
import { m } from "#paraglide/messages";
import { useDropzoneStore } from "#stores/dropzoneStore";
import { Heading } from "@exifi/ui/components/Heading";
import { TabPanel } from "@exifi/ui/components/Tabs";

type FileTabPanelProps = {
  file: File | null;
  id: string;
  updateFile: (file: File) => void;
  uploadFiles: (files: File[]) => void;
  children: ReactNode;
} & Omit<ComponentPropsWithRef<typeof TabPanel>, "id">;

const FileTabPanel = ({
  children,
  id,
  file,
  updateFile,
  uploadFiles,
  ...props
}: FileTabPanelProps) => {
  const reset = useDropzoneStore((state) => state.resetAcceptedFiles);

  return (
    <TabPanel {...props} id={id}>
      {file === null ? (
        <div className="flex flex-col gap-2">
          <Heading level={1} size="2xl" className="mb-1">
            {m.trick_jolly_gopher_foster()}
          </Heading>
          <p className="mb-4">
            <ParaglideMessage
              message={m.curly_spicy_cougar_feast}
              markup={{
                link: (linkProps) => (
                  <RouterLink
                    {...linkProps}
                    color="link"
                    to="."
                    search={{
                      url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg",
                    }}
                  />
                ),
              }}
            />
          </p>

          <Dropzone
            dropzoneOptions={{
              onDropAccepted: (acceptedFiles) => {
                if (acceptedFiles.length === 0) {
                  return;
                }
                const acceptedFile = acceptedFiles.at(0);
                if (acceptedFile) {
                  updateFile(acceptedFile);
                  reset();
                }

                if (acceptedFiles.length > 1) {
                  uploadFiles(acceptedFiles.slice(1));
                }
              },
            }}
            rootProps={{ className: "min-h-25" }}
          />

          <div className="flex items-center gap-4 text-fg-muted before:h-px before:grow before:bg-bg-muted after:h-px after:grow after:bg-bg-muted">
            {m.clean_that_penguin_file()}
          </div>
          <FileUrlInput
            onSuccess={(nextFile) => {
              updateFile(nextFile);
              reset();
            }}
            textFieldProps={{
              placeholder:
                "https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg",
            }}
          />
        </div>
      ) : (
        <FileProvider initialFile={file}>{children}</FileProvider>
      )}
    </TabPanel>
  );
};

export { FileTabPanel, type FileTabPanelProps };
