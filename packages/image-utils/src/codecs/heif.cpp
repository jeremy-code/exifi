#include "heif.h"

#include <cstdlib>
#include <cstring>

#include <iterator>
#include <optional>
#include <string>

#include <emscripten/val.h>
#include <libheif/heif_context.h>
#include <libheif/heif_image_handle.h>
#include <libheif/heif_metadata.h>

#include "../common.h"
#include "../constants.h"

// Read the first four bytes as big-endian uint32_t
constexpr uint32_t read_be32(const uint8_t *data) noexcept {
  return (static_cast<uint32_t>(data[0]) << 24) |
         (static_cast<uint32_t>(data[1]) << 16) |
         (static_cast<uint32_t>(data[2]) << 8) | static_cast<uint32_t>(data[3]);
}

std::optional<Uint8Array>
heif_get_exif_data(const std::string heif_data) noexcept {
  struct heif_context *ctx = heif_context_alloc();

  struct heif_error read_err = heif_context_read_from_memory_without_copy(
      ctx, heif_data.data(), heif_data.size(),
      /* heif_reading_options */ nullptr);

  if (read_err.code != heif_error_Ok) {
    heif_context_free(ctx);
    return std::nullopt;
  }

  struct heif_image_handle *image_handle;
  heif_context_get_primary_image_handle(ctx, &image_handle);

  heif_item_id exif_item_id;
  int n = heif_image_handle_get_list_of_metadata_block_IDs(
      image_handle, "Exif", &exif_item_id, /* count */ 1);

  std::optional<Uint8Array> output = std::nullopt;

  if (n == 1) {
    size_t heif_exif_size =
        heif_image_handle_get_metadata_size(image_handle, exif_item_id);
    uint8_t *heif_exif_data =
        static_cast<uint8_t *>(std::malloc(heif_exif_size));

    if (heif_exif_data != nullptr) {
      struct heif_error metadata_err = heif_image_handle_get_metadata(
          image_handle, exif_item_id, heif_exif_data);

      if (metadata_err.code == heif_error_Ok && heif_exif_size >= 4) {
        // If tiff_offset is 10, then there is an Exif header (Exif\0\0). If
        // tiff_offset is 4, then it is followed directly by the TIFF header
        // (MM/II). It seems that based on my experiences, HEIC will have the
        // header while AVIF will not. Since we always want the Exif header, use
        // this offset to normalize the output
        // https://github.com/Exiv2/exiv2/issues/2162#issuecomment-1079000778
        // https://github.com/strukturag/libheif/blob/eda8f2dc3670d7c07cee3769b247476f86229c24/libheif/api/libheif/heif_metadata.h#L80-L81
        const uint64_t tiff_offset = read_be32(heif_exif_data) + 4ULL;

        if (tiff_offset < heif_exif_size) {
          const size_t exif_size = std::size(constants::kExifHeader) +
                                   (heif_exif_size - tiff_offset);
          auto *exif_data = static_cast<uint8_t *>(std::malloc(exif_size));

          if (exif_data != nullptr) {
            std::memcpy(exif_data, constants::kExifHeader,
                        std::size(constants::kExifHeader));
            std::memcpy(exif_data + std::size(constants::kExifHeader),
                        heif_exif_data + tiff_offset,
                        heif_exif_size - tiff_offset);
            output = Uint8Array(emscripten::val(
                emscripten::typed_memory_view(exif_size, exif_data)));
          }
        }
      }
      std::free(heif_exif_data);
    }
  }

  heif_image_handle_release(image_handle);
  heif_context_free(ctx);
  return output;
}
