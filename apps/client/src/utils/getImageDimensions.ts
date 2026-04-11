const getImageDimensions = async (
  image: ImageBitmapSource,
  options?: ImageBitmapOptions,
) => {
  const imageBitmap = await createImageBitmap(image, options);
  const { width, height } = imageBitmap;
  imageBitmap.close();
  return {
    width,
    height,
  };
};

export { getImageDimensions };
