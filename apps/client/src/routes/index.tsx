// eslint-disable

import type { ReactNode } from "react";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
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
  key: string;
  title: ReactNode;
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

const FEATURES = [
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
    key: "overview.feature1",
    title: <ParaglideMessage message={m["overview.feature1.title"]} />,
    description: (
      <ParaglideMessage
        message={m["overview.feature1.description"]}
        markup={{ em: (props) => <em {...props} /> }}
      />
    ),
  },
  {
    icon: <Cog className="size-5" />,
    key: "overview.feature2",
    title: <ParaglideMessage message={m["overview.feature2.title"]} />,
    description: (
      <ParaglideMessage
        message={m["overview.feature2.description"]}
        markup={{
          link: (props) => (
            <Link
              color="link"
              underline="hover"
              {...props.options}
              {...props}
            />
          ),
        }}
      />
    ),
  },
  {
    icon: <Zap className="size-5 fill-current stroke-0" />,
    key: "overview.feature3",
    title: <ParaglideMessage message={m["overview.feature3.title"]} />,
    description: (
      <ParaglideMessage message={m["overview.feature3.description"]} />
    ),
  },
] satisfies FeatureCardProps[];

const FAQS = [
  {
    question: "What is this?",
    answer: (
      <span>
        {
          "exifi is an open-source (MIT) tool to view and edit Exif data in the browser. It uses the C library "
        }
        <Link color="link" href="https://github.com/libexif/libexif">
          libexif
        </Link>
        {" compiled to WebAssembly ("}
        <Link color="link" href="https://github.com/jeremy-code/libexif-wasm">
          libexif-wasm
        </Link>
        {"). "}
        {"It also makes use of the following C libraries for image writing: "}
        <Link color="link" href="https://www.ijg.org">
          libjpeg
        </Link>
        {", "}
        <Link color="link" href="https://github.com/pnggroup/libpng">
          libpng
        </Link>
        {", "}
        <Link
          color="link"
          href="https://chromium.googlesource.com/webm/libwebp"
        >
          libwebp
        </Link>
        {", and "}
        <Link color="link" href="https://github.com/kjk/heicdec">
          heicdec
        </Link>
        {"."}
      </span>
    ),
  },
  {
    question: "What image formats are supported?",
    answer: (
      <span>
        {
          "JPEG images, PNG images, WebP images, raw Exif metadata files are supported. HEIC, HEIF, and AVIF images are supported on a read-only basis. For more information, see "
        }
        <Link
          color="link"
          href="https://github.com/jeremy-code/exifi/issues/13"
        >
          jeremy-code/exifi#13
        </Link>
        {"."}
      </span>
    ),
  },
  {
    question:
      "Why should I use this over a specialized tool like ExifTool or Adobe Lightroom?",
    answer: (
      <span>
        {
          "Realistically, if you are a photographer or someone who edits images on a frequent basis, you probably should be using a specialized tool for the job. "
        }
        {"These may include: "}
        <Link color="link" href="https://exiftool.org/">
          ExifTool
        </Link>{" "}
        {" by Phil Harvey"}
        {", "}
        <Link color="link" href="https://www.darktable.org/">
          darktable
        </Link>
        {", "}
        <Link color="link" href="https://lightroom.adobe.com/">
          Adobe Lightroom
        </Link>
        {", or many other software. "}
        {
          "This is more of a service for those who want to quickly add a little bit of metadata to their images quickly online without having to upload them to someone's server."
        }
      </span>
    ),
  },
  {
    question: "What image metadata can be viewed or edited?",
    answer: (
      <span>
        {
          "Only the Exif standard 2.1 and most of 2.2 are supported. Other metadata that may be stored, such as XMP, are not supported. "
        }
        {
          "This also means that Exif data defined by the XMP namespace for Exif ("
        }
        <Link
          color="link"
          href="https://developer.adobe.com/xmp/docs/xmp-namespaces/exif/"
        >
          EXIF namespace
        </Link>
        {") is also not supported. "}
        {
          "For more information on the Exif specification, see the Wikipedia article on "
        }
        <Link color="link" href="https://en.wikipedia.org/wiki/Exif">
          Exif
        </Link>
        {" or or view the official Exif 2.21 standard published by JEITA "}
        <Link
          color="link"
          href="https://web.archive.org/web/20160429150748/http://www.jeita.or.jp/cgi-bin/standard_e/pdf.cgi?jk_n=47&jk_pdf_file=CP-3451B-E.pdf"
        >
          at this URL
        </Link>{" "}
        <span>
          {"(or in "}
          <Link
            color="link"
            href="http://www.jeita.or.jp/cgi-bin/standard_e/pdf.cgi?jk_n=46&jk_pdf_file=CP-3451B-J.pdf"
          >
            Japanese
          </Link>
          {")"}
        </span>
        {". "}
      </span>
    ),
  },
  {
    question: "How do I read Exif data from a link?",
    answer: (
      <span>
        {"You can open a link with a URL search parameter like this: "}
        <RouterLink
          to="/viewer"
          className="inline"
          search={{
            url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg",
          }}
        >
          {
            new URL(
              `viewer?url=https://upload.wikimedia.org/wikipedia/commons/c/c9/Metadata_demo_exif_only.jpg`,
              getBaseUrl(),
            ).href
          }
        </RouterLink>
        {"."}
      </span>
    ),
  },
  {
    question: "Can this be used offline?",
    answer: (
      <span>
        {"Yes! exifi can be used as a progressive web app ("}
        <abbr>PWA</abbr>
        {"). "}
        {
          "For more information on how to install a PWA, see this guide by MDN: "
        }
        <Link
          color="link"
          href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing"
        >
          Installing and uninstalling web apps
        </Link>
        {"."}
      </span>
    ),
  },
  {
    question: "What are some useful tags someone may want to add?",
    answer: (
      <span>
        <ol className="list-outside list-disc pl-[1.35em]">
          <li>
            {
              "Tags that provide additional textual information include: ImageDescription, Artist, Copyright, XPTitle, XPAuthor, XPKeywords, XPSubject, and CameraOwnerName"
            }
          </li>
          <li>
            {
              'GPS data such as Longitude, Latitude can be added or edited accordingly in the "Edit GPS" menu'
            }
          </li>
          <li>
            {
              "DateTime/OffsetTime or their variants, DateTimeOriginal/OffsetTimeOriginal or DateTimeDigitized/OffsetTimeDigitized can also be edited"
            }
          </li>
        </ol>
        <RouterLink color="link" to="/tags">
          A full list of tags can be found here.
        </RouterLink>
      </span>
    ),
  },
  {
    question: "What is an IFD?",
    answer: (
      <span>
        An Image File Domain (<abbr>IFD</abbr>)
        {
          " refers to the type of data an Exif entry pertains to. There are five IFDs for Exif data: "
        }
        <ol className="list-outside list-disc pl-[1.35em]">
          <li>
            <strong>IFD 0</strong>
            {
              " refers to the main data regarding the image (X or Y-Resolution, ImageDescription, Model, etc.)."
            }
          </li>
          <li>
            <strong>IFD 1</strong>
            {
              " refers to data regarding the thumbnail of the image. If a tag is avaliable in both IFD 0 and IFD 1, you probably want to put it in IFD 0."
            }
          </li>
          <li>
            {"The "}
            <strong>Exif IFD</strong>
            {
              " refers to additional miscellanous metadata on the image (e.g. ExifVersion, ColorSpace, ExposureTime, etc.)."
            }
          </li>
          <li>
            {"The "}
            <strong>GPS IFD</strong>
            {
              " refers to geographic data relevant to the image (e.g. Latitude, Longitude)."
            }
          </li>
          <li>
            {"The "}
            <strong>Interoperability IFD</strong>
            {
              " refers to interoperability tags (InteroperabilityIndex and/or InteroperabilityVersion)."
            }
          </li>
        </ol>
        {"For more information, see "}
        <Link color="link" href="https://en.wikipedia.org/wiki/Exif#Technical">
          Wikipedia:Exif#Technical
        </Link>
        {"."}
      </span>
    ),
  },
  {
    question: "What is MakerNote data?",
    answer: (
      <span>
        {
          "MakerNote data is stored a special tag in the Exif IFD reserved exclusively for manufacturer-specific binary data."
        }
        {" For more information, see "}
        <Link
          color="link"
          href="https://en.wikipedia.org/wiki/Exif#MakerNote_data"
        >
          Wikipedia:Exif#MakerNote data
        </Link>
        {". "}
        {"Currently, libexif is able of decoding the following manufacturers: "}
        <Link
          color="link"
          href="https://github.com/libexif/libexif/tree/master/libexif/canon"
        >
          Canon
        </Link>
        {", "}
        <Link
          color="link"
          href="https://github.com/libexif/libexif/tree/master/libexif/fuji"
        >
          Fuji
        </Link>
        {", "}
        <Link
          color="link"
          href="https://github.com/libexif/libexif/tree/master/libexif/olympus"
        >
          Olympus
        </Link>
        {" (Epson, Sanyo) , and "}
        <Link
          color="link"
          href="https://github.com/libexif/libexif/tree/master/libexif/pentax"
        >
          Pentax
        </Link>
        {" (Casio) ."}
      </span>
    ),
  },
  {
    question: "Why is exifi not correctly reading my PNG's Exif data?",
    answer: (
      <span>
        {"In July 2017, "}
        <Link
          color="blue"
          href="http://ftp-osl.osuosl.org/pub/libpng/documents/pngext-1.5.0.html#C.eXIf"
        >
          version 1.5.0 of the extensions to the PNG 1.2 Specification
        </Link>
        {" added support for a eXIf chunk in PNGs that stored Exif metadata. "}
        {
          'Previously, legacy encoders stored Exif data in nonstandard methods. For example, ImageMagick stored Exif information in a "Raw profile type APP1" zTXt chunk whereas Photoshop stored it in a "Raw profile type exif" zTXt chunk. '
        }
        {
          "Furthermore, some PNG encoders will, when converting from JPEG, choose to encode Exif data as XMP data under the "
        }
        <Link
          color="link"
          href="https://developer.adobe.com/xmp/docs/xmp-namespaces/exif/"
        >
          EXIF namespace
        </Link>
        {". "}
        {
          "Since read and write support for PNGs is handled by libpng reading the eXIf chunk specifically, you may experience false negatives for older PNGs where exifi claims that an image has no Exif data when it was actually stored somewhere else."
        }
      </span>
    ),
  },
  {
    question:
      "I am looking for a web app to remove all metadata from my photos, is exifi for me?",
    answer: (
      <span>
        No, exifi only is capable of reading Exif metadata and not other forms
        of metadata such as XMP. You probably should look towards something like
        Google Chrome Lab's{" "}
        <Link color="link" href="https://squoosh.app/">
          squoosh.app
        </Link>
        , which also uses WebAssembly to handle image encoding directly in the
        browser and most importantly, <em>only</em> preserves image data.
      </span>
    ),
  },
];

