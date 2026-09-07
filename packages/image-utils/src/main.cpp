#include <emscripten/bind.h>

#include "codecs/jpeg.h"
#include "codecs/png.h"
#include "codecs/webp.h"
#include "common.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(image_utils) {
  register_type<Uint8Array>("Uint8Array");
  register_optional<Uint8Array>();

  function("jpeg_set_exif_data(jpeg_data, exif_data)", &jpeg_set_exif_data);

  function("png_get_exif_data(png_data)", &png_get_exif_data);
  function("png_set_exif_data(png_data, exif_data)", &png_set_exif_data);

  function("webp_get_exif_data(webp_data)", &webp_get_exif_data);
  function("webp_set_exif_data(webp_data, exif_data)", &webp_set_exif_data);
}
