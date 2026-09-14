import { createFileRoute } from "@tanstack/react-router";
import { useDateFormatter } from "react-aria/useDateFormatter";

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
          Status
        </Heading>
        <p className="text-fg-muted">
          Licenses of bundled JavaScript dependencies can be found at{" "}
          <Link color="link" href="/license.md">
            {`${getBaseUrl()}/license.md`}
          </Link>
          {"."}
        </p>
      </div>
      <Card className="p-6">
        <DataList>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              Build time
            </DataListItemLabel>
            <DataListItemValue>
              <time dateTime={buildTimestampInstant.toString()}>
                {dateFormatter.format(buildTimestampInstant)}
              </time>
            </DataListItemValue>
          </DataListItem>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              libexif-wasm version
            </DataListItemLabel>
            <DataListItemValue>{__LIBEXIF_WASM_VERSION__}</DataListItemValue>
          </DataListItem>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">Commit</DataListItemLabel>
            <DataListItemValue>
              {import.meta.env.COMMIT_REF !== undefined &&
              import.meta.env.COMMIT_REF !== "" ? (
                <Link
                  isExternal
                  href={`https://www.github.com/jeremy-code/exifi/commit/${import.meta.env.COMMIT_REF}`}
                >
                  {import.meta.env.COMMIT_REF}
                </Link>
              ) : (
                "Unknown commit"
              )}
            </DataListItemValue>
          </DataListItem>
        </DataList>
      </Card>
    </div>
  );
};

const Route = createFileRoute("/status/")({
  head: () => ({
    meta: seo({
      title: "Status | exifi",
      description: "Exifi status page",
    }),
  }),
  component: StatusComponent,
});

export { Route };
