import { Suspense, type ComponentPropsWithRef } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { cn } from "tailwind-variants";

import { FileInformation } from "#components/file/FileInformation";
import { m } from "#paraglide/messages";
import { Callout, CalloutText } from "@exifi/ui/components/Callout";
import { Link } from "@exifi/ui/components/Link";
import { Skeleton } from "@exifi/ui/components/Skeleton";

import { ExifEditorContent } from "./ExifEditorContent";

type ExifEditorProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifEditor = ({ file, className, ...props }: ExifEditorProps) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {file.type === "image/heif" ||
      file.type === "image/heic" ||
      file.type === "image/avif" ? (
        <Callout variant="surface" color="yellow" className="mb-2 w-full">
          <CalloutText>
            <span>
              <ParaglideMessage
                message={m.editor_heif_callout}
                markup={{
                  issueLink: ({ children }) => (
                    <Link
                      className="text-current"
                      underline
                      href="https://github.com/jeremy-code/exifi/issues/13"
                    >
                      {children}
                    </Link>
                  ),
                }}
              />
            </span>
          </CalloutText>
        </Callout>
      ) : null}

      <FileInformation file={file} />
      <Suspense fallback={<Skeleton className="h-50 w-full" />}>
        <ExifEditorContent file={file} />
      </Suspense>
    </div>
  );
};

export { ExifEditor };
