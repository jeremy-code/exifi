import type { ReactNode } from "react";

import {
  ParaglideMessage,
  type MarkupRenderer,
} from "@inlang/paraglide-js-react";
import { createFileRoute } from "@tanstack/react-router";
import { Cog, Lock, Zap } from "lucide-react";

import { Link as RouterLink } from "#components/common/Link";
import { m } from "#paraglide/messages";
import { getBaseUrl } from "#utils/getBaseUrl";
import {
  Accordion,
  AccordionHeader,
  AccordionPanel,
  AccordionItem,
} from "@exifi/ui/components/Accordion";
import { buttonVariants } from "@exifi/ui/components/Button";
import { Card } from "@exifi/ui/components/Card";
import { Heading } from "@exifi/ui/components/Heading";
import { Link } from "@exifi/ui/components/Link";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="p-6">
      <dt className="text-lg font-semibold">
        <div className="mb-4 grid size-10 place-content-center rounded-md border border-blue-200 bg-blue-100 text-accent dark:border-blue-700 dark:bg-accent dark:text-accent-fg">
          {icon}
        </div>
        {title}
      </dt>
      <dd className="mt-4 text-fg-muted">{description}</dd>
    </Card>
  );
};

const paraglideMessageMarkup = {
  link: ({ children, options }) => {
    if (typeof options.href !== "string") {
      throw new Error(
        `'href' was not found in options: ${JSON.stringify(options)}`,
      );
    }
    return (
      <Link href={options.href} color="link">
        {children}
      </Link>
    );
  },
  em: ({ children }) => <em>{children}</em>,
  strong: ({ children }) => <strong>{children}</strong>,
  abbr: ({ children }) => <abbr>{children}</abbr>,
} satisfies Record<string, MarkupRenderer<unknown>>;

const getFeatures = () =>
  [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <Lock />
          <rect
            fill="currentcolor"
            width="18"
            height="11"
            x="3"
            y="11"
            rx="2"
            ry="2"
          />
        </svg>
      ),
      id: "private",
      title: m.home_feature_private_title(),
      description: (
        <span>
          <ParaglideMessage
            message={m.home_feature_private_description}
            markup={paraglideMessageMarkup}
          />
        </span>
      ),
    },
    {
      icon: <Cog className="size-5" />,
      id: "standardized",
      title: m.home_feature_standardized_title(),
      description: (
        <ParaglideMessage
          message={m.home_feature_standardized_description}
          inputs={{
            libexifWasmUrl: "https://www.npmjs.com/package/libexif-wasm",
            libexifUrl: "https://libexif.github.io/",
          }}
          markup={paraglideMessageMarkup}
        />
      ),
    },
    {
      icon: <Zap className="size-5 fill-current stroke-0" />,
      id: "convenient",
      title: m.home_feature_convenient_title(),
      description: m.home_feature_convenient_description(),
    },
  ] satisfies (FeatureCardProps & { id: string })[];

