import { Suspense, type ComponentPropsWithRef } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { cn } from "tailwind-variants";

import { Link as RouterLink } from "#components/common/Link";
import { FileInformation } from "#components/file/FileInformation";
import { m } from "#paraglide/messages";
import { getLocale } from "#paraglide/runtime";
import { Callout, CalloutText } from "@exifi/ui/components/Callout";
import { Skeleton } from "@exifi/ui/components/Skeleton";

import { ExifViewerContent } from "./ExifViewerContent";

type ExifViewerProps = {
  file: File;
} & ComponentPropsWithRef<"div">;

const ExifViewer = ({ file, className, ...props }: ExifViewerProps) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {getLocale() !== "en" ? (
        <Callout variant="surface" color="yellow" className="mb-2 w-full">
          <CalloutText>
            <span>
              <ParaglideMessage
                message={m.viewer_english_callout}
                markup={{
                  editorLink: ({ children }) => (
                    <RouterLink
                      color="blue"
                      underline
                      to="/editor"
                      className="inline"
                    >
                      {children}
                    </RouterLink>
                  ),
                }}
              />
            </span>
          </CalloutText>
        </Callout>
      ) : null}
      <FileInformation file={file} />
      <Suspense fallback={<Skeleton className="h-50 w-full" />}>
        <ExifViewerContent file={file} />
      </Suspense>
    </div>
  );
};

export { ExifViewer, type ExifViewerProps };
