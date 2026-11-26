import { use } from "react";

import type { ImageType } from "image-dimensions";
import { useNumberFormatter } from "react-aria/useNumberFormatter";

import { m } from "#paraglide/messages";

type ImageDimensionsPromise = {
  imageDimensionsPromise: Promise<
    { width: number; height: number; type: ImageType } | undefined
  >;
};

const ImageDimensions = ({
  imageDimensionsPromise,
}: ImageDimensionsPromise) => {
  // Pixel is not a valid unit for `Intl.NumberFormat`
  const numberFormatter = useNumberFormatter();
  const imageDimensions = use(imageDimensionsPromise);

  if (imageDimensions === undefined) {
    return m.files_unknown();
  }

  return m.files_image_dimensions({
    width: numberFormatter.format(imageDimensions.width),
    height: numberFormatter.format(imageDimensions.height),
  });
};

export { ImageDimensions };