const HomeComponent = () => {
  return (
    <main className="container py-8">
      <div className="grid max-h-dvh min-h-80 place-content-center gap-8">
        <Heading level={1} size="4xl">
          {m["hero.title"]()}
        </Heading>
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <RouterLink
            to="/viewer"
            underline={false}
            className={(renderProps) =>
              buttonVariants({ color: "accent", ...renderProps })
            }
          >
            {m["hero.ctaViewer"]()}
          </RouterLink>
          <RouterLink
            to="/editor"
            underline={false}
            className={(renderProps) =>
              buttonVariants({ variant: "ghost", ...renderProps })
            }
          >
            {m["hero.ctaEditor"]()}
          </RouterLink>
        </div>
      </div>
      <div className="pt-16">
        <div className="text-center">
          <Heading level={2} size="3xl" id="features">
            {m["overview.title"]()}
          </Heading>
        </div>
        <div className="mt-12">
          <dl className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((informationItem) => (
              <FeatureCard {...informationItem} key={informationItem.key} />
            ))}
          </dl>
        </div>
      </div>
      <div className="py-16">
        <div className="text-center">
          <Heading level={2} size="3xl" id="faq">
            {m["faq.title"]()}
          </Heading>
        </div>
        <div className="mt-12">
          <Accordion variant="enclosed" allowsMultipleExpanded>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question}>
                <AccordionHeader>{faq.question}</AccordionHeader>
                <AccordionPanel className="leading-relaxed text-fg-muted">
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
};

const Route = createFileRoute("/")({
  component: HomeComponent,
});

export { Route };
