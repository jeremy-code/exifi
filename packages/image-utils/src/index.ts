import ImageUtilsModule from "@exifi/image-utils/imageUtils";

// Use top-level await to instantiate WebAssembly module, so users can import
// from a shared singleton. Ideally, this could be done automatically with
// AUTO_INIT, but besides not correctly generating types, it also did not work
// in practice
const ImageUtils = await ImageUtilsModule();

/* oxlint-disable typescript/unbound-method -- Methods do not rely on this */
export const {
  jpeg_set_exif_data,
  png_get_exif_data,
  png_set_exif_data,
  webp_get_exif_data,
  webp_set_exif_data,
} = ImageUtils;
/* oxlint-enable typescript/unbound-method */
