import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { createFileRoute } from "@tanstack/react-router";
import { useDateFormatter } from "react-aria/useDateFormatter";

import { m } from "#paraglide/messages";
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
    <main className="container flex flex-col gap-8 py-8">
      <div>
        <Heading level={1} size="2xl" className="mb-4">
          {m.gray_lucky_cobra_tear()}
        </Heading>
        <p className="text-fg-muted">
          <ParaglideMessage
            message={m["only_last_lark_roam"]}
            markup={{
              link: (props) => (
                <Link color="link" href="/license.md" {...props} />
              ),
            }}
          />
        </p>
      </div>
      <Card className="p-6">
        <DataList>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              {m.plane_caring_sawfish_advise()}
            </DataListItemLabel>
            <DataListItemValue>
              <time dateTime={buildTimestampInstant.toString()}>
                {dateFormatter.format(buildTimestampInstant)}
              </time>
            </DataListItemValue>
          </DataListItem>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              {m.lost_minor_ocelot_foster()}
            </DataListItemLabel>
            <DataListItemValue>{__LIBEXIF_WASM_VERSION__}</DataListItemValue>
          </DataListItem>
          <DataListItem className="max-sm:flex-col!">
            <DataListItemLabel className="min-w-40">
              {m.petty_noble_whale_tap()}
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
                m.acidic_formal_nils_spark()
              )}
            </DataListItemValue>
          </DataListItem>
        </DataList>
      </Card>
    </main>
  );
};

const Route = createFileRoute("/status")({
  head: () => ({
    meta: seo({
      title: "Status | exifi",
      description: "Exifi status page",
    }),
  }),
  component: StatusComponent,
});

export { Route };
