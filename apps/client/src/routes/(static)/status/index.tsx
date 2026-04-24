import { createFileRoute } from "@tanstack/react-router";

import { dayjs } from "#utils/date";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@exiftools/ui/components/DataList";
import { Link } from "@exiftools/ui/components/Link";

const StatusComponent = () => {
  return (
    <div className="container py-8">
      <DataList>
        <DataListItem className="max-sm:flex-col!">
          <DataListItemLabel className="min-w-40">Build time</DataListItemLabel>
          <DataListItemValue>
            {dayjs(__BUILD_TIMESTAMP__).format("dddd, D MMMM YYYY, h:mmA z")}
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
            {import.meta.env.COMMIT_REF !== undefined ?
              <Link
                isExternal
                href={`https://www.github.com/jeremy-code/exiftools/commit/${import.meta.env.COMMIT_REF}`}
              >
                {import.meta.env.COMMIT_REF}
              </Link>
            : "Unknown commit"}
          </DataListItemValue>
        </DataListItem>
      </DataList>
    </div>
  );
};

const Route = createFileRoute("/(static)/status/")({
  component: StatusComponent,
});

export { Route };
