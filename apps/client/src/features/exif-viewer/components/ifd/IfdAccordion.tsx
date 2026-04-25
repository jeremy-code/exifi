import type { ExifData } from "libexif-wasm";

import { Accordion } from "@exifi/ui/components/Accordion";

import { IfdAccordionItem } from "./IfdAccordionItem";

const IfdAccordion = ({ exifData }: { exifData: ExifData }) => {
  return (
    <Accordion
      // Expand all nonempty IFDs
      defaultValue={exifData.ifd
        .filter((ifd) => ifd.count !== 0)
        .map((ifd) => ifd.ifd)
        .filter((ifd) => ifd !== null)}
      variant="enclosed"
      type="multiple"
      size="lg"
      className="shadow-sm"
    >
      {exifData.ifd.map((ifd) => (
        <IfdAccordionItem key={ifd.byteOffset} exifContent={ifd} />
      ))}
    </Accordion>
  );
};

export { IfdAccordion };
