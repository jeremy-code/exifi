type ResizeImageOptions = {
  width: number;
  height: number;
};

const resizeImage = async (
  image: ImageBitmapSource,
  { width, height }: ResizeImageOptions,
): Promise<Blob> => {
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const imageBitmapRenderingContext =
    offscreenCanvas.getContext("bitmaprenderer");

  if (imageBitmapRenderingContext === null) {
    throw new Error("Unable to get bitmap rendering context");
  }

  const imageBitmap = await createImageBitmap(image, {
    resizeWidth: width,
    resizeHeight: height,
    resizeQuality: "low",
  });

  imageBitmapRenderingContext.transferFromImageBitmap(imageBitmap);
  imageBitmap.close();

  const blob = await offscreenCanvas.convertToBlob({ type: "image/jpeg" });

  return blob;
};

export { resizeImage };
