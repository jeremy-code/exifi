#include <heic.h>

#include "heic.h"

using namespace emscripten;

// "Exif\0\0"
constexpr unsigned char ExifHeader[6] = {0x45, 0x78, 0x69, 0x66, 0x00, 0x00};

std::optional<Uint8Array> heic_get_exif_data(const std::string heic_data) {
  heic_init();
  heic_ctx *ctx = heic_ctx_new(NULL, NULL, NULL, NULL);
  heic_doc *doc =
      heic_doc_open(ctx, reinterpret_cast<const uint8_t *>(heic_data.data()),
                    heic_data.length());
  heic_image_info info;
  heic_doc_info(doc, &info);

  uint8_t *exif_data;
  size_t exif_data_size;
  if (heic_doc_exif(doc, &exif_data, &exif_data_size)) {
    auto *output = static_cast<unsigned char *>(
        malloc(std::size(ExifHeader) + exif_data_size));

    memcpy(output, ExifHeader, std::size(ExifHeader));
    memcpy(output + std::size(ExifHeader), exif_data, exif_data_size);

    heic_free(ctx, exif_data);
    heic_doc_close(doc);
    heic_ctx_free(ctx);
    return std::optional<Uint8Array>{Uint8Array(val(
        typed_memory_view(std::size(ExifHeader) + exif_data_size, output)))};
  }
  heic_doc_close(doc);
  heic_ctx_free(ctx);
  return std::nullopt;
}
