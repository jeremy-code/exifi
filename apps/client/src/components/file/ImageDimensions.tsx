import { use } from "react";

type ImageDimensionsPromise = {
  imageDimensionsPromise: Promise<{ width: number; height: number }>;
};

const ImageDimensions = ({
  imageDimensionsPromise,
}: ImageDimensionsPromise) => {
  const imageDimensions = use(imageDimensionsPromise);

  return imageDimensions.width !== 0 && imageDimensions.height !== 0 ?
      `${imageDimensions?.width}px \u00d7 ${imageDimensions?.height}px`
    : "Unknown";
};

export { ImageDimensions };
