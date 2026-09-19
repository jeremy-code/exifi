import { use } from "react";

import type { ImageType } from "image-dimensions";

import { m } from "#paraglide/messages";

type ImageDimensionsPromise = {
  imageDimensionsPromise: Promise<
    { width: number; height: number; type: ImageType } | undefined
  >;
};

const ImageDimensions = ({
  imageDimensionsPromise,
}: ImageDimensionsPromise) => {
  const imageDimensions = use(imageDimensionsPromise);

  if (imageDimensions === undefined) {
    return m["fileInformation.dimensionsUnknown"]();
  }

  return m["fileInformation.dimensionsPx"](imageDimensions);
};

export { ImageDimensions };
