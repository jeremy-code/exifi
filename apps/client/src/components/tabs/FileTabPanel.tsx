import type { ComponentPropsWithRef, ReactNode } from "react";

import { Link as RouterLink } from "@tanstack/react-router";

import { Dropzone } from "#components/file/Dropzone";
import { FileUrlInput } from "#components/file/FileUrlInput";
import { FileProvider } from "#contexts/FileContext";
import { useDropzoneStore } from "#stores/dropzoneStore";
import { Heading } from "@exifi/ui/components/Heading";
import { Link } from "@exifi/ui/components/Link";
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
            Upload file to view Exif metadata
          </Heading>
          <p className="mb-4">
            {"For a quick demo, "}
            <Link
              href=""
              color="link"
              render={(props) => {
                if (!("href" in props)) {
                  throw new Error("Link is not an anchor element");
                }

                return (
                  <RouterLink
                    to="."
                    search={{
                      url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg",
                    }}
                    {...props}
                  >
                    click here
                  </RouterLink>
                );
              }}
            ></Link>
            {"."}
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
            OR
          </div>
          <FileUrlInput
            onSuccess={(file) => {
              updateFile(file);
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
