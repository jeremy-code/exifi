import { createFileRoute } from "@tanstack/react-router";
import { useDateFormatter } from "react-aria/useDateFormatter";

import { seo } from "#utils/seo";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exifi/ui/components/DataList";
import { Link } from "@exifi/ui/components/Link";

const StatusComponent = () => {
  const dateFormatter = useDateFormatter();

  return (
    <div className="container py-8">
      <DataList>
        <DataListItem className="max-sm:flex-col!">
          <DataListItemLabel className="min-w-40">Build time</DataListItemLabel>
          <DataListItemValue>
            {dateFormatter.format(
              Temporal.Instant.fromEpochMilliseconds(__BUILD_TIMESTAMP__),
            )}
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
            {import.meta.env.COMMIT_REF !== undefined ? (
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
    </div>
  );
};

const Route = createFileRoute("/(static)/status/")({
  head: () => ({
    meta: seo({
      title: "Status | exifi",
      description: "Exifi status page",
    }),
  }),
  component: StatusComponent,
});

export { Route };
