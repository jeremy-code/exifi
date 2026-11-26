import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { createFileRoute } from "@tanstack/react-router";
import { useDateFormatter } from "react-aria/useDateFormatter";

import { m } from "#paraglide/messages";
import { getBaseUrl } from "#utils/getBaseUrl";
import { seo } from "#utils/seo";
import { Card } from "@exifi/ui/components/Card";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exifi/ui/components/DataList";
import { Heading } from "@exifi/ui/components/Heading";
import { Link } from "@exifi/ui/components/Link";

const StatusComponent = () => {
  const dateFormatter = useDateFormatter();
  const buildTimestampInstant =
    Temporal.Instant.fromEpochMilliseconds(__BUILD_TIMESTAMP__);

  return (
    <div className="container flex flex-col gap-8 py-8">
      <div>
        <Heading level={1} size="2xl" className="mb-4">
          {m.layout_status_heading()}
        </Heading>
        <p className="text-fg-muted">
          <ParaglideMessage
            message={m.layout_status_licenses}
            inputs={{ licenseUrl: `${getBaseUrl()}/license.md` }}
            markup={{
              link: ({ children, options }) => (
                <Link color="link" href={options.href as string}>
                  {children}
                </Link>
              ),
            }}
          />
        </p>
      </div>
      <Card className="p-6">
        <DataList>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              {m.layout_status_build_time()}
            </DataListItemLabel>
            <DataListItemValue>
              <time dateTime={buildTimestampInstant.toString()}>
                {dateFormatter.format(buildTimestampInstant)}
              </time>
            </DataListItemValue>
          </DataListItem>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              {m.layout_status_libexif_version()}
            </DataListItemLabel>
            <DataListItemValue>{__LIBEXIF_WASM_VERSION__}</DataListItemValue>
          </DataListItem>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              {m.layout_status_commit()}
            </DataListItemLabel>
            <DataListItemValue>
              {import.meta.env.COMMIT_REF !== null ? (
                <Link
                  isExternal
                  href={`https://www.github.com/jeremy-code/exifi/commit/${import.meta.env.COMMIT_REF}`}
                >
                  {import.meta.env.COMMIT_REF}
                </Link>
              ) : (
                m.layout_status_unknown_commit()
              )}
            </DataListItemValue>
          </DataListItem>
        </DataList>
      </Card>
    </div>
  );
};

const Route = createFileRoute("/status")({
  head: () => ({
    meta: seo({
      title: m.layout_seo_status_title(),
      description: m.layout_seo_status_description(),
    }),
  }),
  component: StatusComponent,
});

export { Route };