const getFaqs = () => [
  {
    id: "what",
    question: m.home_faq_what_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_what_answer}
          inputs={{
            libexifUrl: "https://github.com/libexif/libexif",
            libexifWasmUrl: "https://github.com/jeremy-code/libexif-wasm",
            libpngUrl: "https://github.com/pnggroup/libpng",
            libjpegUrl: "https://ijg.org",
            libwebpUrl: "https://chromium.googlesource.com/webm/libwebp",
            libheifUrl: "https://github.com/strukturag/libheif",
          }}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "formats",
    question: m.home_faq_formats_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_formats_answer}
          inputs={{
            issueUrl: "https://github.com/jeremy-code/exifi/issues/13",
          }}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "specialized",
    question: m.home_faq_specialized_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_specialized_answer}
          inputs={{
            exifToolUrl: "https://exiftool.org/",
            darktableUrl: "https://www.darktable.org/",
            lightroomUrl: "https://lightroom.adobe.com/",
          }}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "metadata",
    question: m.home_faq_metadata_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_metadata_answer}
          inputs={{
            xmpExifUrl:
              "https://developer.adobe.com/xmp/docs/xmp-namespaces/exif/",
            jeitaUrl:
              "https://web.archive.org/web/20160429150748/http://www.jeita.or.jp/cgi-bin/standard_e/pdf.cgi?jk_n=47&jk_pdf_file=CP-3451B-E.pdf",
            jeitaJapaneseUrl:
              "http://www.jeita.or.jp/cgi-bin/standard_e/pdf.cgi?jk_n=46&jk_pdf_file=CP-3451B-J.pdf",
          }}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "link",
    question: m.home_faq_link_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_link_answer}
          inputs={{
            viewerUrl: new URL(
              `viewer?url=https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg`,
              getBaseUrl(),
            ).href,
          }}
          markup={{
            viewerLink: ({ children, options }) => (
              <RouterLink
                to="/viewer"
                className="inline"
                search={{
                  url:
                    // oxlint-disable-next-line typescript/no-base-to-string -- options.url is a string
                    new URL(String(options.url)).searchParams.get("url") ?? "",
                }}
              >
                {children}
              </RouterLink>
            ),
          }}
        />
      </span>
    ),
  },
  {
    id: "offline",
    question: m.home_faq_offline_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_offline_answer}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "tags",
    question: m.home_faq_tags_question(),
    answer: (
      <span>
        <ol className="list-outside list-disc pl-[1.35em]">
          <li>{m.home_faq_tags_text_item()}</li>
          <li>{m.home_faq_tags_gps_item()}</li>
          <li>{m.home_faq_tags_date_item()}</li>
        </ol>
        <RouterLink color="link" to="/tags">
          {m.home_faq_tags_full_list_link()}
        </RouterLink>
      </span>
    ),
  },
  {
    id: "ifd",
    question: m.home_faq_ifd_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_ifd_intro}
          markup={paraglideMessageMarkup}
        />{" "}
        <ol className="list-outside list-disc pl-[1.35em]">
          <li>
            <ParaglideMessage
              message={m.home_faq_ifd_ifd0_item}
              markup={paraglideMessageMarkup}
            />
          </li>
          <li>
            <ParaglideMessage
              message={m.home_faq_ifd_ifd1_item}
              markup={paraglideMessageMarkup}
            />
          </li>
          <li>
            <ParaglideMessage
              message={m.home_faq_ifd_exif_item}
              markup={paraglideMessageMarkup}
            />
          </li>
          <li>
            <ParaglideMessage
              message={m.home_faq_ifd_gps_item}
              markup={paraglideMessageMarkup}
            />
          </li>
          <li>
            <ParaglideMessage
              message={m.home_faq_ifd_interoperability_item}
              markup={paraglideMessageMarkup}
            />
          </li>
        </ol>
        <ParaglideMessage
          message={m.home_faq_ifd_outro}
          inputs={{
            wikipediaUrl: "https://en.wikipedia.org/wiki/Exif#Technical",
          }}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "makernote",
    question: m.home_faq_makernote_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_makernote_answer}
          inputs={{
            wikipediaUrl: "https://en.wikipedia.org/wiki/Exif#MakerNote_data",
            canonUrl:
              "https://github.com/libexif/libexif/tree/master/libexif/canon",
            fujiUrl:
              "https://github.com/libexif/libexif/tree/master/libexif/fuji",
            olympusUrl:
              "https://github.com/libexif/libexif/tree/master/libexif/olympus",
            pentaxUrl:
              "https://github.com/libexif/libexif/tree/master/libexif/pentax",
          }}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "png",
    question: m.home_faq_png_question(),
    answer: (
      <span>
        <ParaglideMessage
          message={m.home_faq_png_answer}
          inputs={{
            specUrl:
              "http://ftp-osl.osuosl.org/pub/libpng/documents/pngext-1.5.0.html#C.eXIf",
            xmpExifUrl:
              "https://developer.adobe.com/xmp/docs/xmp-namespaces/exif/",
          }}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
  {
    id: "remove",
    question: m.home_faq_remove_question(),
    answer: (
      <span>
        <ParaglideMessage
          inputs={{
            squooshUrl: "https://squoosh.app/",
          }}
          message={m.home_faq_remove_answer}
          markup={paraglideMessageMarkup}
        />
      </span>
    ),
  },
];

const HomeComponent = () => {
  return (
    <div className="container py-8">
      <div className="grid max-h-dvh min-h-80 place-content-center gap-8">
        <Heading level={1} size="4xl">
          {m.home_hero_heading()}
        </Heading>
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <RouterLink
            to="/viewer"
            underline={false}
            className={(renderProps) =>
              buttonVariants({
                color: "accent",
                variant: "surface",
                ...renderProps,
              })
            }
          >
            {m.home_hero_view()}
          </RouterLink>
          <RouterLink
            to="/editor"
            underline={false}
            className={(renderProps) =>
              buttonVariants({ variant: "ghost", ...renderProps })
            }
          >
            {m.home_hero_edit()}
          </RouterLink>
        </div>
      </div>
      <div className="pt-16">
        <div className="text-center">
          <Heading level={2} size="3xl" id="features">
            {m.home_features_heading()}
          </Heading>
        </div>
        <div className="mt-12">
          <dl className="grid gap-6 md:grid-cols-3">
            {getFeatures().map((informationItem) => (
              <FeatureCard key={informationItem.id} {...informationItem} />
            ))}
          </dl>
        </div>
      </div>
      <div className="py-16">
        <div className="text-center">
          <Heading level={2} size="3xl" id="faq">
            {m.home_faq_heading()}
          </Heading>
        </div>
        <div className="mt-12">
          <Accordion variant="enclosed" allowsMultipleExpanded>
            {getFaqs().map((faq) => (
              <AccordionItem key={faq.id}>
                <AccordionHeader>{faq.question}</AccordionHeader>
                <AccordionPanel className="leading-relaxed text-fg-muted">
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

const Route = createFileRoute("/")({
  component: HomeComponent,
  head: () => ({
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${getBaseUrl()}/#website`,
              url: getBaseUrl(),
              name: "exifi",
            },
            {
              "@type": "WebPage",
              name: "exifi",
              url: getBaseUrl(),
              description: m.home_head_description(),
              inLanguage: "en-US",
              isPartOf: {
                "@id": `${getBaseUrl()}/#website`,
              },
            },
          ],
        }),
      },
    ],
  }),
});

export { Route };
